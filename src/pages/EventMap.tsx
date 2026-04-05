import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// 라이브러리 기본 아이콘 깨짐 방지 설정
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
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
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

        {/* ✨ 이벤트 마커 렌더링 */}
        {groupedEvents.map((group, index) => {
          const { latitude, longitude } = group[0];
          
          return (
            <Marker key={`marker-${index}`} position={[latitude!, longitude!]}>
              <Popup className="custom-popup">
                <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {group.map((event, i) => (
                    <div key={i} className="mb-3 last:mb-0 border-b last:border-0 pb-2 last:pb-0">
                      <h4 className="font-bold text-sm text-gray-800 break-words">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">{event.location}</p>
                      <p className="text-xs text-blue-500 font-medium mt-1">
                        {event.start.toLocaleDateString()} ~ {event.end.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  
                  {/* 행사가 여러 개일 경우 하단에 요약 텍스트 추가 */}
                  {group.length > 1 && (
                    <div className="text-[10px] text-gray-400 text-right mt-2 font-medium">
                      총 {group.length}개의 행사가 이 장소에 있습니다.
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
