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

            {/* 스크롤 가능한 일정 목록 */}
            <div className="space-y-3 pr-2">
              {drawerData?.events
                .filter((event) => event.type !== '생일')
                .map((event, idx) => (
                  <div
                    key={idx}
                    onClick={() => onEventClick(event)}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-l-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition active:scale-[0.98]"
                    style={{ borderLeftColor: event.color || '#43c5f5' }}
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t(`event_type.${event.type}`, { defaultValue: event.type })}
                      {event.status === 'funding' && <span className="inline-block px-3 py-1 ml-2 text-xs font-bold text-white rounded-full bg-orange-500">
                        {t('event.funding')}
                      </span>}
                    </div>
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      {event.title}
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
