import { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { Menu } from 'lucide-react'; // ✨ 햄버거 아이콘 불러오기
import Sidebar from '@/components/Sidebar';    // ✨ 방금 만든 사이드바 불러오기
import { useAtom } from 'jotai';
import { selectedAgencyAtom, submitModalOpenAtom, agencyMap } from '@/store/atoms';

function CalenderHeader() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. 초기 상태를 설정할 때 로컬 스토리지에서 값을 가져옵니다.
  const [selectedKey, setSelectedKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('current-agency') || 'Vir';
    }
    return 'Vir';
  });

  // 2. 드롭다운의 항목을 클릭했을 때 실행되는 함수입니다.
  const handleSelect = (key: string) => {
    const value = agencyMap.get(key) || 'All VTubers';

    setSelectedKey(key); // 헤더 UI 글씨 업데이트 (예: 'Holo')
    setSelectedAgency(value); // Jotai 전역 상태 업데이트 -> Home의 달력 데이터가 즉시 필터링됨! (예: 'Hololive')
    localStorage.setItem('current-agency', key); // 브라우저에 저장
    setIsOpen(false); // 드롭다운 메뉴 닫기
  };

  // ✨ Jotai 상태 연결
  const [, setSelectedAgency] = useAtom(selectedAgencyAtom);
  const [, setSubmitOpen] = useAtom(submitModalOpenAtom);

  return (
    <header className="h-14 bg-[#266ba1] px-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* ✨ 햄버거 버튼 */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 rounded-xl hover:bg-white/20 text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* 드롭다운 기준점 */}
        <div className="relative text-2xl font-bold">
          <button
            className="flex items-baseline focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-white flex items-center underline">
              {selectedKey}
            </span>
            <span className="text-[#e8b2bf]">
              board <span className="text-sm text-white">▾</span>
            </span>
          </button>

          {/* 드롭다운 메뉴 */}
          {isOpen && (
            <ul className="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-base font-normal">
              {/* 3. Map 객체를 배열로 변환하여 화면에 그려줍니다. */}
              {Array.from(agencyMap.entries()).map(([key, value]) => (
                <li key={key}>
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSelect(key)}
                  >
                    {value}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <button
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={() => setSubmitOpen(true)}
      >
        {t('common.report')}
      </button>

      {/* ✨ 사이드바 컴포넌트 렌더링 (isSidebarOpen 상태를 프롭스로 넘겨줍니다) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </header>
  );
}

export default CalenderHeader;
