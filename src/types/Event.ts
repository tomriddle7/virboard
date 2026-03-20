// 1. 팬 광고 이벤트의 타입(인터페이스)을 꼼꼼하게 정의해 줍니다.
export interface VtuberEvent {
  title: string;
  start: Date;
  end: Date;
  color: string;
  type?: string;
  location?: string;
  link?: string;
  memo?: string;
}

// ✨ 2. JSON에서 막 읽어온 날것(Raw)의 데이터 타입 정의
export type RawEvent = Omit<VtuberEvent, "start" | "end"> & {
  start: string;
  end: string;
};
