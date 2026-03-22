import { useState } from 'react'

const SCRIPT_URL = import.meta.env.VITE_GAS_URL;

export default function SubmitPopup({ closeModal }: { closeModal: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    agency: '',
    start: '',
    end: '',
    location: '',
    link: '',
    memo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        // GAS는 text/plain으로 보내야 CORS 에러를 우회하기 쉽습니다.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.result === "success") {
        alert("제보가 성공적으로 접수되었습니다! 확인 후 반영하겠습니다.");
        setFormData({ title: '', name: '', agency: '', start: '', end: '', location: '', link: '', memo: '' }); // 폼 초기화
      }
    } catch (error) {
      console.error("제보 실패:", error);
      alert("전송 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
      onMouseDown={(e) => e.stopPropagation()}
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
        <h2 className="text-xl font-bold mb-4 dark:text-white">📅 일정 제보하기</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">이벤트 제목</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium dark:text-gray-300">버튜버 이름</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium dark:text-gray-300">소속</label>
              <input type="text" name="agency" value={formData.agency} onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium dark:text-gray-300">시작일</label>
              <input required type="date" name="start" value={formData.start} onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium dark:text-gray-300">종료일</label>
              <input type="date" name="end" value={formData.end} onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">위치 (광고/팝업스토어 등)</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="예: 홍대입구역 2번 출구"
              className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">관련 링크 (X, 팬카페 등)</label>
            <input required type="url" name="link" value={formData.link} onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300">추가 정보</label>
            <input type="text" name="memo" value={formData.memo} onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors disabled:opacity-50">
            {isSubmitting ? "전송 중..." : "제보하기"}
          </button>
        </form>
      </div>
    </div>
  )
}