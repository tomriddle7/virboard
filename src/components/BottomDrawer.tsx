// src/components/BottomDrawer.tsx

import { Drawer } from 'vaul'
import { useTranslation } from 'react-i18next'
import type { VtuberEvent } from '@/types/Event'

function BottomDrawer({
  drawerData,
  onClose,
  onEventClick,
}: {
  drawerData: { date: Date; events: VtuberEvent[] } | null;
  onClose: () => void;
  onEventClick: (event: VtuberEvent) => void;
}) {
  const { t } = useTranslation();
  // vaul은 닫히는 애니메이션 도중에도 컴포넌트를 렌더링하므로,
  // drawerData가 null이 될 때를 대비해 안전하게 값을 추출해 둡니다.
  const month = drawerData?.date ? drawerData.date.getMonth() + 1 : '';
  const day = drawerData?.date ? drawerData.date.getDate() : '';

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
              {t('drawer.title', { month, day })}
            </Drawer.Title>

            {/* Drawer.Description 역시 접근성을 위한 숨김 텍스트로 넣어줍니다 */}
            <Drawer.Description className="sr-only">
              {t('drawer.desc')}
            </Drawer.Description>

            {/* ✨ 핵심: 일렬 목록(space-y-3)을 2열 그리드(grid grid-cols-2)로 변경합니다! */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pr-2">
              {drawerData?.events
                .filter((event) => event.type !== '생일')
                // 기존의 안정 정렬(Stable Sort) 로직은 그대로 유지합니다.
                .toSorted((a, b) => {
                  const getStatusWeight = (status?: string) => {
                    if (status === 'ongoing') return 1;
                    if (status === 'funding') return 2;
                    return 3;
                  };
                  return getStatusWeight(a.status) - getStatusWeight(b.status);
                })
                .map((event, idx) => (
                  <div
                    key={idx}
                    onClick={() => onEventClick(event)}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg transition active:scale-[0.98] overflow-hidden group border border-gray-100 dark:border-gray-700 flex flex-col"
                  >
                    {/* 1. 썸네일 이미지 영역 (✨ relative를 추가해서 배지의 기준점이 되게 합니다) */}
                    <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-700">
                      {event.thumbnail ? (
                        <img
                          src={event.thumbnail}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No Thumbnail
                        </div>
                      )}

                      {/* ✨ 모금중 배지를 좌측 상단(top-2 left-2)에 띄웁니다 */}
                      {event.status === 'funding' && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="inline-block px-2 py-1 text-[10px] sm:text-xs font-bold text-white rounded-full bg-orange-500">
                            {t('event.funding', { defaultValue: '모금중' })}
                          </span>
                        </div>
                      )}
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