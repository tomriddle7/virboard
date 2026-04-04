import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAtom } from 'jotai';
import { eventsAtom, vtubersAtom, isDataLoadingAtom } from '@/store/atoms';
import type { RawEvent, RawVTuber, VtuberEvent, VtuberProfile } from '@/types/Event';

import Home from '@/pages/Home';
import Streamers from '@/pages/Streamers';
import CalendarHeader from '@/components/CalendarHeader';
import Footer from '@/components/Footer';

function App() {
  // Jotai 상태 가져오기
  const [, setEvents] = useAtom(eventsAtom);
  const [, setVtubers] = useAtom(vtubersAtom);
  const [, setIsLoading] = useAtom(isDataLoadingAtom);

  // ✨ 앱이 처음 켜질 때 딱 한 번만 실행되는 데이터 팩토리!
  useEffect(() => {
    (async () => {
      try {
        const timestamp = new Date().getTime();
        const [eventList, vtuberList] = await Promise.all([
          fetch(`/celebration.json?t=${timestamp}`).then(res => res.json()),
          fetch(`/vtubers.json?t=${timestamp}`).then(res => res.json())
        ]);

        // 이벤트 데이터 가공
        const parsedEvents: VtuberEvent[] = eventList.map((event: RawEvent) => {
          const eventStart = event.status === 'funding' ? event.funing_start_at! : event.event_start_at;
          const eventEnd = event.status === 'funding' ? event.funding_end_at! : event.event_end_at;
          return {
            ...event,
            start: new Date(eventStart),
            end: new Date(eventEnd),
          };
        });
        setEvents(parsedEvents);

        // 버튜버 데이터 가공
        const parsedVTubers: VtuberProfile[] = vtuberList.map((event: RawVTuber) => ({
          ...event,
          birth: new Date(event.birth),
          debut: new Date(event.debut),
        }));
        setVtubers(parsedVTubers);

      } catch (error) {
        console.error("fetch error:", error);
      } finally {
        setIsLoading(false); // 로딩 끝!
      }
    })();
  }, [setEvents, setVtubers, setIsLoading]);

  return (
    <BrowserRouter>
      <CalendarHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/streamer" element={<Streamers />} />
      </Routes>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;