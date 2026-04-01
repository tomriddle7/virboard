import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { VtuberProfile } from '@/types/Event'; // 타입에 youtube_handle 필드가 있어야 합니다.

// 💡 Pre-requisite: types/Event.ts의 VtuberProfile 인터페이스에 
// youtube_handle?: string; // 예: "@suisei_hosimati"
// 필드가 정의되어 있어야 unavatar 서비스가 작동합니다.

export default function Streamers() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // 상태 관리
  const [vtubers, setVtubers] = useState<VtuberProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 즐겨찾기 상태 (다음 스텝에서 로컬 스토리지와 연동할 준비!)
  // 지금은 로컬 상태지만, 다음 스텝에서 Jotai나 로컬 스토리지로 변경해야 홈 달력과 연동됩니다.
  const [favorites, setFavorites] = useState<string[]>([]);

  // 1. 컴포넌트가 마운트될 때 실제 JSON 데이터를 불러옵니다.
  useEffect(() => {
    // 💡 ✨ 긴급 수정됨: `/celebration.json` 대신 `/vtubers.json`을 불러옵니다!
    // Home.tsx와 동일하게 캐싱 방지용 타임스탬프를 추가합니다.
    const timestamp = new Date().getTime();
    fetch(`/vtubers.json?t=${timestamp}`)
      .then((res) => {
        if (!res.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
        return res.json();
      })
      .then((data) => {
        // vtubers.json 데이터 구조가 Home.tsx와 동일하다면
        // data 또는 data.vtubers를 setVtubers에 넣어야 합니다.
        // 여기서는 데이터가 배열 자체라고 가정합니다.
        setVtubers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('버튜버 목록 로드 에러:', error);
        setIsLoading(false);
      });
  }, []);

  // 즐겨찾기 토글 함수
  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  // 현재 언어 설정에 맞춰 이름을 반환하는 헬퍼 함수
  const getLocalizedName = (v: VtuberProfile) => {
    const lang = i18n.language.split('-')[0];
    if (lang === 'en' && v.name_en) return v.name_en;
    if (lang === 'ja' && v.name_ja) return v.name_ja;
    return v.name; // 기본값
  };

  // 검색어 필터링 로직 (다국어 이름과 소속 모두 검색 가능하도록 처리)
  const filteredVtubers = vtubers.filter(v => {
    const query = searchQuery.toLowerCase();
    // 검색 대상 문자열을 미리 만들어둡니다.
    const searchTarget = `
      ${v.name} ${v.name_en || ''} ${v.name_ja || ''} ${v.agency || ''}
    `.toLowerCase();

    return searchTarget.includes(query);
  });

  return (
    // App.tsx에 Header, Footer가 있으므로 main 태그로 감쌉니다.
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <section className="max-w-6xl mx-auto p-4 sm:p-6 pb-20">
        {/* 상단 검색창 영역 */}
        <div className="relative mb-8 pt-4">
          <div className="absolute inset-y-0 left-0 pl-3 pt-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            // 다국어 처리: '이름이나 소속(agency)으로 검색해보세요...'
            placeholder={t('streamers.search_placeholder', { defaultValue: '이름이나 소속(agency)으로 검색해보세요...' })}
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
            {/* 버튜버 그리드 목록 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredVtubers.map((vtuber) => {
                const isFav = favorites.includes(vtuber.id);
                const displayName = getLocalizedName(vtuber);
                // 이니셜fallback용 첫 글자 추출
                const initial = displayName.charAt(0).toUpperCase();
                const youtube_handle = vtuber.platforms.youtube?.replace('https://www.youtube.com/', '');

                return (
                  <div
                    key={vtuber.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative group hover:shadow-md transition-shadow"
                  >
                    {/* 즐겨찾기 별 버튼 */}
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

                    {/* ✨ 프로필 이미지 및 Fallback 영역 */}
                    <div className="relative w-16 h-16 mb-3">
                      {/* 1. Unavatar 서비스를 이용한 유튜브 프사 자동 로드 */}
                      {youtube_handle ? (
                        <img
                          // youtube_handle은 반드시 '@핸들' 형식이어야 unavatar 서버가 인식합니다.
                          src={`https://unavatar.io/youtube/${youtube_handle}`}
                          alt={displayName}
                          className="w-16 h-16 rounded-full shadow-sm object-cover bg-gray-100 dark:bg-gray-700 transition-opacity"
                          // 중요: 로딩에 실패(`onError`)하면 해당 img 태그를 숨기고
                          // 바로 아래에 배치한 Fallback 텍스트 박스를 보여주게 하는 완벽한 안전장치입니다.
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}

                      {/* 2. ✨ Fallback 이니셜 텍스트 박스 */}
                      {/* 유튜브 핸들이 없거나, unavatar 로드 실패 시 디폴트로 보여줍니다. */}
                      {/* 처음에는 `.youtube_handle ? 'hidden' : ''` 로 숨겨두었다가 `onError`에서 드러냅니다. */}
                      <div
                        className={`w-16 h-16 rounded-full shadow-inner flex items-center justify-center text-white font-bold text-2xl absolute top-0 left-0 transition-opacity ${youtube_handle ? 'hidden' : ''}`}
                        style={{ backgroundColor: vtuber.color || '#cccccc' }}
                      >
                        {initial}
                      </div>
                    </div>

                    {/* 이름 및 소속 */}
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1 line-clamp-1" title={displayName}>
                      {displayName}
                    </h3>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md line-clamp-1">
                      {vtuber.agency || '개인세'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 검색 결과가 없을 때 */}
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