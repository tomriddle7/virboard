function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900 py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-row justify-between items-center gap-6">
        {/* 📝 왼쪽: 사이트 정보 및 저작권 */}
        <div className="text-left">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center justify-start">
            <span className="text-[#43c5f5]">Vir</span>board
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            버튜버 생일 및 기념일, 오프라인 광고 일정 모아보기
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            © 2026 Virboard. All rights reserved.
          </p>
        </div>

        {/* ☕ 오른쪽: CTEE 후원 버튼 */}
        <div className="flex items-center gap-2">
          <a
            href="https://x.com/tomriddle7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2 py-2.5 text-sm text-[#266ba1] dark:text-[#43c5f5] hover:text-[#1e5480] dark:hover:text-blue-300 transition"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-4 h-4 fill-current"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>
          <a
            href="https://ctee.kr/place/triplenine"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-2 py-2.5 bg-gradient-to-r from-[#266ba1] to-[#43c5f5] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-[#1e5480] hover:to-[#266ba1] transition-all transform hover:-translate-y-0.5"
          >
            <span>☕</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
