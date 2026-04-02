import { useState, useMemo } from 'react';
import { Search, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAtom, useAtomValue } from 'jotai';
import { vtubersAtom, isDataLoadingAtom, selectedAgencyAtom, favoritesAtom, accessTokenAtom, driveFileIdAtom } from '@/store/atoms';
import type { VtuberProfile } from '@/types/Event'

const FILE_NAME = 'virboard_favorites.json';

export default function Streamers() {
  const { t, i18n } = useTranslation();

  // ✨ Jotai에서 전역 데이터와 필터 상태를 가져옵니다.
  const vtubers = useAtomValue(vtubersAtom);
  const isLoading = useAtomValue(isDataLoadingAtom);
  const selectedAgency = useAtomValue(selectedAgencyAtom);

  const [searchQuery, setSearchQuery] = useState('');

  // 즐겨찾기 상태 (차후 로컬 스토리지/Jotai 연동 예정)
  const [favorites, setFavorites] = useAtom(favoritesAtom);

  // ✨ 추가: 로그인/동기화를 위한 상태 (추후 atoms.ts에서 전역 관리하는 것을 권장합니다)
  const accessToken = useAtomValue(accessTokenAtom); // 구글 로그인 시 발급받은 토큰
  const [driveFileId, setDriveFileId] = useAtom(driveFileIdAtom); // 드라이브 파일 ID

  // 즐겨찾기 토글 및 동기화 함수
  const toggleFavorite = async (id: string) => {
    // 1. 현재 상태를 바탕으로 새로운 배열을 먼저 계산합니다.
    const isFav = favorites.includes(id);
    const newFavorites = isFav
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];

    // 2. 화면(Jotai 상태)을 즉시 업데이트합니다. (Optimistic UI)
    setFavorites(newFavorites);

    // 3. 구글 로그인이 되어 있다면 백그라운드에서 드라이브에 저장합니다.
    if (accessToken) {
      try {
        const newFileId = await saveFavorites(accessToken, newFavorites, driveFileId);

        // 만약 최초 생성이라 driveFileId가 없었다면, 방금 만든 파일의 ID를 저장해둡니다.
        if (!driveFileId) setDriveFileId(newFileId); 
      } catch (error) {
        console.error("구글 드라이브 동기화 실패:", error);
        // 에러 시 토스트 알림을 띄우거나, setFavorites를 다시 호출해 원래 상태로 롤백할 수도 있습니다.
      }
    }
  };

  // 현재 언어 설정에 맞춰 이름을 반환하는 헬퍼 함수
  const getLocalizedName = (v: VtuberProfile) => {
    const lang = i18n.language.split('-')[0];
    if (lang === 'en' && v.name_en) return v.name_en;
    if (lang === 'ja' && v.name_ja) return v.name_ja;
    return v.name;
  };

  // ✨ 로고 이미지 경로 매핑 함수 (이미지 유효성 검사 포함)
  const getPlatformLogoInfo = (platform: string) => {
    const key = platform.toLowerCase();

    // public 폴더 내 이미지 경로 매핑
    const logoMap: { [key: string]: { name: string, src: string } } = {
      youtube: { name: 'YouTube', src: '/images/platforms/youtube.svg' },
      x: { name: 'X', src: '/images/platforms/x.svg' },
      hololive: { name: 'Hololive', src: '/images/platforms/hololive.svg' },
      chzzk: { name: '치지직', src: '/images/platforms/chzzk.svg' },
      twitch: { name: 'Twitch', src: '/images/platforms/twitch.svg' },
      cafenaver: { name: '네이버 카페', src: '/images/platforms/cafe-naver.svg' },
    };

    // 등록되지 않은 플랫폼이 들어올 경우를 대비한 안전장치
    return logoMap[key] || { name: platform, src: '/images/platforms/default_link.png' };
  };

  // ✨ 핵심: 소속 필터와 검색 필터를 결합하여 목록을 계산합니다.
  const filteredVtubers = useMemo(() => {
    return vtubers.filter(v => {
      // ✨ 4. 소속(Agency) 필터링에 즐겨찾기 로직 추가!
      let matchAgency = false;
      if (selectedAgency === 'All VTubers') {
        matchAgency = true;
      } else if (selectedAgency === 'Favorite') {
        // 즐겨찾기 필터가 선택된 경우, 내 즐겨찾기 배열에 id가 있는지 검사
        matchAgency = favorites.includes(v.id);
      } else {
        matchAgency = v.agency === selectedAgency;
      }

      if (!matchAgency) return false;

      // (검색어 필터링은 그대로 유지)
      const query = searchQuery.toLowerCase();
      const searchTarget = `${v.name} ${v.name_en || ''} ${v.name_ja || ''} ${v.agency || ''}`.toLowerCase();
      return searchTarget.includes(query);
    });
  }, [vtubers, selectedAgency, searchQuery, favorites]); // ✨ 의존성 배열에 favorites 추가

  const findFavoritesFileId = async (accessToken: string) => {
    const query = encodeURIComponent(`name='${FILE_NAME}'`);
    // spaces=appDataFolder 를 명시하여 숨김 폴더 안에서만 검색합니다.
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await response.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id; // 파일이 존재하면 ID 반환
    }
    return null; // 파일이 없으면 null 반환
  };

  const readFavorites = async (fileId: string, accessToken: string) => {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await response.json();
    return data; // 저장된 즐겨찾기 배열 반환 (예: ["vtuber_1", "vtuber_2"])
  };

  const saveFavorites = async (
    accessToken: string,
    favoritesData: string[],
    existingFileId: string | null
  ) => {
    let fileId = existingFileId;

    try {
      // 1. 파일이 구글 드라이브에 없다면, 먼저 껍데기(메타데이터) 파일부터 생성합니다.
      if (!fileId) {
        const metaRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: FILE_NAME,
            parents: ['appDataFolder'],
          }),
        });

        if (!metaRes.ok) throw new Error('메타데이터 생성 실패');
        const metaData = await metaRes.json();
        fileId = metaData.id;
      }

      // 2. 생성된 파일(또는 기존 파일)에 실제 JSON 배열 데이터를 덮어씁니다. (uploadType=media)
      if (fileId) {
        const uploadRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json', // JSON 데이터를 직접 전송
          },
          body: JSON.stringify(favoritesData),
        });

        if (!uploadRes.ok) throw new Error('파일 데이터 업로드 실패');
      }

      return fileId;
    } catch (error) {
      console.error("Save Favorites Error:", error);
      throw error;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <section className="max-w-4xl mx-auto p-4 sm:p-6 pb-20">

        {/* 검색창 영역 */}
        <div className="relative mb-8 pt-4">
          <div className="absolute inset-y-0 left-0 pl-3 pt-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('streamers.search_placeholder', { defaultValue: '이름이나 소속으로 검색해보세요...' })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
          />
        </div>

        {/* 로딩 상태 표시 */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t('common.loading', { defaultValue: '데이터를 불러오는 중입니다...' })}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredVtubers.map((vtuber) => {
                const isFav = favorites.includes(vtuber.id);
                const displayName = getLocalizedName(vtuber);
                const initial = displayName.charAt(0).toUpperCase();
                const youtube_handle = vtuber.platforms.youtube?.replace('https://www.youtube.com/', '');

                return (
                  <div
                    key={vtuber.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative group hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => toggleFavorite(vtuber.id)}
                      className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${isFav
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                          }`}
                      />
                    </button>

                    <div className="relative w-16 h-16 mb-3">
                      {youtube_handle ? (
                        <img
                          src={`https://unavatar.io/youtube/${youtube_handle}`}
                          alt={displayName}
                          className="w-16 h-16 rounded-full shadow-sm object-cover bg-gray-100 dark:bg-gray-700"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-16 h-16 rounded-full shadow-inner flex items-center justify-center text-white font-bold text-2xl absolute top-0 left-0 ${youtube_handle ? 'hidden' : ''}`}
                        style={{ backgroundColor: vtuber.color || '#cccccc' }}
                      >
                        {initial}
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1 line-clamp-1">
                      {displayName}
                    </h3>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md mb-2">
                      {vtuber.agency || '개인세'}
                    </span>

                    {/* ✨ SVG 로고를 사용한 SNS 링크 영역 */}
                    {vtuber.platforms && Object.keys(vtuber.platforms).length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-2.5 w-full border-t border-gray-100 dark:border-gray-700">
                        {Object.entries(vtuber.platforms).map(([platform, url]) => {
                          const logoInfo = getPlatformLogoInfo(platform);
                          return (
                            <a
                              key={platform}
                              href={url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()} // 카드 전체 클릭 이벤트 방지
                              className="block hover:opacity-70 transition-opacity transform hover:scale-110 duration-200"
                              title={`${logoInfo.name} 채널로 이동`}
                            >
                              <img
                                src={logoInfo.src}
                                alt={`${logoInfo.name} 로고`}
                                className="w-[18px] h-[18px] object-contain dark:brightness-110"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredVtubers.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {t('common.no_results', { defaultValue: '검색 결과가 없습니다. 😢' })}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}