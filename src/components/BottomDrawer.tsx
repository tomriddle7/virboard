import { Drawer } from 'vaul';
import { useTranslation } from 'react-i18next';
import type { VtuberEvent } from '@/types/Event';

export interface DrawerDataType {
  date?: Date;
  location?: string;
  events: VtuberEvent[]; // 부모가 이미 필터링을 끝낸 순수한 데이터
}

interface BottomDrawerProps {
  drawerData: DrawerDataType | null;
  onClose: () => void;
  onEventClick: (eventId: string) => void;
}

function BottomDrawer({ drawerData, onClose, onEventClick }: BottomDrawerProps) {
  const { t } = useTranslation();

  const renderTitle = () => {
    if (!drawerData) return '';
    if (drawerData.location) return drawerData.location.split('|').join(', ');
    if (drawerData.date) {
      const month = drawerData.date.getMonth() + 1;
      const day = drawerData.date.getDate();
      return t('drawer.title', { month, day });
    }
    return '';
  };

  return (
    <Drawer.Root
      open={!!drawerData}
      onOpenChange={(open) => {
        // 서랍이 완전히 닫히는 상태(open === false)가 되면 부모의 onClose를 호출합니다.
        if (!open) onClose();
      }}
    >
      {/* Portal을 사용해 서랍이 DOM 계층 구조에 구애받지 않고 최상단에 렌더링되게 합니다 */}
      <Drawer.Portal>
        {/* 어두운 배경 (클릭 시 닫힘 기능은 vaul이 자동으로 처리합니다) */}
        <Drawer.Overlay className="fixed inset-0 bg-black/50 z-50 transition-opacity" />

        {/* 서랍 본체 */}
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-51 bg-white dark:bg-gray-900 flex flex-col rounded-t-[24px] shadow-2xl mt-24 max-h-[70vh]">
          {/* 서랍 손잡이 모양 (터치/드래그 영역) */}
          <div className="p-4 bg-transparent rounded-t-[24px] flex justify-center w-full">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>

          {/* 내부 컨텐츠 영역 */}
          <div className="px-6 pb-12 flex flex-col overflow-y-auto">
            {/* Drawer.Title은 접근성(스크린 리더 등)을 위해 필수로 권장됩니다 */}
            <Drawer.Title className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              {renderTitle()}
            </Drawer.Title>

            {/* Drawer.Description 역시 접근성을 위한 숨김 텍스트로 넣어줍니다 */}
            <Drawer.Description className="sr-only">
              {t('drawer.desc')}
            </Drawer.Description>

            {/* ✨ 핵심: 일렬 목록(space-y-3)을 2열 그리드(grid grid-cols-2)로 변경합니다! */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* ✨ Drawer는 필터링을 하지 않고, 부모가 준 events를 정렬해서 보여주기만 함 */}
              {drawerData?.events
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event.id)}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg transition active:scale-[0.98] overflow-hidden group border border-gray-100 dark:border-gray-700 flex flex-col"
                  >
                    {/* ✨ 1. 부모 박스에 shrink-0(flex 쪼그라듦 방지)과 overflow-hidden(삐져나옴 방지) 추가 */}
                    <div className="relative w-full aspect-video shrink-0 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {event.thumbnail ? (
                        <img
                          src={event.thumbnail}
                          alt={event.title}
                          // ✨ 2. 핵심: absolute inset-0을 추가해 이미지를 공중에 띄우고 16:9 박스에 강제로 가둡니다!
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        // 대체 텍스트 영역도 똑같이 꽉 채워줍니다
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                          Preparing Thumbnail
                        </div>
                      )}

                      {/* ✨ 모금중 배지를 좌측 상단(top-2 left-2)에 띄웁니다 */}
                      <div className="absolute top-2 left-2 z-10 flex gap-1.5">
                        {event.type && (
                          <span
                            className={`inline-block px-2 py-1 text-[10px] sm:text-xs font-bold text-white rounded-full ${event.color}`}
                          >
                            {t(`event_type.${event.type}`, { defaultValue: event.type })}
                          </span>
                        )}
                        {event.status && (
                          <span
                            className={`inline-block px-2 py-1 text-[10px] sm:text-xs font-bold text-white rounded-full
                              ${event.status === 'funding' ? 'bg-orange-500' : ''}
                              ${event.status === 'funded' ? 'bg-gray-500' : ''}
                              ${event.status === 'ongoing' ? 'bg-[#43c5f5]' : ''}
                              ${event.status === 'ended' ? 'bg-gray-700' : ''}
                            `}
                          >
                            {event.status === 'funding' && t('event.funding')}
                            {event.status === 'funded' && t('event.funded')}
                            {event.status === 'ongoing' && t('event.ongoing')}
                            {event.status === 'ended' && t('event.ended')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2. 텍스트 컨텐츠 영역 */}
                    <div className="p-3 sm:p-4 flex flex-col flex-grow">
                      {/* 제목 */}
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default BottomDrawer;