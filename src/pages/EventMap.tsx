import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import BottomDrawer from '@/components/BottomDrawer';
import type { DrawerDataType } from '@/components/BottomDrawer';
import DetailPopup from '@/components/DetailPopup'; // 상세 모달 띄우기용
// 라이브러리 기본 아이콘 깨짐 방지 설정
import { Navigation } from "lucide-react";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { VtuberEvent } from '@/types/Event';

import { useAtomValue } from "jotai";
import { selectedAgencyAtom, eventsAtom, vtubersAtom, favoritesAtom } from '@/store/atoms';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocateButton() {
  const map = useMap();

  return (
    // leaflet 기본 줌 컨트롤(top: 10px, height: 약 74px) 바로 아래에 오도록 top 값을 90px로 강제 지정합니다.
    // 왼쪽 여백은 기본 컨트롤과 동일하게 10px(left-[10px])로 맞춥니다.
    <div className="absolute top-[90px] left-[10px] z-1000">
      <button
        onClick={() => map.locate({ setView: false })}
        className="box-content w-[30px] h-[30px] flex items-center justify-center bg-white bg-clip-padding rounded border-2 border-black/20! hover:bg-gray-100 transition-colors focus:outline-none group cursor-pointer"
        title="내 위치 찾기"
      >
        <Navigation
          className="w-[18px] h-[18px] text-black fill-blue-500/10 group-hover:fill-blue-500/30"
        />
      </button>
    </div>
  );
}

function LocationController() {
  const map = useMap();
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    map.locate().on('locationfound', function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 14, { animate: true, duration: 1.5 });
    });

    return () => {
      map.off('locationfound');
    };
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <span className="font-bold text-blue-600">현재 내 위치</span>
      </Popup>
    </Marker>
  );
}

export default function EventMap() {
  const selectedAgency = useAtomValue(selectedAgencyAtom);
  const events = useAtomValue(eventsAtom);
  const vtubers = useAtomValue(vtubersAtom);
  const favorites = useAtomValue(favoritesAtom);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // ✨ 서랍(Drawer)에 넘겨줄 데이터를 관리할 상태 추가
  const [drawerData, setDrawerData] = useState<DrawerDataType | null>(null);

  // ✨ 서랍 안에서 개별 이벤트를 클릭했을 때 보여줄 상세 팝업용 상태 추가
  const [selectedEvent, setSelectedEvent] = useState<VtuberEvent | null>(null);

  // 선택된 이벤트의 버튜버 정보를 찾는 로직 (Home.tsx와 동일)
  const selectedVtuberInfo = useMemo(() => {
    if (!selectedEvent) return null;
    return vtubers.find(v => v.id === selectedEvent.vtuber_id) || null;
  }, [selectedEvent, vtubers]);

  const filteredEvents = useMemo(() => {
    // 1. 기본 필터링 (기간이 지나지 않은 이벤트만 먼저 거름)
    const activeEvents = events.filter(event => {
      if (!event.end) return true; // 종료일이 없으면 계속 노출
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      // 오늘을 기준으로 진행중인 이벤트만 true 반환
      return startDate <= today && today <= endDate && event.status === 'ongoing';
    });

    // 2. 소속사/즐겨찾기 필터링 적용 (기존 로직 활용)
    if (selectedAgency === 'All VTubers') return activeEvents;

    if (selectedAgency === 'Favorite') {
      return activeEvents.filter(event => favorites.includes(event.vtuber_id));
    }

    const agencyVtuberIds = vtubers
      .filter(v => v.agency === selectedAgency)
      .map(v => v.id);

    return activeEvents.filter(event => agencyVtuberIds.includes(event.vtuber_id));
  }, [events, vtubers, selectedAgency, favorites, today]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, VtuberEvent[]> = {};

    filteredEvents.forEach(event => {
      // 위경도가 없는 데이터(온라인 행사나 주소 변환 실패 건)는 지도 표시 대상에서 제외
      if (!event.latitude || !event.longitude) return;

      const key = `${event.latitude},${event.longitude}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    });

    return Object.values(groups);
  }, [filteredEvents]);
  // 기본 위치는 서울로 설정하되, 국외 이벤트도 모두 한 지도에 나옵니다.
  const position: [number, number] = [37.5665, 126.978];

  return (
    <main className="w-full flex-1 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <section className="flex-1 flex flex-col min-h-0">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          {/* ✨ OSM 표준 타일 레이어 */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationController />

          {/* ✨ 여기에 버튼 컴포넌트를 추가합니다! */}
          <LocateButton />

          {/* ✨ 이벤트 마커 렌더링 */}
          {groupedEvents.map((group, index) => {
            const { latitude, longitude } = group[0];

            return (
              <Marker
                key={`marker-${index}`}
                position={[latitude!, longitude!]}
                eventHandlers={{
                  click: () => {
                    // 마커를 클릭하면 해당 위치의 행사 배열(group) 전체를 서랍으로 넘깁니다!
                    setDrawerData({
                      location: group[0].location || '상세 주소 없음', // 대표 장소명
                      events: group // 필터링 없이 그대로 넘김
                    });
                  }
                }}
              />
            );
          })}
        </MapContainer>
        {/* ✨ 서랍 컴포넌트 렌더링 */}
        <BottomDrawer
          drawerData={drawerData}
          onClose={() => setDrawerData(null)}
          onEventClick={(event) => {
            // 서랍 안의 행사 카드를 누르면 상세 팝업을 띄웁니다!
            setSelectedEvent(event);
          }}
        />

        {/* ✨ 상세 팝업 렌더링 (Home.tsx와 동일한 방식) */}
        {selectedEvent && (
          <DetailPopup
            selectedEvent={selectedEvent}
            closeModal={() => setSelectedEvent(null)}
            vtuberInfo={selectedVtuberInfo}
          />
        )}
      </section>
    </main>
  );
}
