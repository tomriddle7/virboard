import type { ToolbarProps, EventProps } from 'react-big-calendar'
import { format } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { VtuberEvent } from '@/types/Event'

// 커스텀 툴바 (ToolbarProps 타입을 적용해 안전하게 구현해요)
export const CustomToolbar: React.FC<ToolbarProps<VtuberEvent, object>> = (
  toolbar
) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };
  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };
  const goToCurrent = () => {
    toolbar.onNavigate("TODAY");
  };  

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-2">
        <button
          onClick={goToCurrent}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          오늘
        </button>
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={goToBack}
            className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            &lt;
          </button>
          <button
            onClick={goToNext}
            className="px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-r-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            &gt;
          </button>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
        {format(toolbar.date, "yyyy년 MM월")}
      </h2>
      <div className="w-[100px]">
        {/* 우측 빈 공간 (레이아웃 균형을 위해 남겨두었어요) */}
      </div>
    </div>
  );
};

// 커스텀 이벤트 UI (EventProps를 통해 event 객체의 타입을 보장받아요)
export const CustomEvent: React.FC<EventProps<VtuberEvent>> = ({ event }) => {
  return (
    <div
      className={`${event.color} text-white text-xs font-semibold px-2 py-1 mx-1 rounded-md truncate shadow-sm`}
    >
      {event.title}
    </div>
  );
}
