import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { VtuberEvent, VtuberProfile } from '@/types/Event'

interface DetailPopupProps {
  selectedEvent: VtuberEvent;
  closeModal: () => void;
  vtuberInfo: VtuberProfile | null;
}

function DetailPopup({ selectedEvent, closeModal, vtuberInfo }: DetailPopupProps) {
  const { t } = useTranslation();

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
      stellive: { name: '스텔라이브', src: '/images/platforms/stellive.svg' },
      liveruli: { name: '라이브루리', src: '/images/platforms/liveruli.webp' },
    };

    // 등록되지 않은 플랫폼이 들어올 경우를 대비한 안전장치
    return logoMap[key] || { name: platform, src: '/images/platforms/website.svg' };
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity pointer-events-auto"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); closeModal(); }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative border border-transparent dark:border-gray-700 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 transition-colors"
        >
          ✕
        </button>

        {/* 배지 영역 */}
        <div className="flex gap-1.5 mb-3">
          {selectedEvent.type && (
            <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full ${selectedEvent.color}`}>
              {t(`event_type.${selectedEvent.type}`, { defaultValue: selectedEvent.type })}
            </span>
          )}
          {selectedEvent.status === 'funding' && (
            <span className="inline-block px-3 py-1 text-xs font-bold text-white rounded-full bg-orange-500">
              {t('event.funding')}
            </span>
          )}
        </div>

        {/* 제목 및 날짜 */}
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 transition-colors">
          {selectedEvent.title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 dark:text-gray-400 mb-6 transition-colors">
          🗓️ {format(selectedEvent.start, "yyyy.MM.dd")}
          {selectedEvent.type !== '생일' && `~ ${format(selectedEvent.end, "yyyy.MM.dd")}`}
        </p>

        {/* 상세 정보 리스트 */}
        <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-800 transition-colors">
          {selectedEvent.location && (
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">
                📍 {t('popup.location')}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedEvent.location}
              </p>
            </div>
          )}

          {/* ✨ 핵심 수정 부분: 이벤트 타입에 따라 링크 영역을 다르게 렌더링합니다. */}
          {selectedEvent.type === '생일' ? (
            // [A] 생일일 때: platforms 객체를 배열로 변환하여 아이콘 버튼들로 나열
            (vtuberInfo?.platforms && Object.keys(vtuberInfo.platforms).length > 0) ? (
              <div>
                {/* 로고들이 큼직하게 보이도록 flex 간격을 넓혔습니다. */}
                <div className="flex flex-wrap gap-2 items-center">
                  {Object.entries(vtuberInfo.platforms).map(([platform, url]) => {
                    const logoInfo = getPlatformLogoInfo(platform);
                    return (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                        title={`${logoInfo.name} 채널로 이동`}
                      >
                        <img
                          src={logoInfo.src}
                          alt={`${logoInfo.name} 로고`}
                          className="size-6 object-contain dark:brightness-110"
                          // 혹시 로고 이미지가 없을 경우를 대비한 엑박 방지 처리
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : null
          ) : (
            // [B] 생일이 아닐 때: 기존처럼 selectedEvent.link 하나만 보여줌
            selectedEvent.link && (
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">🔗 {t('popup.source')}</p>
                <a
                  href={selectedEvent.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline transition-colors"
                >
                    {t('popup.shortcut')} &rarr;
                </a>
              </div>
            )
          )}

          {selectedEvent.memo && (
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">📝 {t('popup.memo')}</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedEvent.memo}</p>
            </div>
          )}
        </div>

        {/* 하단 확인 버튼 */}
        <div className="mt-6">
          <button
            onClick={closeModal}
            className="w-full py-3 bg-gray-800 dark:bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetailPopup