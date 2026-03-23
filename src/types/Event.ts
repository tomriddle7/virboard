// 팬 광고 이벤트 인터페이스
export interface VtuberEvent {
  vtuber_id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  type?: string;
  location?: string;
  link?: string;
  memo?: string;
}

// JSON에서 막 읽어온 Raw 데이터 타입 정의
export type RawEvent = Omit<VtuberEvent, "start" | "end"> & {
  start: string;
  end: string;
};

export interface VtuberProfile {
  privacy: "Public" | "Private";
  id: string;
  name: string;
  agency: string;
  generation: string;
  color: string;
  birth: Date;
  debut: Date;
}

export type RawVTuber = Omit<VtuberProfile, "birth" | "debut"> & {
  birth: string;
  debut: string;
};
