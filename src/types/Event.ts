// ✨ 위치 정보를 담는 개별 타입 생성
export interface EventLocation {
  name: string;
  lat: number;
  lng: number;
}

// 팬 광고 이벤트 인터페이스
export interface VtuberEvent {
  thumbnail: string;
  vtuber_id: string;
  status?: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  type?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  link?: string;
  memo?: string;
}

// JSON에서 막 읽어온 Raw 데이터 타입 정의
export type RawEvent = Omit<VtuberEvent, "start" | "end"> & {
  funding_start_at?: string;
  funding_end_at?: string;
  funding_over_at?: string;
  event_start_at: string;
  event_end_at: string;
};

export interface VtuberProfile {
  privacy: "Public" | "Private";
  id: string;
  name: string;
  name_en?: string;
  name_ja?: string;
  agency: string;
  generation: string[];
  color: string;
  birth: Date;
  debut: Date;
  unit: string[];
  platforms: {
    [label: string]: string;
  };
}

export type RawVTuber = Omit<VtuberProfile, "generation" | "birth" | "debut" | "unit"> & {
  generation: string;
  birth: string;
  debut: string;
  unit: string;
};

export type Gender = 'male' | 'female';
