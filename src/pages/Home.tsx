import { useState, useEffect } from 'react'
import {
  Calendar,
  dateFnsLocalizer,
  type ToolbarProps,
  type EventProps,
} from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { VtuberEvent, RawEvent } from '@/types/Event'

// 2. date-fns 로컬라이저 설정 (한국어 달력 지원)
const locales = {
  ko: ko,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// 3. 커스텀 툴바 (ToolbarProps 타입을 적용해 안전하게 구현해요)
const CustomToolbar: React.FC<ToolbarProps<VtuberEvent, object>> = (
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

// 4. 커스텀 이벤트 UI (EventProps를 통해 event 객체의 타입을 보장받아요)
const CustomEvent: React.FC<EventProps<VtuberEvent>> = ({ event }) => {
  return (
    <div
      className={`${event.color} text-white text-xs font-semibold px-2 py-1 mx-1 rounded-md truncate shadow-sm`}
    >
      {event.title}
    </div>
  );
};

function Home() {
  const [date, setDate] = useState<Date>(new Date(2026, 2, 1));
  const [selectedEvent, setSelectedEvent] = useState<VtuberEvent | null>(null);
  const [events, setEvents] = useState<VtuberEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`${import.meta.env.BASE_URL}celebration.json?t=${timestamp}`);
        
        if (!response.ok) throw new Error("Faild to load data.");
        
        const data = await response.json();
        const parsedEvents: VtuberEvent[] = data.map((event: RawEvent) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));

        setEvents(parsedEvents);
      } catch (error) {
        console.error("fetch error:", error);
      } finally {
        setIsLoading(false);
    }
    })();
  }, []);

  const closeModal = () => setSelectedEvent(null);

  return (
    <main className="max-w-6xl mx-auto p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-center text-[#43c5f5] text-4xl font-bold mb-3">
        버튜버 기념일 달력
      </h1>
      <div className="h-[800px] bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-900">
        <Calendar<VtuberEvent, object>
          localizer={localizer}
          events={events}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          onSelectEvent={(event) => setSelectedEvent(event)}
          culture="ko"
          views={["month"]}
          components={{
            toolbar: CustomToolbar,
            event: CustomEvent,
          }}
          // 기본 인라인 배경색을 투명하게 만들어 Tailwind 클래스가 적용되게 해요
          eventPropGetter={() => ({
            style: { backgroundColor: "transparent" },
          })}
        />
      </div>
      {/* 4. 선택된 이벤트가 있을 때만 렌더링되는 모달 창 */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={closeModal} // 반투명 배경을 클릭해도 닫히게 해요
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()} // 모달 내부를 클릭했을 때는 안 닫히게 막아줘요
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>

            {/* 이벤트 타입 배지 */}
            {selectedEvent.type && (
              <span
                className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full mb-3 ${selectedEvent.color}`}
              >
                {selectedEvent.type}
              </span>
            )}

            {/* 제목 및 날짜 */}
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedEvent.title}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              🗓️ {format(selectedEvent.start, "yyyy.MM.dd")} ~{" "}
              {format(selectedEvent.end, "yyyy.MM.dd")}
            </p>

            {/* 상세 정보 리스트 */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              {selectedEvent.location && (
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1">
                    📍 위치
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {selectedEvent.location}
                  </p>
                </div>
              )}

              {selectedEvent.link && (
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1">
                    🔗 출처
                  </p>
                  <a
                    href={selectedEvent.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-indigo-500 hover:text-indigo-600 hover:underline"
                  >
                    바로가기 &rarr;
                  </a>
                </div>
              )}
              {selectedEvent.memo && (
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1">
                    📝 참고
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {selectedEvent.memo}
                  </p>
                </div>
              )}
            </div>

            {/* 하단 확인 버튼 */}
            <div className="mt-6">
              <button
                onClick={closeModal}
                className="w-full py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Home
