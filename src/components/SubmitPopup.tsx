import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SCRIPT_URL = import.meta.env.VITE_GAS_URL;

export default function SubmitPopup({ closeModal }: { closeModal: () => void }) {
  const { t } = useTranslation();

  // ✨ 탭 상태 관리 추가
  const [activeTab, setActiveTab] = useState<'event' | 'vtuber'>('event');

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    agency: '',
    start: '',
    end: '',
    color: '',
    location: '',
    link: '',
    memo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✨ GAS 스크립트에서 구분할 수 있도록 탭 종류(submitType)를 함께 보냅니다.
      const payload = {
        ...formData,
        submitType: activeTab
      };

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        // GAS는 text/plain으로 보내야 CORS 에러를 우회하기 쉽습니다.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.result === "success") {
        alert(t('submit.success_alert'));
        setFormData({ title: '', name: '', agency: '', start: '', end: '', color: '', location: '', link: '', memo: '' }); // 폼 초기화
      }
    } catch (error) {
      console.error("제보 실패:", error);
      alert(t('submit.error_alert'));
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <h2 className="text-xl font-bold mb-4 dark:text-white">{t('submit.title')}</h2>

        {/* ✨ 탭 네비게이션 영역 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-semibold text-center transition-all border-b-2 ${activeTab === 'event'
                ? 'border-blue-500 text-blue-500 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('event')}
          >
            {t('submit.tab_event')}
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-semibold text-center transition-all border-b-2 ${activeTab === 'vtuber'
                ? 'border-blue-500 text-blue-500 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('vtuber')}
          >
            {t('submit.tab_vtuber')}
          </button>
        </div>

        {/* 폼 영역 (스크롤 가능하도록 처리) */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* 1️⃣ 행사/광고 탭 일 때 보이는 필드 */}
          {activeTab === 'event' && (
            <>
              <div>
                <label className="vir-primary-label">{t('submit.event_title')}</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="vir-primary-input" />
              </div>

              <div>
                <label className="vir-primary-label">{t('submit.vtuber_name')}</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="vir-primary-input" />
              </div>

              <div className="flex space-x-4">
                <div className="w-3/5">
                  <label className="vir-primary-label">{t('submit.agency')}</label>
                  <input type="text" name="agency" value={formData.agency} onChange={handleChange} placeholder={t('submit.agency_placeholder')} className="vir-primary-input" />
                </div>
                <div className="w-2/5">
                  <label className="vir-primary-label">{t('submit.color')}</label>
                  <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="#FF85C2" className="vir-primary-input" />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="vir-primary-label">{t('submit.start_date')}</label>
                  <input required type="date" name="start" value={formData.start} onChange={handleChange} className="vir-primary-input" />
                </div>
                <div className="w-1/2">
                  <label className="vir-primary-label">{t('submit.end_date')}</label>
                  <input type="date" name="end" value={formData.end} onChange={handleChange} className="vir-primary-input" />
                </div>
              </div>

              <div>
                <label className="vir-primary-label">{t('submit.location')}</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder={t('submit.location_placeholder')} className="vir-primary-input" />
              </div>

              <div>
                <label className="vir-primary-label">{t('submit.link')}</label>
                <input required type="url" name="link" value={formData.link} onChange={handleChange} placeholder="X, YouTube, Twitch, etc..." className="vir-primary-input" />
              </div>

              <div>
                <label className="vir-primary-label">{t('submit.memo')}</label>
                <textarea name="memo" rows={4} value={formData.memo} onChange={handleChange} className="vir-primary-input" />
              </div>
            </>
          )}

          {/* 2️⃣ 버튜버 추가 탭 일 때 보이는 필드 */}
          {activeTab === 'vtuber' && (
            <>
              <div>
                <label className="vir-primary-label">{t('submit.vtuber_name')}</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="vir-primary-input" />
              </div>

              <div className="flex space-x-4">
                <div className="w-3/5">
                  <label className="vir-primary-label">{t('submit.agency')}</label>
                  <input type="text" name="agency" value={formData.agency} onChange={handleChange} placeholder={t('submit.agency_placeholder')} className="vir-primary-input" />
                </div>
                <div className="w-2/5">
                  <label className="vir-primary-label">{t('submit.color')}</label>
                  <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="#FF85C2" className="vir-primary-input" />
                </div>
              </div>

              <div>
                <label className="vir-primary-label">{t('submit.link')}</label>
                <input required={activeTab === 'vtuber'} type="url" name="link" value={formData.link} onChange={handleChange} placeholder="https://youtube.com/@..." className="vir-primary-input" />
              </div>

              <div>
                <label className="vir-primary-label">{t('submit.memo')}</label>
                <textarea name="memo" rows={4} value={formData.memo} onChange={handleChange} className="vir-primary-input" />
              </div>
            </>
          )}

          <div className="pt-2 sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-50">
              {isSubmitting ? t('submit.submitting') : t('submit.submit_btn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}