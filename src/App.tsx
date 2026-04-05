import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAtom } from 'jotai';
import { submitModalOpenAtom, eventsAtom, vtubersAtom, isDataLoadingAtom } from '@/store/atoms';
import type { RawEvent, RawVTuber, VtuberEvent, VtuberProfile } from '@/types/Event';

import Home from '@/pages/Home';
import EventMap from '@/pages/EventMap';
import Streamers from '@/pages/Streamers';
import CalendarHeader from '@/components/CalendarHeader';
import Footer from '@/components/Footer';
import SubmitPopup from '@/components/SubmitPopup';

function App() {
  // Jotai 상태 가져오기
  const [, setEvents] = useAtom(eventsAtom);
  const [, setVtubers] = useAtom(vtubersAtom);
  const [, setIsLoading] = useAtom(isDataLoadingAtom);

  const [submitOpen, setSubmitOpen] = useAtom(submitModalOpenAtom);

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
  
  const closeSubmitModal = () => setSubmitOpen(false);

  return (
    <BrowserRouter>
      <CalendarHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<EventMap />} />
        <Route path="/streamer" element={<Streamers />} />
      </Routes>
      <Footer />
      <Toaster />
      {submitOpen && <SubmitPopup closeModal={closeSubmitModal} />}
    </BrowserRouter>
  );
}

export default App;