import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { useTranslation } from 'react-i18next'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { ko } from 'date-fns/locale/ko'
import { ja } from 'date-fns/locale/ja'
import { enUS } from 'date-fns/locale/en-US'
import { CustomToolbar, CustomEvent } from '@/components/CustomToolbar'
import DetailPopup from '@/components/DetailPopup'
import BottomDrawer from '@/components/BottomDrawer'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { VtuberEvent } from '@/types/Event'
import { useAtomValue } from 'jotai';
import { selectedAgencyAtom, eventsAtom, vtubersAtom, favoritesAtom } from '@/store/atoms';

const locales = { ko, en: enUS, ja };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Home() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const [searchParams, setSearchParams] = useSearchParams();

  // 전역 상태 (Jotai)
  const selectedAgency = useAtomValue(selectedAgencyAtom);
  const events = useAtomValue(eventsAtom);
  const vtubers = useAtomValue(vtubersAtom);

  // 로컬 상태
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [drawerData, setDrawerData] = useState<{ date: Date, events: VtuberEvent[] } | null>(null);

  // ✨ 방금 읽은 URL 파라미터 ID를 기억해 둘 ref 생성
  const lastProcessedUrlId = useRef<string | null>(null);

  const favorites = useAtomValue(favoritesAtom);

  // 2. 이벤트 필터링 (사용하지 않는 기수/유닛 필터 로직 삭제)
  const filteredEvents = useMemo(() => {
    // 1. "전체 보기"일 때는 모든 이벤트 표시
    if (selectedAgency === 'All VTubers') return events;

    // 2. "즐겨찾기"일 때는 favorites 배열에 포함된 vtuber_id만 필터링
    if (selectedAgency === 'Favorite') {
      return events.filter(event => favorites.includes(event.vtuber_id));
    }

    // 3. 특정 소속(Hololive 등)이 선택된 경우
    // 먼저 해당 소속에 포함된 버튜버들의 ID 목록을 만듭니다.
    const agencyVtuberIds = vtubers
      .filter(v => v.agency === selectedAgency)
      .map(v => v.id);

    // 그 ID 목록에 속한 버튜버의 이벤트만 결과에 포함시킵니다.
    return events.filter(event => agencyVtuberIds.includes(event.vtuber_id));
  }, [events, vtubers, selectedAgency, favorites]);

  useEffect(() => {
    const eventIdFromUrl = searchParams.get('eventId');

    // URL에 파라미터가 완전히 지워졌다면(모달을 완전히 닫았다면) 도장을 지워줍니다. 
    // (이렇게 해야 나중에 브라우저 '뒤로 가기'를 눌렀을 때 다시 정상적으로 열립니다.)
    if (!eventIdFromUrl) {
      lastProcessedUrlId.current = null;
      return;
    }

    // URL 파라미터가 있고, "아직 내가 처리하지 않은" ID일 때만 팝업을 엽니다.
    if (eventIdFromUrl !== lastProcessedUrlId.current && events.length > 0) {
      const exists = events.some(e => String(e.id) === String(eventIdFromUrl));

      if (exists) {
        setSelectedEventId(eventIdFromUrl);
        lastProcessedUrlId.current = eventIdFromUrl; // ✨ 처리 완료 도장 쾅!
      }
    }
    // 🚨 주의: 의존성 배열에서 selectedEventId를 반드시 빼주세요!
  }, [searchParams, events]);

  // 2. 팝업을 닫을 때 주소창의 쿼리 스트링도 함께 제거 (UX 관리)
  const closeDetailModal = () => {
    setSelectedEventId(null);

    if (searchParams.has('eventId')) {
      // 주소창에서 eventId 파라미터만 쏙 빼고 나머지 주소는 유지합니다.
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('eventId');
      setSearchParams(newParams, { replace: true }); // 뒤로가기 기록이 남지 않도록 replace 사용
    }
  };

  return (
    <main className="bg-gray-50 dark:bg-gray-950 h-[100dvh] flex flex-col">
      <section className="w-full max-w-6xl mx-auto pt-4 px-0 sm:px-6 flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
        <div className="flex-1 min-h-[700px] sm:min-h-0 bg-white dark:bg-black p-2 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-900 flex flex-col">
          <Calendar<VtuberEvent, object>
            localizer={localizer}
            events={filteredEvents}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            onSelectEvent={(event) => setSelectedEventId(event.id)}
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
                  const otherEvents = dayEvents.filter((event) => event.type !== '생일')
                    .toSorted((a, b) => {
                      const getStatusWeight = (status?: string) => {
                        if (status === 'ongoing') return 1;
                        if (status === 'ended') return 2;
                        if (status === 'funded') return 3;
                        if (status === 'funding') return 4;
                        return 5;
                      };
                      return getStatusWeight(a.status) - getStatusWeight(b.status);
                    });

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
                            setDrawerData({ date: headerDate, events: otherEvents });
                          }}>
                            {otherEvents.map((event, i) => {
                                const isFunding = event.type !== '생일' && (event.status === 'funding' || event.status === 'funded');
                                const opacityClass = !isCurrentMonth ? 'opacity-40' : '';

                                return isFunding ? (
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
                        {birthdays.map((event) => (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventId(event.id);
                            }}
                            key={event.id}
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
        {selectedEventId && (
          <DetailPopup
            eventId={selectedEventId}
            closeModal={closeDetailModal}
          />
        )}

        <BottomDrawer
          drawerData={drawerData}
          onClose={() => setDrawerData(null)}
          onEventClick={(id) => setSelectedEventId(id)}
        />
      </section>
    </main>
  )
}

export default Home
