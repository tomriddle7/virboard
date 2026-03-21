import { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CustomToolbar, CustomEvent } from '@/components/CustomToolbar'
import DetailPopup from '@/components/DetailPopup'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { VtuberEvent, RawEvent } from '@/types/Event'

// date-fns 로컬라이저 설정 (한국어 달력 지원)
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

function Home() {
  const [date, setDate] = useState<Date>(new Date(2026, 2, 1));
  const [selectedEvent, setSelectedEvent] = useState<VtuberEvent | null>(null);
  const [events, setEvents] = useState<VtuberEvent[]>([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`${import.meta.env.BASE_URL}/celebration.json?t=${timestamp}`);
        
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
          popup={true}
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
      {selectedEvent && <DetailPopup selectedEvent={selectedEvent} closeModal={closeModal} />}
    </main>
  )
}

export default Home
