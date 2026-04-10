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

export default function Appraisal() {
  const [appraisalStep, setAppraisalStep] = useState<'input' | 'loading' | 'result'>('input');

  const [formData, setFormData] = useState({
    customName: '',
    nameTheme: 'earth',
    birthDate: '1990-01-01',
    mbti: '',
    gender: 'none'
  });

  const [appraisalResult, setAppraisalResult] = useState<any>(null);
  const [nameLanguage, setNameLanguage] = useState<'korean' | 'english' | 'japanese' | 'mixed' | 'empty'>('empty');

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
      missingKanjiList = strokeData.missingChars; // DB에 진짜 없는 한자만 들어옵니다!

      // 💡 누락된 한자가 발견되면 백그라운드에서 구글 시트로 조용히 전송
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
        }).catch(err => console.error("구글 시트 전송 실패 (백그라운드 에러):", err));
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
        const neededElement = mapSajuElement((saju.yongShen.primary as any).element);

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
        comment = `사주의 부족한 기운을 완벽히 채워주며 81수리까지 대길(${strokes}획)인 훌륭한 이름입니다. 하지만 데뷔일의 흥행운까지 고려한 '진짜 운명적 이름'을 원하신다면 프리미엄을 확인해보세요.`;
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
          missingKanjiList // 결과 상태에 누락 한자 목록 추가
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
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]  h-[100dvh] flex flex-col">
      {/* 1. 입력창 영역 (기존과 동일하여 생략 가능하지만 전체 구조 유지를 위해 포함) */}
      {appraisalStep === 'input' && (
        <div className="bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800/50">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">이미 생각해둔 이름이 있나요?</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">입력하신 이름이 데뷔 성공운과 얼마나 맞는지 감정해 드립니다.</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">감정받을 이름 (성 포함)</label>
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
                  className={`w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-xl outline-none text-xl font-bold transition-all ${nameLanguage === 'mixed'
                    ? 'border-amber-400 focus:border-amber-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500'
                    }`}
                />
              </div>

              <div className="h-6 mt-1 transition-all duration-300">
                {nameLanguage === 'mixed' && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center animate-[fadeIn_0.2s_ease-out]">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    정확한 수리 감정을 위해 하나의 언어(예: 한글 발음)로 통일해 주세요!
                  </p>
                )}
                {nameLanguage === 'korean' && (
                  <p className="text-sm text-indigo-500 flex items-center animate-[fadeIn_0.2s_ease-out]">
                    <Info className="w-4 h-4 mr-1.5" />
                    한글 획수 및 음령오행(발음) 기준으로 감정이 진행됩니다.
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
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">캐릭터 컨셉 (오행)</label>
                <select
                  value={formData.nameTheme}
                  onChange={(e) => setFormData({ ...formData, nameTheme: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="water">수(水) - 해양, 심해, 얼음</option>
                  <option value="wood">목(木) - 학생, 요정, 숲</option>
                  <option value="fire">화(火) - 악마, 드래곤, 빛</option>
                  <option value="earth">토(土) - 인간, 일상, 대지</option>
                  <option value="metal">금(金) - 기사, 기계, 사이보그</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">MBTI (선택)</label>
                <select
                  value={formData.mbti}
                  onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all"
                >
                  <option value="">선택 안함</option>
                  {Object.keys(mbtiWeights).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                  <span>생일 / 데뷔일</span>
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* 💡 성별 선택 영역: '없음/모름' 옵션 추가 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">성별</label>
                <div className="flex space-x-5 pt-3 px-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
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
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
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
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">없음/비밀</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleAppraise}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <BarChart3 className="w-5 h-5" /> 무료 감정 리포트 보기
            </button>
          </div>
        </div>
      )}

      {/* 로딩 화면 (기존과 동일) */}
      {appraisalStep === 'loading' && (
        <div className="w-full bg-white dark:bg-slate-900 py-20 px-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">이름의 운세를 감정 중입니다...</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">81수리와 사주 오행의 균형을 분석하고 있습니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. 감정 결과 화면 */}
      {appraisalStep === 'result' && appraisalResult && (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
          <div className="bg-white dark:bg-slate-900 p-8">
            <div id="capture-target">
              <div className="bg-indigo-50 dark:bg-indigo-950/20 border-2 border-indigo-200 dark:border-indigo-800 p-6 rounded-2xl flex items-center justify-between mb-8 shadow-inner">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">"{formData.customName}" 감정 결과</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{appraisalResult.totalScore}</span>
                  <span className="text-2xl font-bold text-slate-400">점</span>
                </div>
              </div>

              {/* 점수 상세 차트 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-center border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center min-h-[140px]">
                  <div className="text-xs text-slate-500 mb-1">오행 보완</div>
                  <div className={`text-3xl font-black ${appraisalResult.sajuBalance === 'S' ? 'text-blue-500' : appraisalResult.sajuBalance === 'A' ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-300'}`}>
                    {appraisalResult.sajuBalance}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-center border border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center min-h-[140px]">
                  <div className="text-xs text-slate-500 mb-1">성격 궁합</div>
                  <div className={`text-3xl font-black ${appraisalResult.mbtiSynergy === 'S' ? 'text-rose-500' : appraisalResult.mbtiSynergy === 'A' ? 'text-pink-500' : 'text-slate-600 dark:text-slate-300'}`}>
                    {appraisalResult.mbtiSynergy}
                  </div>
                </div>
                <div className={`p-5 rounded-2xl text-center border-2 flex flex-col items-center justify-center min-h-[140px] ${appraisalResult.strokesLuck === '대길(大吉)' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                  <div className={`text-xs mb-1 ${appraisalResult.strokesLuck === '대길(大吉)' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>81 수리운</div>
                  <div className={`text-3xl font-black ${appraisalResult.strokesLuck === '대길(大吉)' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                    {appraisalResult.strokesLuck}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-5 rounded-xl flex gap-3">
                <AlertCircle className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-sm md:text-base text-indigo-900 dark:text-indigo-100 leading-relaxed font-medium">
                  {appraisalResult.comment}
                </p>
              </div>
            </div>

            {/* 💡 누락된 한자가 있을 때만 나타나는 솔직한 안내 UI */}
            {appraisalResult.missingKanjiList && appraisalResult.missingKanjiList.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl mt-4 flex gap-3 animate-[fadeIn_0.5s_ease-out]">
                <Info className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  ※ 입력하신 이름 중 일부 한자의 정확한 획수 데이터가 아직 시스템에 등록되지 않아, 임시 수치로 감정되었습니다. 보다 완벽한 서비스를 위해 현재 시스템에 업데이트를 요청했습니다.
                </p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-end gap-4">
              <button
                onClick={() => setAppraisalStep('input')}
                className="text-sm font-medium text-slate-400 hover:text-indigo-500 transition-colors"
              >
                다른 이름 감정하기
              </button>
              <button
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/10 active:scale-99 transition-all"
              >
                <Share2 className="w-4 h-4" /> 이미지로 결과 공유하기
              </button>
            </div>
          </div>

          {/* 3. 유료 서비스 유도 (Premium Upsell) */}
          {/* <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span className="font-bold tracking-wider uppercase text-sm text-indigo-200">Premium Service</span>
              </div>
              <h4 className="text-2xl font-black leading-tight">
                데뷔 첫 달 시청자 수를 <br />결정짓는 '성공 이름'이 있습니다.
              </h4>
              <p className="text-indigo-100 text-sm leading-relaxed opacity-90 mt-2">
                사주와 캐릭터 기질을 완벽히 분석하여,<br />
                81수리 '대길(大吉)'수만 엄선한 <strong className="text-white">프리미엄 이름 4선</strong>을 제안해 드립니다.
              </p>

              <div className="pt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <button className="px-8 py-4 bg-white text-indigo-600 font-black rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95">
                  추천 이름 4개 확인하기 <Lock className="w-4 h-4" />
                </button>
                <div className="text-sm flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
                  <span className="line-through text-indigo-300">₩4,990</span>
                  <div className="font-black text-xl text-amber-300">₩990</div>
                </div>
              </div>
            </div>

            <ShieldCheck className="absolute -right-10 -bottom-10 w-56 h-56 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
          </div> */}
        </div>
      )}
    </div>
  );
}