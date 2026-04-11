import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAtom } from 'jotai';
import { submitModalOpenAtom, eventsAtom, vtubersAtom, isDataLoadingAtom } from '@/store/atoms';
import type { RawEvent, RawVTuber, VtuberEvent, VtuberProfile } from '@/types/Event';

import Home from '@/pages/Home';
import EventMap from '@/pages/EventMap';
import Streamers from '@/pages/Streamers';
import Labs from '@/pages/Labs';
import LabGuard from '@/components/LabGuard';
import Naming from '@/pages/naming/Index';
import Appraisal from './pages/naming/Appraisal';
import CalendarHeader from '@/components/Header';
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

        // ✨ iOS/Safari 호환성을 위한 날짜 파싱 함수 추가
        const parseDateSafe = (dateStr?: string) => {
          if (!dateStr) return new Date();
          // "2026-04-18 0:00" 형식을 "2026/04/18 0:00"으로 변환하여 파싱 에러 방어
          return new Date(dateStr.replace(/-/g, '/'));
        };

        // 이벤트 데이터 가공
        const parsedEvents: VtuberEvent[] = eventList.map((event: RawEvent) => {
          const now = new Date();

          // ✨ 1단계: DB에서 명시적으로 가져온 원본 상태를 최우선으로 저장
          let computedStatus = event.status;

          // ✨ 2단계: 보조 로직 (DB 수정을 잊었을 때만 개입하여 상태를 덮어씀)
          // 2-1. DB엔 'ongoing'이라 적혀있지만, 실제 시간이 행사 종료일을 지났을 때
          if (computedStatus === 'ongoing' && event.event_end_at) {
            const eventEndDate = new Date(event.event_end_at);
            eventEndDate.setHours(23, 59, 59, 999);
            if (now > eventEndDate) {
              computedStatus = 'ended'; // 'ended'로 강제 덮어쓰기
            }
          }

          // 2-2. DB엔 'funding'이라 적혀있지만, 조기 완료일이 있거나 마감일이 지났을 때
          if (computedStatus === 'funding') {
            if (event.funding_over_at) {
              computedStatus = 'funded'; // 조기 완료되었으므로 'funded'로 덮어쓰기
            } else if (event.funding_end_at) {
              const fundingEndDate = new Date(event.funding_end_at);
              fundingEndDate.setHours(23, 59, 59, 999);
              if (now > fundingEndDate) {
                computedStatus = 'funded'; // 기간이 지났으므로 'funded'로 덮어쓰기
              }
            }
          }

          // ✨ 3단계: 날짜(Date) 할당
          // computedStatus가 현재 시점 기준으로 'funding'이나 'funded'일때만 모금 기간을 달력에 보여주고,
          // 일반 광고('ongoing', 'ended')는 실제 행사 기간을 달력에 보여줍니다.
          const eventStart = computedStatus === 'funding' || computedStatus === 'funded'
            ? event.funding_start_at!
            : event.event_start_at;

          const eventEnd = computedStatus === 'funding' || computedStatus === 'funded'
            ? (event.funding_over_at! || event.funding_end_at!)
            : event.event_end_at;

          // 최종 객체 조립
          return {
            ...event,
            status: computedStatus, // 덮어씌워진 안전한 상태값을 주입
            start: parseDateSafe(eventStart),
            end: parseDateSafe(eventEnd),
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
        <Route path="/appraisal" element={<Appraisal />} />
        <Route path="/naming">
          <Route
            path=""
            element={
              <LabGuard>
                <Naming />
              </LabGuard>
            }
          />
          <Route path="appraisal" element={<Appraisal />} />
        </Route>
        <Route path="/labs" element={<Labs />} />
      </Routes>
      <Footer />
      <Toaster />
      {submitOpen && <SubmitPopup closeModal={closeSubmitModal} />}
    </BrowserRouter>
  );
}

export default App;