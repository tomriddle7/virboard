/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Zap, Lock, BarChart3, Loader2, Info, Share2 } from 'lucide-react';
import { DateTime } from "luxon";
import { createLuxonAdapter } from "@gracefullight/saju/adapters/luxon";
import { getSaju } from "@gracefullight/saju";
import {
  luckyNumbers,
  mbtiWeights,
  mapSajuElement,
  isGenerating,
  getStrokeCount,
  detectLanguage
} from '@/utils/naming';
import { toBlob } from 'html-to-image';

// 💡 새롭게 추가된 원형 그래프 라이브러리 및 스타일
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Appraisal() {
  const [appraisalStep, setAppraisalStep] = useState<'input' | 'loading' | 'result'>('input');

  const [formData, setFormData] = useState({
    customName: '',
    nameTheme: 'earth',
    birthDate: '2000-01-01',
    mbti: '',
    gender: 'female'
  });

  const [appraisalResult, setAppraisalResult] = useState<any>(null);
  const [nameLanguage, setNameLanguage] = useState<'korean' | 'english' | 'japanese' | 'mixed' | 'empty'>('empty');
  const [isCapturing, setIsCapturing] = useState(false);

  // 다크모드 여부 확인 (Tailwind 기본 속성 활용)
  const isDarkMode = document.documentElement.classList.contains('dark');

  // 💡 점수에 따른 원형 그래프 색상 지정 함수
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'; // Emerald 500
    if (score >= 80) return '#2563eb'; // Blue 600
    if (score >= 60) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  const handleShareAsImage = async () => {
    if (isCapturing) return;

    const captureElement = document.getElementById('capture-target');
    if (!captureElement) {
      alert("공유할 영역을 찾을 수 없습니다.");
      return;
    }

    try {
      setIsCapturing(true);

      // 💡 [핵심] 기기 화면 크기에 맞춘 동적 스케일링 계산
      const clientWidth = captureElement.offsetWidth;
      const clientHeight = captureElement.offsetHeight;
      const targetWidth = 540; // 우리가 원하는 인스타그램/트위터용 고정 너비
      const scale = targetWidth / clientWidth; // 모바일 화면을 얼마나 확대할지 비율 계산

      const blob = await toBlob(captureElement, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: targetWidth,
        height: clientHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${clientWidth}px`,
          height: `${clientHeight}px`,
          margin: '0',
          borderRadius: '0px'
        }
      });

      if (!blob) throw new Error("이미지 변환 실패");

      const fileName = `${formData.customName}_감정결과.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Virboard - "${formData.customName}" 감정 결과`,
            text: `데뷔 성공운 ${appraisalResult.totalScore}점! Virboard에서 운명적인 이름을 감정받아 보세요.`
          });
        } catch (shareError: any) {
          if (shareError.name !== 'AbortError') {
            console.error("공유 실패:", shareError);
          }
        }
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert("감정 결과 이미지가 다운로드되었습니다! 트위터나 디스코드에 업로드해 보세요.");
      }

    } catch (error) {
      console.error('이미지 캡처 중 오류:', error);
      alert('이미지 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleNameBlur = () => {
    setNameLanguage(detectLanguage(formData.customName));
  };

  const handleAppraise = async () => {
    if (!formData.customName.trim()) {
      alert("감정받을 이름을 입력해주세요.");
      return;
    }

    const detectedLang = detectLanguage(formData.customName);
    setNameLanguage(detectedLang);

    if (detectedLang === 'mixed') {
      alert("정확한 감정을 위해 단일 언어(한글, 영문, 일어 중 택 1)로 이름을 입력해 주세요.");
      return;
    }

    setAppraisalStep('loading');

    try {
      const adapter = await createLuxonAdapter();
      let totalScore = 30;
      let sajuBalance = "C";
      let mbtiSynergy = "-";
      let strokesLuck = "흉(凶)";
      let comment = "";

      let strokes = 0;
      let missingKanjiList: string[] = [];

      const strokeData = await getStrokeCount(formData.customName, detectedLang);

      strokes = strokeData.strokes;
      missingKanjiList = strokeData.missingChars;

      if (missingKanjiList.length > 0) {
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzP0LWNGwl54_INV8k_QNB8ktK1gyqyIk0Luwx0uerfl2kf9YL5ZjXzqy_Y5peeMuE/exec';
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customName: formData.customName,
            missingKanji: missingKanjiList.join(', ')
          })
        }).catch(err => console.error("구글 시트 전송 실패:", err));
      }

      const isLucky = luckyNumbers.includes(strokes);

      if (isLucky) {
        strokesLuck = "대길(大吉)";
        totalScore += 30;
      } else {
        totalScore += 10;
      }

      const [year, month, day] = formData.birthDate.split('-');
      const birthDt = DateTime.fromObject({
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: 12,
        minute: 0
      }, { zone: "Asia/Seoul" });

      if (birthDt.isValid) {
        const calcGender = (formData.gender === 'none' ? 'female' : formData.gender) as 'male' | 'female';
        const saju = getSaju(birthDt, { adapter, gender: calcGender });

        // 💡 주의: saju 라이브러리 버전에 따라 element 또는 elementLabel을 사용합니다.
        const neededElement = mapSajuElement((saju.yongShen.primary as any).elementLabel || (saju.yongShen.primary as any).element);

        if (neededElement === formData.nameTheme) {
          sajuBalance = "S";
          totalScore += 25;
        } else if (isGenerating(neededElement, formData.nameTheme)) {
          sajuBalance = "A";
          totalScore += 20;
        } else {
          sajuBalance = "B";
          totalScore += 10;
        }
      }

      if (formData.mbti && mbtiWeights[formData.mbti as keyof typeof mbtiWeights]) {
        const weight = mbtiWeights[formData.mbti as keyof typeof mbtiWeights][formData.nameTheme as keyof (typeof mbtiWeights)['INTJ']];
        if (weight >= 2.0) { mbtiSynergy = "S"; totalScore += 15; }
        else if (weight >= 1.5) { mbtiSynergy = "A"; totalScore += 10; }
        else { mbtiSynergy = "B"; totalScore += 5; }
      } else {
        totalScore += 10;
      }

      if (totalScore >= 85 && isLucky) {
        comment = `사주의 부족한 기운을 완벽히 채워주며 81수리까지 대길(${strokes}획)인 훌륭한 이름입니다. 하지만 데뷔일의 흥행운까지 고려한 '진짜 운명적 이름'을 만나신다면 폭발적인 성장을 하실 수 있습니다.`;
      } else if (!isLucky) {
        comment = `오행과 캐릭터의 밸런스는 나쁘지 않지만, '수리성명학' 관점에서 획수(${strokes}획)가 아쉽습니다. 방송 초기 성장이 더딜 수 있는 기운이 보여요.`;
      } else if (sajuBalance === "B" || sajuBalance === "C") {
        comment = `이름의 획수는 좋으나, 사주에서 간절히 필요로 하는 용신(부족한 오행)을 충분히 보완해주지 못하고 있습니다. 롱런을 위해서는 오행 밸런스가 중요합니다.`;
      } else {
        comment = `전체적으로 무난한 이름입니다. 다만 시청자들의 뇌리에 단번에 박히고 알고리즘의 선택을 받을 '폭발적인 기운'은 다소 부족합니다.`;
      }

      setTimeout(() => {
        setAppraisalResult({
          totalScore: Math.min(totalScore, 100),
          sajuBalance,
          mbtiSynergy,
          strokesLuck,
          comment,
          missingKanjiList
        });
        setAppraisalStep('result');
      }, 1500);

    } catch (e) {
      console.error(e);
      alert("감정 중 오류가 발생했습니다.");
      setAppraisalStep('input');
    }
  };

  return (
    <main className="space-y-6 animate-[fadeIn_0.4s_ease-out] bg-gray-50 dark:bg-gray-950 flex-1   flex flex-col">

      {/* 1. 입력창 영역 */}
      {appraisalStep === 'input' && (
        <section className="bg-white dark:bg-slate-900 max-w-4xl mx-auto w-full md:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-0 md:mt-8">
          <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800/50">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">버튜버 감명 연구소(βετα)</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">입력하신 이름이 데뷔 성공운과 얼마나 맞는지 감정해 드립니다.</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">감정받을 이름</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="예: 호쇼 마린, 宝鐘マリン, Houshou Marine"
                  value={formData.customName}
                  onChange={(e) => {
                    setFormData({ ...formData, customName: e.target.value });
                    if (nameLanguage === 'mixed') setNameLanguage('empty');
                  }}
                  onBlur={handleNameBlur}
                  className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-[#151b2b] border text-slate-900 dark:text-slate-100 transition-all duration-200 shadow-sm ${nameLanguage === 'mixed'
                    ? 'border-amber-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50'
                    : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50'
                    }`}
                />
              </div>

              <div className="h-5 mt-1 transition-all duration-300">
                {nameLanguage === 'mixed' && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center animate-[fadeIn_0.2s_ease-out]">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    정확한 수리 감정을 위해 하나의 언어(예: 한글 발음)로 통일해 주세요!
                  </p>
                )}
                {nameLanguage === 'korean' && (
                  <p className="text-sm text-indigo-500 flex items-center animate-[fadeIn_0.2s_ease-out]">
                    <Info className="w-4 h-4 mr-1.5" />
                    한글 획수 및 음령오행 기준으로 감정이 진행됩니다.
                  </p>
                )}
                {nameLanguage === 'japanese' && (
                  <p className="text-sm text-indigo-500 flex items-center animate-[fadeIn_0.2s_ease-out]">
                    <Info className="w-4 h-4 mr-1.5" />
                    일본어 원획법 및 음령오행 기준으로 감정이 진행됩니다.
                  </p>
                )}
                {nameLanguage === 'english' && (
                  <p className="text-sm text-indigo-500 flex items-center animate-[fadeIn_0.2s_ease-out]">
                    <Info className="w-4 h-4 mr-1.5" />
                    영문 알파벳 수비학 및 발음 기준으로 감정이 진행됩니다.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">캐릭터 컨셉 (오행)</label>
                <select
                  value={formData.nameTheme}
                  onChange={(e) => setFormData({ ...formData, nameTheme: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#151b2b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                >
                  <option value="water">수(水) - 해양, 심해, 얼음</option>
                  <option value="wood">목(木) - 학생, 요정, 숲</option>
                  <option value="fire">화(火) - 악마, 드래곤, 빛</option>
                  <option value="earth">토(土) - 인간, 일상, 대지</option>
                  <option value="metal">금(金) - 기사, 기계, 사이보그</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">MBTI (선택)</label>
                <select
                  value={formData.mbti}
                  onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#151b2b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                >
                  <option value="">선택 안함</option>
                  {Object.keys(mbtiWeights).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">생일 / 데뷔일</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#151b2b] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">성별</label>
                <div className="flex space-x-5 pt-3 px-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">여성</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">남성</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="none"
                      checked={formData.gender === 'none'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">없음/비밀</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleAppraise}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
            >
              <BarChart3 className="w-5 h-5" /> 무료 감정 리포트 보기
            </button>
          </div>
        </section>
      )}

      {/* 2. 로딩 화면 */}
      {appraisalStep === 'loading' && (
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">이름의 운세를 감정 중입니다...</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">81수리와 사주 오행의 균형을 분석하고 있습니다.</p>
            </div>
          </div>
        </section>
      )}

      {/* 3. 감정 결과 화면 */}
      {appraisalStep === 'result' && appraisalResult && (
        <section className="space-y-6 max-w-lg mx-auto w-full px-4 md:px-0 mt-8 animate-[fadeIn_0.5s_ease-out]">

          {/* 💡 캡처 대상 영역 (버보드 대시보드 스타일로 재설계) */}
          <div
            id="capture-target"
            className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-2xl flex flex-col items-center relative overflow-hidden shadow-sm"
          >
            {/* 상단 배지 및 타이틀 */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                <ShieldCheck className="text-blue-600 dark:text-blue-400 w-6 h-6" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white text-center tracking-tight">
                {formData.customName} <span className="font-light opacity-80">이름 감정서</span>
              </h2>
            </div>

            {/* 점수 원형 그래프 */}
            <div className="w-44 h-44 mb-10 relative flex items-center justify-center">
              <div className="absolute inset-0">
                <CircularProgressbar
                  value={appraisalResult.totalScore}
                  strokeWidth={8}
                  styles={{
                    path: {
                      stroke: getScoreColor(appraisalResult.totalScore),
                      strokeLinecap: 'round',
                      transition: 'stroke-dashoffset 1.5s ease 0s',
                    },
                    trail: {
                      // 💡 버보드 다크모드 캘린더 배경과 어울리도록 트랙 색상 조정
                      stroke: isDarkMode ? '#1e293b' : '#f1f5f9'
                    },
                  }}
                />
              </div>
              <div className="flex flex-col items-center justify-center z-10 mt-1">
                <span className="text-6xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                  {appraisalResult.totalScore}
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2 tracking-widest uppercase">
                  SCORE
                </span>
              </div>
            </div>

            {/* 점선 구분선 및 세부 스탯 */}
            <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700 pt-8 pb-6">
              <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100 dark:divide-slate-800">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">오행</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {appraisalResult.sajuBalance}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">궁합</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {appraisalResult.mbtiSynergy}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">수리</span>
                  <span className={`text-2xl font-black ${appraisalResult.strokesLuck === '대길(大吉)' ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                    {appraisalResult.strokesLuck}
                  </span>
                </div>
              </div>
            </div>

            {/* 총평 코멘트 (버보드 데이터 패널 스타일) */}
            <div className="w-full bg-slate-50 dark:bg-[#151e32] border border-slate-100 dark:border-slate-800/60 p-5 rounded-xl flex gap-3 mt-2">
              <AlertCircle className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5 w-5 h-5" />
              <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium break-keep">
                {appraisalResult.comment}
              </p>
            </div>

            <div className="w-full mt-6 px-2">
              <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed opacity-70 break-keep">
                ※ 본 감정서는 성명학적 참고용으로만 활용해 주세요. 버튜버로서의 실제 성공 여부는 본인의 노력과 재능, 그리고 팬들과의 소통에 달려 있습니다.
              </p>

              {/* 서비스 로고나 워터마크를 살짝 넣어주면 캡처본의 출처가 더 명확해집니다 */}
              <div className="mt-4 flex justify-end opacity-30 grayscale">
                <span className="text-[12px] font-black tracking-tighter text-slate-400">© Virboard</span>
              </div>
            </div>

          </div>
          {/* --- 캡처 영역 끝 --- */}

          {/* 누락된 한자 안내문 (캡처 제외) */}
          {appraisalResult.missingKanjiList && appraisalResult.missingKanjiList.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl mt-4 flex gap-3">
              <Info className="text-slate-400 shrink-0 mt-0.5 w-5 h-5" />
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                ※ 입력하신 이름 중 일부 한자(<strong className="text-slate-700 dark:text-slate-300">{appraisalResult.missingKanjiList.join(', ')}</strong>)의 정확한 획수 데이터가 아직 등록되지 않아 임시 수치로 감정되었습니다.
              </p>
            </div>
          )}

          {/* 하단 버튼 영역 */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setAppraisalStep('input')}
              className="w-full md:w-auto px-8 py-4 font-medium text-gray-700 bg-white border border-gray-300 rounded-xl text-base dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              다른 이름 감정하기
            </button>
            <button
              onClick={handleShareAsImage}
              disabled={isCapturing}
              className="w-full md:w-auto px-8 py-4 bg-[#20639B] text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all order-1 md:order-2"
            >
              {isCapturing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
              {isCapturing ? '이미지 굽는 중...' : '결과 이미지로 저장'}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}