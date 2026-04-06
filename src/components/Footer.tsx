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
            href="https://github.com/tomriddle7/virboard"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-2 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[#266ba1] dark:text-[#43c5f5] text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:text-[#1e5480] dark:hover:text-blue-300 transition-all transform hover:-translate-y-0.5"
            title="Github 리포지토리 방문"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5 fill-current"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
            </svg>
          </a>
          <a
            href="https://x.com/tomriddle7"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-2 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[#266ba1] dark:text-[#43c5f5] text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:text-[#1e5480] dark:hover:text-blue-300 transition-all transform hover:-translate-y-0.5"
            title="X(트위터) 방문"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5 fill-current"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </a>
          <a
            href="https://ctee.kr/place/triplenine"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-2 py-2.5 bg-gradient-to-r from-[#266ba1] to-[#43c5f5] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-[#1e5480] hover:to-[#266ba1] transition-all transform hover:-translate-y-0.5"
            title="CTEE 후원하기"
          >
            <span>☕</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
