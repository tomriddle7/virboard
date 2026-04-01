import { useState, useMemo } from 'react';
import { Search, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAtom, useAtomValue } from 'jotai';
import { vtubersAtom, isDataLoadingAtom, selectedAgencyAtom, favoritesAtom } from '@/store/atoms';
import type { VtuberProfile } from '@/types/Event'

export default function Streamers() {
  const { t, i18n } = useTranslation();

  // ✨ Jotai에서 전역 데이터와 필터 상태를 가져옵니다.
  const vtubers = useAtomValue(vtubersAtom);
  const isLoading = useAtomValue(isDataLoadingAtom);
  const selectedAgency = useAtomValue(selectedAgencyAtom);

  const [searchQuery, setSearchQuery] = useState('');

  // 즐겨찾기 상태 (차후 로컬 스토리지/Jotai 연동 예정)
  const [favorites, setFavorites] = useAtom(favoritesAtom);

  // 즐겨찾기 토글 함수
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      // 이제 직접 localStorage.setItem을 호출하지 않아도 됩니다!
      return prev.includes(id)
        ? prev.filter((favId: string) => favId !== id)
        : [...prev, id];
    });
  };

  // 현재 언어 설정에 맞춰 이름을 반환하는 헬퍼 함수
  const getLocalizedName = (v: VtuberProfile) => {
    const lang = i18n.language.split('-')[0];
    if (lang === 'en' && v.name_en) return v.name_en;
    if (lang === 'ja' && v.name_ja) return v.name_ja;
    return v.name;
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

  console.log('현재 선택된 필터:', selectedAgency);
  console.log('현재 즐겨찾기 배열:', favorites);

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
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                      {vtuber.agency || '개인세'}
                    </span>
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