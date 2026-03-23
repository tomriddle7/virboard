import { useState, useEffect, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CustomToolbar, CustomEvent } from '@/components/CustomToolbar'
import DetailPopup from '@/components/DetailPopup'
import SubmitPopup from '@/components/SubmitPopup'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { VtuberEvent, RawEvent, VtuberProfile, RawVTuber } from '@/types/Event'

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
  const [submitOpen, setSubmitOpen] = useState<boolean>(false);
  const [events, setEvents] = useState<VtuberEvent[]>([]);
  const [vtubers, setVtubers] = useState<VtuberProfile[]>([]);
  // 3. 필터 상태 관리 (소속, 기수, 유닛)
  const [selectedAgency, setSelectedAgency] = useState('전체');
  const [selectedGen, setSelectedGen] = useState('전체');
  const [selectedUnit, setSelectedUnit] = useState('전체');
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const timestamp = new Date().getTime();
        const [eventList, vtuberList] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}/celebration.json?t=${timestamp}`).then(res => res.json()),
          fetch(`${import.meta.env.BASE_URL}/vtubers.json?t=${timestamp}`).then(res => res.json())
        ]);
        // const eventList = (await import('@/../public/celebration.json')).default;
        // const vtuberList = (await import('@/../public/vtubers.json')).default;

        const parsedEvents: VtuberEvent[] = eventList.map((event: RawEvent) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(parsedEvents);

        const parsedVTubers: VtuberProfile[] = vtuberList.map((event: RawVTuber) => ({
          ...event,
          birth: new Date(event.birth),
          debut: new Date(event.debut),
        }));
        setVtubers(parsedVTubers);
      } catch (error) {
        console.error("fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ✨ 1. 마스터 데이터 사전(Map) 만들기 (성능 최적화 핵심!)
  // 매번 배열을 뒤지면 느려지므로, id를 키값으로 하는 사전을 만들어 0.001초 만에 찾게 해줍니다.
  interface VTuberMap {
    [id: string]: VtuberProfile;
  }
  const vtuberMap: VTuberMap = useMemo(() => {
    const map: VTuberMap = {};
    vtubers.forEach((v: VtuberProfile) => {
      map[v.id] = v; // 예: map["holo-fubuki"] = { name: "시라카미 후부키", agency: ... }
    });
    return map;
  }, [vtubers]);

  // ✨ 2. 필터 드롭다운 옵션 추출 (이벤트가 아닌 '버튜버 마스터' 전체 목록 기준!)
  const { agencies, generations, units } = useMemo(() => {
    const agencySet = new Set<string>();
    const genSet = new Set<string>();
    const unitSet = new Set<string>();

    vtubers.forEach(v => {
      // 1. 소속(Agency)은 언제든 바꿀 수 있어야 하므로 전체를 다 담습니다.
      if (v.agency) agencySet.add(v.agency);

      // 2. 기수(Generation)는 '현재 선택된 소속'에 포함된 버튜버의 기수만 담습니다.
      const matchAgency = selectedAgency === '전체' || v.agency === selectedAgency;
      if (matchAgency && Array.isArray(v.generation)) {
        v.generation.forEach(g => genSet.add(g));
      }

      // 3. 유닛(Unit)은 '현재 선택된 소속'과 '현재 선택된 기수'까지 모두 일치하는 버튜버의 유닛만 담습니다.
      const matchGen = selectedGen === '전체' || (v.generation && v.generation.includes(selectedGen));
      if (matchAgency && matchGen && Array.isArray(v.unit)) {
        v.unit.forEach(u => unitSet.add(u));
      }
    });

    return {
      agencies: ['전체', ...Array.from(agencySet)],
      generations: ['전체', ...Array.from(genSet)],
      units: ['전체', ...Array.from(unitSet)],
    };
  }, [vtubers, selectedAgency, selectedGen]); // ✨ 의존성 배열에 선택된 필터 상태들이 추가되었습니다!

  // ✨ 3. 이벤트 필터링 (vtuber_id로 마스터 정보를 찾아와서 검사)
  const filteredEvents: VtuberEvent[] = useMemo(() => {
    return events.filter(event => {
      // 이벤트에 적힌 id로 마스터 사전을 뒤져서 버튜버 정보를 가져옵니다.
      const vtuberInfo = vtuberMap[event.vtuber_id];

      // 마스터에 정보가 없는 미등록 버튜버의 이벤트일 경우의 안전장치
      if (!vtuberInfo) {
        // 전체 보기 상태일 때만 보여주거나, 아예 false로 숨길 수 있습니다.
        return selectedAgency === '전체' && selectedGen === '전체' && selectedUnit === '전체';
      }

      // 찾아온 버튜버 마스터 정보를 바탕으로 조건에 맞는지 검사합니다!
      const matchAgency = selectedAgency === '전체' || vtuberInfo.agency === selectedAgency;
      const matchGen = selectedGen === '전체' || (vtuberInfo.generation?.includes(selectedGen) ?? false);
      const matchUnit = selectedUnit === '전체' || (vtuberInfo.unit?.includes(selectedUnit) ?? false);

      return matchAgency && matchGen && matchUnit;
    });
  }, [events, vtuberMap, selectedAgency, selectedGen, selectedUnit]);

  const closeDetailModal = () => setSelectedEvent(null);
  const closeSubmitModal = () => setSubmitOpen(false);

  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <section className="max-w-6xl mx-auto pt-6 px-0 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-4 mb-4 p-4">
            {/* 소속 드롭다운 */}
            <label className="flex flex-col text-sm font-semibold text-gray-700">
              소속
              <select
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow cursor-pointer"
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
              >
                {agencies.map(agency => (
                  <option key={agency} value={agency}>{agency}</option>
                ))}
              </select>
            </label>
            {/* 기수 드롭다운 */}
            <label className="flex flex-col text-sm font-semibold text-gray-700">
              기수
              <select
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow cursor-pointer"
                value={selectedGen}
                onChange={(e) => setSelectedGen(e.target.value)}
              >
                {generations.map(gen => (
                  <option key={gen} value={gen}>{gen}</option>
                ))}
              </select>
            </label>
            {/* 유닛 드롭다운 */}
            <label className="flex flex-col text-sm font-semibold text-gray-700">
              유닛
              <select
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow cursor-pointer"
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </label>

          </div>
          <h1 className="text-center text-[#43c5f5] text-4xl font-bold pr-14 mb-3">
            버튜버 기념일 달력
          </h1>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            onClick={() => {
              setSubmitOpen(true);
            }}>제보하기</button>
        </div>
        <div className="h-[800px] bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-900">
          <Calendar<VtuberEvent, object>
            localizer={localizer}
            events={filteredEvents}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            onSelectEvent={(event) => setSelectedEvent(event)}
            culture="ko"
            views={["month"]}
            popup={true}
            formats={{
              dayHeaderFormat: (date) => {
                return new Intl.DateTimeFormat('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                }).format(date);
              },
            }}
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
        {selectedEvent && <DetailPopup selectedEvent={selectedEvent} closeModal={closeDetailModal} />}
        {submitOpen && <SubmitPopup closeModal={closeSubmitModal} />}
      </section>
    </main>
  )
}

export default Home
