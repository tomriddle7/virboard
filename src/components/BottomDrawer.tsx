/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import type { VtuberEvent } from "@/types/Event";

function BottomDrawer({
    drawerData,
    onClose,
    onEventClick // 썸네일을 눌렀을 때 상세 팝업을 띄우기 위한 함수
}: {
    drawerData: { date: Date, events: VtuberEvent[] } | null,
    onClose: () => void,
    onEventClick: (event: VtuberEvent) => void
}) {
    const isOpen = !!drawerData;

    return (
        <>
            {/* 어두운 배경 (클릭 시 닫힘) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* 서랍 본체 */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-20 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    } p-6 pb-12 max-h-[60vh] flex flex-col`}
            >
                {/* 서랍 손잡이 모양 (UI 디테일) */}
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />

                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    {drawerData?.date.getMonth()! + 1}월 {drawerData?.date.getDate()}일 일정
                </h3>

                {/* 스크롤 가능한 일정 목록 */}
                <div className="overflow-y-auto space-y-3 pr-2">
                    {drawerData?.events.filter(event => event.type !== '생일').map((event, idx) => (
                        <div
                            key={idx}
                            onClick={() => onEventClick(event)}
                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-l-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            style={{ borderLeftColor: event.color || '#43c5f5' }}
                        >
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{event.type}</div>
                            <div className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default BottomDrawer;