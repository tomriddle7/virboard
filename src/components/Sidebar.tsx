import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Moon, Sun, Globe, House, Heart, Star } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation();
  
  // 1. 다크 모드 상태 관리
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 컴포넌트가 켜질 때 현재 HTML 태그에 'dark' 클래스가 있는지 확인합니다.
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                   localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // 2. 임시 즐겨찾기 데이터 (나중에 localStorage나 전역 상태로 관리하면 됩니다)
  const favorites: string[] = [];

  return (
    <>
      {/* 배경 오버레이 (클릭 시 닫힘) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* 사이드바 패널 */}
      <aside 
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}
      >
        <div className="p-6">
          {/* 헤더 영역 (유저 & 닫기 버튼) */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {/* <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">게스트</p>
                <button className="text-xs text-blue-500 hover:underline">로그인하기</button>
              </div> */}
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* 즐겨찾기 영역 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5 text-gray-700 dark:text-gray-200 font-semibold px-2">
              <House className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {t('common.home')}
            </div>
            <div className="flex items-center gap-2 mb-5 text-gray-700 dark:text-gray-200 font-semibold px-2">
              <Heart className="w-5 h-5 text-gray-700 fill-gray-700 dark:text-gray-300 dark:fill-gray-300" />
              {t('common.favorites')}
            </div>
            <div className="space-y-1">
              {favorites.map((name, idx) => (
                <button key={idx} className="w-full flex items-center gap-3 p-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* 설정 영역 */}
          <div className="border-t dark:border-gray-800 pt-6 space-y-6">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 px-2">{t('common.settings')}</p>
            
            {/* 다크 모드 토글 */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm font-medium">
                {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-orange-400" />}
                {t('common.dark_mode')}
              </div>
              <button 
                onClick={toggleDarkMode} 
                className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${isDarkMode ? 'bg-indigo-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* 언어 선택 */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm font-medium">
                <Globe className="w-5 h-5 text-green-500" />
                {t('common.language')}
              </div>
              <select 
                value={i18n.language.split('-')[0]} 
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none cursor-pointer"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}