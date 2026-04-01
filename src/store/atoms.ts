import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { VtuberEvent, VtuberProfile } from '@/types/Event';

export const agencyMap = new Map([
  ['Vir', 'All VTubers'],
  ['Fav', 'Favorite'],
  ['Holo', 'Hololive'],
  ['Stel', 'Stelive'],
  ['Ruli', 'Liveruli'],
  ['Indie', 'Independents'],
]);

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