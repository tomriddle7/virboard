/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import type { VtuberEvent, VtuberProfile } from '@/types/Event';

export const agencyMap = new Map([
  ['Vir', 'All VTubers'],
  ['Fav', 'Favorite'],
  ['Holo', 'Hololive'],
  ['Niji', 'Nijisanji'],
  ['Stel', 'Stelive'],
  ['Ruli', 'Liveruli'],
  ['Indie', 'Independents'],
]);

const getSystemTheme = (): 'light' | 'dark' => {
  // 브라우저 환경이 아닐 경우(안전장치) 기본값 'light' 반환
  if (typeof window === 'undefined') return 'light';

  // OS/브라우저가 다크 모드인지 확인
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// ✨ 기본값 자리에 getSystemTheme() 호출 결과를 넣어줍니다.
// 사용자가 이미 사이트에서 테마를 수동으로 바꾼 적이 있다면(로컬 스토리지에 값이 있다면) 그 값을 우선하고,
// 처음 접속한 사용자라면 기기 설정값을 따라갑니다.
export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', getSystemTheme());

// 초기값을 localStorage에서 가져오는 로직
const initialAgency = typeof window !== 'undefined'
  ? agencyMap.get(localStorage.getItem('current-agency') || 'Vir') || 'All VTubers'
  : 'All VTubers';

export const selectedAgencyAtom = atom<string>(initialAgency);
export const submitModalOpenAtom = atom<boolean>(false);

export const eventsAtom = atom<VtuberEvent[]>([]);
export const vtubersAtom = atom<VtuberProfile[]>([]);
export const isDataLoadingAtom = atom<boolean>(true);

// ✨ 3. 즐겨찾기 전역 상태 생성
export const favoritesAtom = atomWithStorage<string[]>('my-favorites', []);

// ✨ 세션 스토리지를 사용하기 위한 설정
const sessionStorageConfig = createJSONStorage<any>(() => sessionStorage);

// ✨ 일반 atom에서 atomWithStorage로 변경 (sessionStorage 사용)
export const accessTokenAtom = atomWithStorage<string | null>(
  'google-access-token',
  null,
  sessionStorageConfig
);

export const driveFileIdAtom = atomWithStorage<string | null>(
  'google-drive-file-id',
  null,
  sessionStorageConfig
);

export const userInfoAtom = atomWithStorage<{
  name: string;
  picture: string;
} | null>(
  'user-info',
  null,
  sessionStorageConfig
);