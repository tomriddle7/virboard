import { useState } from 'react';
import { useTranslation } from 'react-i18next'

function CalenderHeader({ submitOpen, updateAgency, agencyMap }: { submitOpen: (key: boolean) => void, updateAgency: (key: string) => void, agencyMap: Map<string, string> }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // 1. 초기 상태를 설정할 때 로컬 스토리지에서 값을 가져옵니다.
  const [selectedKey, setSelectedKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('current-agency') || 'Vir';
    }
    return 'Vir';
  });

  // 2. 드롭다운의 항목을 클릭했을 때 실행되는 함수입니다.
  const handleSelect = (key: string) => {
    setSelectedKey(key); // 헤더에 보일 key값을 상태에 업데이트합니다.
    updateAgency(agencyMap.get(key || 'Vir')!);
    localStorage.setItem('current-agency', key); // 로컬 스토리지에 저장해요.
    setIsOpen(false); // 선택 후에는 드롭다운을 닫아줍니다.
  };

  return (
    <header className="h-14 bg-[#266ba1] px-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* 왼쪽 아이콘 버튼 */}
        <button className="text-2xl text-white pb-1">☰</button>

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
              board <span className="ml-1 text-sm text-white">▾</span>
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
        onClick={() => submitOpen(true)}
      >
        {t('common.report')}
      </button>
    </header>
  );
}

export default CalenderHeader;
