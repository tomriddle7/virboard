import { atom } from 'jotai';

export const agencyMap = new Map([
  ['Vir', 'All VTubers'],
  ['Holo', 'Hololive'],
  ['Stel', 'Stelive'],
  ['Ruli', 'Liveruli'],
  ['Indie', 'Independents'],
]);

// 초기값을 localStorage에서 가져오는 로직
const initialAgency = typeof window !== 'undefined'
  ? agencyMap.get(localStorage.getItem('current-agency') || 'Vir') || 'All VTubers'
  : 'All VTubers';

// 1. 선택된 소속(Agency) 상태
export const selectedAgencyAtom = atom<string>(initialAgency);

// 2. 제보하기(Submit) 모달 열림 여부 상태
export const submitModalOpenAtom = atom<boolean>(false);