import { format } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { VtuberEvent } from '@/types/Event'

interface DetailPopupProps {
  selectedEvent: VtuberEvent;
  closeModal: () => void; // closeModal은 아무것도 반환하지 않는 함수라는 뜻입니다.
}

function DetailPopup({ selectedEvent, closeModal }: DetailPopupProps) {
  return (
    <div
      // ✨ 핵심 1: pointer-events-auto를 추가하여 vaul의 클릭 무시 효과를 무효화합니다.
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity pointer-events-auto"
      // ✨ 핵심 2: 마우스 클릭뿐만 아니라 모바일 터치 이벤트도 뒤로 넘어가지 않게 확실히 막아줍니다.
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        closeModal();
      }} // 반투명 배경을 클릭해도 닫히게 해요
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative border border-transparent dark:border-gray-700 transition-colors"
        onClick={(e) => e.stopPropagation()} // 모달 내부를 클릭했을 때는 안 닫히게 막아줘요
      >
        {/* 닫기 버튼 */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 transition-colors"
        >
          ✕
        </button>

        {/* 이벤트 타입 배지 */}
        {selectedEvent.type && (
          <span
            className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full mb-3 ${selectedEvent.color}`}
          >
            {selectedEvent.type}
          </span>
        )}

        {/* 제목 및 날짜 */}
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 transition-colors">
          {selectedEvent.title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 dark:text-gray-400 mb-6 transition-colors">
          🗓️ {format(selectedEvent.start, "yyyy.MM.dd")} ~{" "}
          {format(selectedEvent.end, "yyyy.MM.dd")}
        </p>

        {/* 상세 정보 리스트 */}
        <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border dark:border-gray-800 transition-colors">
          {selectedEvent.location && (
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">
                📍 위치
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedEvent.location}
              </p>
            </div>
          )}

          {selectedEvent.link && (
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">
                🔗 출처
              </p>
              <a
                href={selectedEvent.link}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:underline transition-colors"
              >
                바로가기 &rarr;
              </a>
            </div>
          )}
          {selectedEvent.memo && (
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">
                📝 참고
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedEvent.memo}
              </p>
            </div>
          )}
        </div>

        {/* 하단 확인 버튼 */}
        <div className="mt-6">
          <button
            onClick={closeModal}
            className="w-full py-3 bg-gray-800 dark:bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetailPopup
