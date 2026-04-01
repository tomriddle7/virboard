import { useState, useEffect, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko, enUS, ja } from 'date-fns/locale'
import { CustomToolbar, CustomEvent } from '@/components/CustomToolbar'
import DetailPopup from '@/components/DetailPopup'
import SubmitPopup from '@/components/SubmitPopup'
import BottomDrawer from '@/components/BottomDrawer'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { VtuberEvent, RawEvent, VtuberProfile, RawVTuber } from '@/types/Event'

import { useAtom, useAtomValue } from 'jotai';
import { selectedAgencyAtom, submitModalOpenAtom } from '@/store/atoms';

const locales = { ko, en: enUS, ja };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Home() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];

  // 전역 상태 (Jotai)
  const selectedAgency = useAtomValue(selectedAgencyAtom);
  const [submitOpen, setSubmitOpen] = useAtom(submitModalOpenAtom);

  // 로컬 상태
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<VtuberEvent | null>(null);
  const [drawerData, setDrawerData] = useState<{ date: Date, events: VtuberEvent[] } | null>(null);
  const [events, setEvents] = useState<VtuberEvent[]>([]);
  const [vtubers, setVtubers] = useState<VtuberProfile[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const timestamp = new Date().getTime();
        const [eventList, vtuberList] = await Promise.all([
          fetch(`/celebration.json?t=${timestamp}`).then(res => res.json()),
          fetch(`/vtubers.json?t=${timestamp}`).then(res => res.json())
        ]);

        const parsedEvents: VtuberEvent[] = eventList.map((event: RawEvent) => {
          // 코드가 훨씬 깔끔해졌습니다!
          const eventStart = event.status === 'funding' ? event.funing_start_at! : event.event_start_at;
          const eventEnd = event.status === 'funding' ? event.funding_end_at! : event.event_end_at;

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
      }
    })();
  }, []);

  // 1. 마스터 데이터 사전 만들기
  interface VTuberMap {
    [id: string]: VtuberProfile;
  }

  const vtuberMap: VTuberMap = useMemo(() => {
    const map: VTuberMap = {};
    vtubers.forEach((v: VtuberProfile) => {
      map[v.id] = v;
    });
    return map;
  }, [vtubers]);

  // 2. 이벤트 필터링 (사용하지 않는 기수/유닛 필터 로직 삭제)
  const filteredEvents: VtuberEvent[] = useMemo(() => {
    return events.filter(event => {
      const vtuberInfo = vtuberMap[event.vtuber_id];

      // 마스터에 정보가 없는 미등록 버튜버일 경우의 안전장치
      if (!vtuberInfo) {
        return selectedAgency === 'All VTubers';
      }

      // 소속(Agency) 조건만 검사합니다.
      return selectedAgency === 'All VTubers' || vtuberInfo.agency === selectedAgency;
    });
  }, [events, vtuberMap, selectedAgency]);

  const closeDetailModal = () => setSelectedEvent(null);
  const closeSubmitModal = () => setSubmitOpen(false);

  const selectedVtuberInfo = useMemo(() => {
    if (!selectedEvent) return null;
    return vtuberMap[selectedEvent.vtuber_id];
  }, [selectedEvent, vtuberMap]);

  return (
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

                      {/* 나머지 이벤트(광고 등) 점 렌더링 */}
                      {otherEvents.length > 0 && (
                        <div
                          className={`bg-gray-50 text-white text-[10px] sm:text-xs font-semibold px-0.5 py-1.5 ml-1 rounded-md truncate shadow-sm ${!isCurrentMonth && 'opacity-40'}`}
                        >
                          <button className="flex flex-row flex-wrap justify-center w-full gap-1" onClick={(e) => {
                            e.stopPropagation();
                            setDrawerData({ date: headerDate, events: dayEvents });
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
                                const opacityClass = !isCurrentMonth ? 'opacity-40' : '';

                                return isOngoing ? (
                                  <span
                                    key={`dot-${event.vtuber_id}-${i}`}
                                    className={`size-1.5 p-[1px] rounded-full ${event.color} ${opacityClass}`}
                                  >
                                    <span className="block w-full h-full rounded-full bg-gray-50" />
                                  </span>
                                ) : (
                                  <span
                                    key={`dot-${event.vtuber_id}-${i}`}
                                    className={`size-1.5 rounded-full ${event.color} ${opacityClass}`}
                                  />
                                );
                              })}
                          </button>
                        </div>
                      )}

                      {/* 생일 이벤트 버튼 렌더링 */}
                      <div className="flex flex-col gap-1 mt-1 w-full">
                        {birthdays.map((event, i) => (
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
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
            eventPropGetter={() => ({
              style: { backgroundColor: "transparent" },
            })}
          />
        </div>

        {/* 모달 및 서랍 */}
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
          onEventClick={(event) => setSelectedEvent(event)}
        />
      </section>
    </main>
  )
}

export default Home
