import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
// ✨ GraduationCap(졸업), UserMinus(비활동) 아이콘 추가
import { X, Moon, Sun, Globe, House, Heart, Map, Pill, Loader2, GraduationCap, UserMinus } from 'lucide-react';
import { useAtom, useSetAtom } from 'jotai';
// ✨ showInactiveAtom, showGraduatedAtom 추가
import { themeAtom, favoritesAtom, accessTokenAtom, driveFileIdAtom, userInfoAtom, showInactiveAtom, showGraduatedAtom } from '@/store/atoms';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// 구글 드라이브 API 통신 함수
const FILE_NAME = 'virboard_favorites.json';

const findFavoritesFileId = async (accessToken: string) => {
  const query = encodeURIComponent(`name='${FILE_NAME}'`);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${query}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const data = await response.json();
  return data.files && data.files.length > 0 ? data.files[0].id : null;
};

const readFavorites = async (fileId: string, accessToken: string) => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return await response.json();
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation();

  // 상태 관리 (Jotai 연동)
  const [, setFavorites] = useAtom(favoritesAtom);
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const setDriveFileId = useSetAtom(driveFileIdAtom);

  // ✨ 필터링 토글 상태 연동
  const [showInactive, setShowInactive] = useAtom(showInactiveAtom);
  const [showGraduated, setShowGraduated] = useAtom(showGraduatedAtom);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [theme, setTheme] = useAtom(themeAtom);
  const isDarkMode = theme === 'dark';

  // 테마가 바뀔 때마다 HTML 태그에 dark 클래스 적용/해제
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 토글 버튼 클릭 시 상태만 변경하면 로컬 스토리지까지 알아서 저장됩니다!
  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  // 구글 로그인 및 드라이브 동기화 처리
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      setAccessToken(token);
      setIsLoggingIn(true);

      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userInfoRes.json();
        setUserInfo({ name: userData.name, picture: userData.picture });

        const fileId = await findFavoritesFileId(token);
        setDriveFileId(fileId);
        if (fileId) {
          const savedFavorites = await readFavorites(fileId, token);
          if (Array.isArray(savedFavorites)) setFavorites(savedFavorites);
        }
      } catch (error) {
        console.error('로그인 처리 중 오류:', error);
      } finally {
        setIsLoggingIn(false);
      }
    },
    scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile',
  });

  // 로그아웃 처리 함수
  const handleLogout = () => {
    googleLogout();
    setAccessToken(null);
    setDriveFileId(null);
    setUserInfo(null);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      <aside
        className={`pt-[env(safe-area-inset-top)] fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}
      >
        <div className="p-6">
          {/* 헤더 영역 (유저 & 닫기 버튼) */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img src={accessToken && userInfo ? userInfo.picture : '/images/platforms/google.svg'} alt="profile" className="w-12 h-12 rounded-full border border-gray-100 dark:border-gray-700" />
              <div>
                {accessToken ? (
                  <>
                    {userInfo && <p className="font-bold text-gray-800 dark:text-gray-100 truncate max-w-[150px]">
                      {userInfo.name}
                    </p>}
                    <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 transition-colors">{t('common.sign_out')}</button>
                  </>
                ) : (
                  <button onClick={() => login()} className="text-base text-blue-500 hover:underline flex items-center gap-1">
                    {isLoggingIn && <Loader2 className="w-3 h-3 animate-spin" />}
                    {t('common.google_sign_in')}
                  </button>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X /></button>
          </div>

          {/* 메뉴(즐겨찾기 등) 영역 */}
          <div className="mb-8">
            {/* ... (기존 네비게이션 메뉴들 동일 유지) ... */}
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 mb-5 font-semibold px-2 transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`
              }
            >
              {({ isActive }) => (
                <>
                  <House className={`w-5 h-5 transition-colors ${isActive ? 'text-gray-900 fill-gray-900/30 dark:text-white dark:fill-white/40' : 'text-gray-500 fill-transparent'}`} />
                  {t('common.home')}
                </>
              )}
            </NavLink>
            <NavLink
              to="/map"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 mb-5 font-semibold px-2 transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Map className={`w-5 h-5 transition-colors ${isActive ? 'text-gray-900 fill-gray-900/30 dark:text-white dark:fill-white/40' : 'text-gray-500 fill-transparent'}`} />
                  {t('common.map')}
                </>
              )}
            </NavLink>
            <NavLink
              to="/streamer"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 mb-5 font-semibold px-2 transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Heart className={`w-5 h-5 transition-colors ${isActive ? 'text-gray-900 fill-gray-900/30 dark:text-white dark:fill-white/40' : 'text-gray-500 fill-transparent'}`} />
                  {t('common.favorites')}
                </>
              )}
            </NavLink>
            <NavLink
              to="/naming/appraisal"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 mb-5 font-semibold px-2 transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Pill className={`w-5 h-5 transition-colors ${isActive ? 'text-gray-900 fill-gray-900/30 dark:text-white dark:fill-white/40' : 'text-gray-500 fill-transparent'}`} />
                  {t('common.appraisal')}(βετα)
                </>
              )}
            </NavLink>
          </div>

          {/* 설정 영역 */}
          <div className="border-t dark:border-gray-800 pt-6 space-y-6">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 px-2">{t('common.settings')}</p>

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

            {/* ✨ 졸업 멤버 보기 토글 추가 */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm font-medium">
                <GraduationCap className="w-5 h-5 text-purple-500" />
                {t('common.show_graduated')}
              </div>
              <button
                onClick={() => setShowGraduated(!showGraduated)}
                className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${showGraduated ? 'bg-purple-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${showGraduated ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* ✨ 활동 종료 멤버 보기 토글 추가 */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 text-sm font-medium">
                <UserMinus className="w-5 h-5 text-red-400" />
                {t('common.show_inactive')}
              </div>
              <button
                onClick={() => setShowInactive(!showInactive)}
                className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${showInactive ? 'bg-red-400' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${showInactive ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

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