import { useState, useEffect, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko, enUS, ja } from 'date-fns/locale'
import CalendarHeader from '@/components/CalendarHeader'
import { CustomToolbar, CustomEvent } from '@/components/CustomToolbar'
import Footer from '@/components/Footer'
import DetailPopup from '@/components/DetailPopup'
import SubmitPopup from '@/components/SubmitPopup'
import BottomDrawer from '@/components/BottomDrawer'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { VtuberEvent, RawEvent, VtuberProfile, RawVTuber } from '@/types/Event'

// date-fns 로컬라이저 설정
const locales = { ko, en: enUS, ja };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const agencyMap = new Map([
  ['Vir', 'All VTubers'],
  ['Holo', 'Hololive'],
  ['Stel', 'Stelive'],
  ['Ruli', 'Liveruli'],
  ['Indie', 'Independents'],
]);

function Home() {
  const { t, i18n } = useTranslation(); // ✨ 번역 훅 호출

  // 현재 선택된 언어의 앞 2글자(ko-KR -> ko)를 따서 캘린더 culture에 넘겨줍니다.
  const currentLang = i18n.language.split('-')[0];
  const currentLocale = locales[currentLang as keyof typeof locales] || enUS;

  const [date, setDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<VtuberEvent | null>(null);
  const [submitOpen, setSubmitOpen] = useState<boolean>(false);
  const [drawerData, setDrawerData] = useState<{ date: Date, events: VtuberEvent[] } | null>(null);
  const [events, setEvents] = useState<VtuberEvent[]>([]);
  const [vtubers, setVtubers] = useState<VtuberProfile[]>([]);
  // 3. 필터 상태 관리 (소속, 기수, 유닛)
  const [selectedAgency, setSelectedAgency] = useState(() => {
    if (typeof window !== 'undefined') {
      return agencyMap.get(localStorage.getItem('current-agency') || 'Vir');
    }
    return agencyMap.get('Vir');
  });
  const [selectedGen, setSelectedGen] = useState('전체');
  const [selectedUnit, setSelectedUnit] = useState('전체');
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const timestamp = new Date().getTime();
        const [eventList, vtuberList] = await Promise.all([
          fetch(`/celebration.json?t=${timestamp}`).then(res => res.json()),
          fetch(`/vtubers.json?t=${timestamp}`).then(res => res.json())
        ]);
        // const eventList = (await import('@/../public/celebration.json')).default;
        // const vtuberList = (await import('@/../public/vtubers.json')).default;

        const parsedEvents: VtuberEvent[] = eventList.map((event: RawEvent) => {
          // 모금중인 행사는 funding 기간 적용, 진행중인 행사는 evnet 기간 적용
          let [eventStart, eventEnd] = ['', ''];
          if (event.status === 'funding') {
            eventStart = event.funing_start_at!;
            eventEnd = event.funding_end_at!;
          } else {
            eventStart = event.event_start_at;
            eventEnd = event.event_end_at;
          }

          return {
            ...event,
            start: new Date(eventStart),
            end: new Date(eventEnd),
          };
        });
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
      const matchAgency = selectedAgency === 'All VTubers' || v.agency === selectedAgency;
      if (matchAgency && Array.isArray(v.generation)) {
        v.generation.forEach(g => genSet.add(g));
      }

      // 3. 유닛(Unit)은 '현재 선택된 소속'과 '현재 선택된 기수'까지 모두 일치하는 버튜버의 유닛만 담습니다.
      const matchGen = selectedGen === t('common.all') || (v.generation?.includes(selectedGen) ?? false);
      const matchUnit = selectedUnit === t('common.all') || (v.unit?.includes(selectedUnit) ?? false);
      if (matchAgency && matchGen && Array.isArray(v.unit)) {
        v.unit.forEach(u => unitSet.add(u));
      }
    });

    return {
      agencies: ['All VTubers', ...Array.from(agencySet)],
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
        return selectedAgency === 'All VTubers' && selectedGen === '전체' && selectedUnit === '전체';
      }

      // 찾아온 버튜버 마스터 정보를 바탕으로 조건에 맞는지 검사합니다!
      const matchAgency = selectedAgency === 'All VTubers' || vtuberInfo.agency === selectedAgency;
      const matchGen = selectedGen === '전체' || (vtuberInfo.generation?.includes(selectedGen) ?? false);
      const matchUnit = selectedUnit === '전체' || (vtuberInfo.unit?.includes(selectedUnit) ?? false);

      return matchAgency && matchGen && matchUnit;
    });
  }, [events, vtuberMap, selectedAgency, selectedGen, selectedUnit]);

  const closeDetailModal = () => setSelectedEvent(null);
  const closeSubmitModal = () => setSubmitOpen(false);
  const selectedVtuberInfo = useMemo(() => {
    if (!selectedEvent) return null;
    return vtuberMap[selectedEvent.vtuber_id];
  }, [selectedEvent, vtuberMap]);

  return (
    <>
      <CalendarHeader
        submitOpen={setSubmitOpen}
        updateAgency={setSelectedAgency}
        agencyMap={agencyMap}
      />
      <main className="bg-gray-50 dark:bg-gray-950 min-h-screen">
        <section className="max-w-6xl mx-auto pt-6 px-0 sm:px-6">
          <div className="h-[800px] bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-900">
            <Calendar<VtuberEvent, object>
              localizer={localizer}
              events={filteredEvents}
              date={date}
              onNavigate={(newDate) => setDate(newDate)}
              onSelectEvent={(event) => setSelectedEvent(event)}
              culture={currentLang}
              views={["month"]}
              popup={true}
              formats={{
                dayHeaderFormat: (date) => {
                  return new Intl.DateTimeFormat(i18n.language, {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  }).format(date);
                },
              }}
              components={{
                toolbar: CustomToolbar,
                event: CustomEvent,
                month: {
                  dateHeader: ({ label, date: headerDate }) => {
                    const dayOfWeek = headerDate.getDay();
                    const isCurrentMonth = headerDate.getMonth() === date.getMonth();

                    let textColorClass = "text-black dark:text-gray-300";
                    if (dayOfWeek === 0) textColorClass = "text-red-500";
                    if (dayOfWeek === 6) textColorClass = "text-blue-500";

                    if (!isCurrentMonth) textColorClass += " opacity-40";

                    const dayEvents = filteredEvents.filter((event) => {
                      const start = new Date(event.start).setHours(0, 0, 0, 0);
                      const end = new Date(event.end).setHours(23, 59, 59, 999);

                      const current = headerDate.getTime();
                      return current >= start && current <= end;
                    });

                    const birthdays = dayEvents.filter((event) => event.type === '생일');
                    const otherEvents = dayEvents.filter((event) => event.type !== '생일');

                    return (
                      <div>
                        <span className={`w-full text-right font-medium ${textColorClass}`}>
                          {label}
                        </span>

                        {/* ✨ 나머지 이벤트(광고 등)를 아래에 점으로 렌더링 */}
                        {otherEvents.length > 0 && (
                          <div
                            className={`bg-gray-50 text-white text-[10px] sm:text-xs font-semibold px-0.5 py-1.5 ml-1 rounded-md truncate shadow-sm ${!isCurrentMonth && 'opacity-40'}`}
                          >
                            <button className="flex flex-row flex-wrap justify-center w-full gap-1" onClick={(e) => {
                              e.stopPropagation(); // 날짜 칸 자체가 클릭되는 것을 방지
                              setDrawerData({ date: headerDate, events: dayEvents }); // 서랍 열기!
                            }}>
                              {otherEvents
                                .toSorted((a, b) => {
                                  const getStatusWeight = (status?: string) => {
                                    if (status === 'ongoing') return 1;
                                    if (status === 'funding') return 2;
                                    return 3;
                                  };
                                  return getStatusWeight(a.status) - getStatusWeight(b.status);
                                })
                                .map((event, i) => {
                                  const isOngoing = event.type !== '생일' && event.status === 'funding';

                                  // 이번 달이 아닌 날짜의 투명도 처리 클래스
                                  const opacityClass = !isCurrentMonth ? 'opacity-40' : '';

                                  return isOngoing ? (
                                    /* 🔵 [진행 중] 가운데가 빈 원 (도넛 기법) */
                                    <span
                                      key={`dot-${event.vtuber_id}-${i}`}
                                      // p-[1px] 패딩 값으로 그라데이션 테두리의 두께를 조절합니다.
                                      className={`size-1.5 p-[1px] rounded-full ${event.color} ${opacityClass}`}
                                    >
                                      {/* 안쪽 원: 달력 칸의 기본 배경색(라이트모드 흰색, 다크모드 검은색)으로 덮습니다. */}
                                      <span className="block w-full h-full rounded-full bg-gray-50" />
                                    </span>
                                  ) : (
                                    /* 🔵 [완료 또는 일반 행사] 기존의 꽉 찬 원 */
                                    <span
                                      key={`dot-${event.vtuber_id}-${i}`}
                                      className={`size-1.5 rounded-full ${event.color} ${opacityClass}`}
                                    />
                                  );
                                })}
                            </button>
                          </div>
                        )}

                        {/* ✨ 생일 이벤트를 CustomEvent 대신 여기서 직접 렌더링! */}
                        <div className="flex flex-col gap-1 mt-1 w-full">
                          {birthdays.map((event, i) => (
                            <button
                              onClick={() => {
                                setSelectedEvent(event); // 서랍 열기!
                              }}
                              key={`bday-${event.vtuber_id}-${i}`}
                              className={`${event.color} text-white text-[10px] sm:text-xs font-semibold px-1.5 py-1 ml-1 rounded-md truncate shadow-sm ${!isCurrentMonth ? 'opacity-40' : ''}`}
                            >
                              {event.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  },
                },
              }}
              // 기본 인라인 배경색을 투명하게 만들어 Tailwind 클래스가 적용되게 해요
              eventPropGetter={() => ({
                style: { backgroundColor: "transparent" },
              })}
            />
          </div>
          {/* 4. 선택된 이벤트가 있을 때만 렌더링되는 모달 창 */}
          {selectedEvent && (
            <DetailPopup
              selectedEvent={selectedEvent}
              closeModal={closeDetailModal}
              vtuberInfo={selectedVtuberInfo}
            />
          )}
          {submitOpen && <SubmitPopup closeModal={closeSubmitModal} />}
          <BottomDrawer
            drawerData={drawerData}
            onClose={() => setDrawerData(null)}
            onEventClick={(event) => {
              setSelectedEvent(event); // 서랍 안의 일정을 누르면 기존 DetailPopup이 뜹니다!
              // setDrawerData(null); // 원한다면 여기서 서랍을 닫아버릴 수도 있습니다.
            }}
          />
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Home
