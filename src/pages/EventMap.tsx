import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// 라이브러리 기본 아이콘 깨짐 방지 설정
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { useAtomValue } from "jotai";
import { selectedAgencyAtom, submitModalOpenAtom, eventsAtom, vtubersAtom, favoritesAtom } from '@/store/atoms';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function EventMap() {
  const selectedAgency = useAtomValue(selectedAgencyAtom);
  const events = useAtomValue(eventsAtom);
  const vtubers = useAtomValue(vtubersAtom);
  const favorites = useAtomValue(favoritesAtom);

  const filteredEvents = useMemo(() => {
    // 1. "전체 보기"일 때는 모든 이벤트 표시
    if (selectedAgency === "All VTubers") return events;

    // 2. "즐겨찾기"일 때는 favorites 배열에 포함된 vtuber_id만 필터링
    if (selectedAgency === "Favorite") {
      return events.filter((event) => favorites.includes(event.vtuber_id));
    }

    // 3. 특정 소속(Hololive 등)이 선택된 경우
    // 먼저 해당 소속에 포함된 버튜버들의 ID 목록을 만듭니다.
    const agencyVtuberIds = vtubers
      .filter((v) => v.agency === selectedAgency)
      .map((v) => v.id);

    // 그 ID 목록에 속한 버튜버의 이벤트만 결과에 포함시킵니다.
    return events.filter((event) => agencyVtuberIds.includes(event.vtuber_id));
  }, [events, vtubers, selectedAgency, favorites]);
  // 기본 위치는 서울로 설정하되, 국외 이벤트도 모두 한 지도에 나옵니다.
  const position: [number, number] = [37.5665, 126.978];

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* ✨ OSM 표준 타일 레이어 */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✨ 이벤트 마커 렌더링 */}
        {filteredEvents.map((event, i) => {
          if (!event.latitude || !event.longitude) return null;
          return (
            <Marker key={i} position={[event.latitude, event.longitude]}>
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-sm">{event.title}</h4>
                  <p className="text-xs text-gray-600">{event.location}</p>
                  <p className="text-xs text-blue-500 mt-1">
                    {event.start.toDateString()} ~ {event.end.toDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
