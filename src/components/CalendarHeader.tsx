import { useState, useRef, useEffect } from 'react'; // ✨ useRef, useEffect 추가
import { useTranslation } from 'react-i18next'
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useAtom } from 'jotai';
import { selectedAgencyAtom, submitModalOpenAtom, agencyMap } from '@/store/atoms';

function CalenderHeader() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✨ 드롭다운 영역을 가리킬 Ref 생성
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✨ 외부 클릭 감지 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 드롭다운이 열려있고, 클릭한 곳이 드롭다운 영역(dropdownRef) 바깥이라면 닫기
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

    setSelectedKey(key);
    setSelectedAgency(value);
    localStorage.setItem('current-agency', key);
    setIsOpen(false); // 드롭다운 메뉴 닫기
  };

  // Jotai 상태 연결
  const [, setSelectedAgency] = useAtom(selectedAgencyAtom);
  const [, setSubmitOpen] = useAtom(submitModalOpenAtom);

  return (
    <header className="bg-[#266ba1] px-4 flex justify-between items-center pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-4 py-2">
        {/* 햄버거 버튼 */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 rounded-xl hover:bg-white/20 text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* 드롭다운 기준점 */}
        {/* ✨ 이 <div>에 ref={dropdownRef}를 달아줍니다! */}
        <div className="relative text-2xl font-bold" ref={dropdownRef}>
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
            <ul className="absolute left-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-base font-normal">
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
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setSubmitOpen(true)}
      >
        {t('common.report')}
      </button>

      {/* 사이드바 컴포넌트 렌더링 */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </header>
  );
}

export default CalenderHeader;