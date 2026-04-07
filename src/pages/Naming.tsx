import React, { useState } from 'react';
import { Loader2, Heart, Share2, ArrowRight } from 'lucide-react';
import { DateTime } from "luxon";
import { createLuxonAdapter } from "@gracefullight/saju/adapters/luxon";
import { getSaju } from "@gracefullight/saju";
import { processNaming } from '@/utils/naming';

// --- Fisher-Yates Shuffle 알고리즘 함수 ---
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 두 요소를 스왑
  }
  return shuffled;
};

export default function Naming() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');

  const [formData, setFormData] = useState({
    lastNameHangul: '',
    lastNameHanja: '',
    birthDate: '1990-01-01',
    birthTime: '00:00',
    gender: 'male',
  });

  const [topRecommendedNames, setTopRecommendedNames] = useState([]);

  const getOwnNaming = async (lastName, birthDate, gender, len = 2) => {
    const adapter = await createLuxonAdapter();
    const { yongShen: { primary, secondary } } = getSaju(birthDate, { adapter, gender });
    return processNaming(lastName, [primary.hanja, secondary.hanja], gender, len);
  };

  const handleStartAnalysis = async () => {
    setStep('loading');

    setTimeout(async () => {
      try {
        const [year, month, day] = formData.birthDate.split('-');
        const [hour, minute] = formData.birthTime.split(':');

        const birthDateTime = DateTime.fromObject(
          {
            year: Number(year),
            month: Number(month),
            day: Number(day),
            hour: Number(hour),
            minute: Number(minute)
          },
          { zone: "Asia/Seoul" }
        );

        if (!birthDateTime.isValid) {
          throw new Error(`유효하지 않은 날짜입니다: ${birthDateTime.invalidReason}`);
        }

        const lastNameObj = { hanja: formData.lastNameHanja, hangul: formData.lastNameHangul };

        const finalResult = await getOwnNaming(lastNameObj, birthDateTime, formData.gender);

        let nameList = [];
        let tempObj = {};
        for (let i = 0; i < finalResult.length; i++) {
          if (tempObj.hangul === finalResult[i].hangul) {
            tempObj.children = tempObj.children.concat(finalResult[i]);
          } else {
            nameList = nameList.concat(tempObj);
            tempObj = {
              hangul: finalResult[i].hangul,
              children: [finalResult[i]]
            };
          }
        }
        nameList = nameList.concat(tempObj);
        nameList.splice(0, 1);

        // --- [핵심 수정 포인트: Fisher-Yates 적용] ---
        // 1. 그룹화된 전체 리스트를 무작위로 섞습니다.
        const shuffledList = shuffleArray(nameList);

        // 2. 섞인 리스트에서 상위 4개만 추출합니다.
        const top4 = shuffledList.slice(0, 4).map(item => {
          // 각 한글 이름에서도 첫 번째 한자만 가져오는 대신, 
          // 한자 리스트도 무작위로 하나 뽑고 싶으시다면 여기서도 셔플을 적용할 수 있습니다.
          // 현재는 해당 한글 이름의 첫 번째 한자 조합을 가져옵니다.
          const bestHanja = item.children[0];

          return {
            hangul: item.hangul,
            hanja: formData.lastNameHanja + bestHanja.hanja,
            tags: ['#사주보완', '#수리성명학_길(吉)'],
            desc: '음양오행과 81수리가 조화롭게 어우러져 평안하고 길한 기운을 이끄는 좋은 이름입니다.'
          };
        });

        setTopRecommendedNames(top4);
        setStep('result');

      } catch (error) {
        console.error("작명 분석 중 오류 발생:", error);
        alert(`분석 중 오류가 발생했습니다: ${error.message}`);
        setStep('input');
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans selection:bg-indigo-100">

      {/* 공통 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">새로운 시작을 위한 이름</h1>
        <p className="text-slate-500">사주 명리학 기반 맞춤 개명 추천 서비스</p>
      </div>

      {/* 1. 입력 폼 화면 */}
      {step === 'input' && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">기본 정보 입력</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">성씨 (한글)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                  value={formData.lastNameHangul}
                  onChange={(e) => setFormData({ ...formData, lastNameHangul: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">성씨 (한자)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                  value={formData.lastNameHanja}
                  onChange={(e) => setFormData({ ...formData, lastNameHanja: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">생년월일</label>
                <input
                  type="date"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">태어난 시간</label>
                <input
                  type="time"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none bg-white transition-all"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <label className="block text-sm font-medium text-slate-700">성별</label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 text-slate-900 focus:ring-slate-900 border-slate-300"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">남성</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 text-slate-900 focus:ring-slate-900 border-slate-300"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">여성</span>
                </label>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <button
              className="w-full h-12 flex items-center justify-center text-lg font-medium bg-[#111827] text-white rounded-lg hover:bg-slate-800 transition-colors"
              onClick={handleStartAnalysis}
            >
              내게 맞는 이름 찾기
            </button>
          </div>
        </div>
      )}

      {/* 2. 로딩 화면 */}
      {step === 'loading' && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 py-16 px-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-900">최적의 이름을 선별 중입니다...</h3>
              <p className="text-sm text-slate-500">수천 개의 조합 중 무작위로 4개를 찾고 있습니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. 결과 화면 */}
      {step === 'result' && (
        <div className="w-full max-w-4xl space-y-6 animate-[fadeIn_0.5s_ease-out]">

          {/* 사주 요약 정보 카드 */}
          <div className="bg-[#0f172a] text-slate-50 rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-bold mb-2">사주 오행 분석 결과</h2>
            <p className="text-sm text-slate-400 mb-5">
              사주의 기운을 바탕으로 분석했습니다.
            </p>
            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/50">
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                사용자님의 사주에서 부족한 오행의 기운을 보완하고, 전체적인 조화를 이룰 수 있는 맑고 단단한 한자들을 무작위로 선별했습니다.
              </p>
            </div>
          </div>

          {/* 추천 이름 리스트 (2x2 그리드) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {topRecommendedNames.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-baseline space-x-2">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
                      {item.hangul}
                    </h3>
                    <span className="text-lg text-slate-400 font-sans font-normal">
                      {item.hanja}
                    </span>
                  </div>
                  <button className="text-slate-300 hover:text-rose-500 transition-colors focus:outline-none">
                    <Heart className="h-6 w-6 stroke-[1.5]" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 bg-slate-50 text-slate-500 text-xs font-medium rounded-md border border-slate-100">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex justify-center pt-8 space-x-4">
            <button
              className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200 outline-none"
              onClick={() => setStep('input')}
            >
              다시 분석하기
            </button>
            <button className="px-6 py-3 flex items-center bg-[#0f172a] text-white font-medium rounded-lg hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-slate-900 outline-none shadow-sm">
              <Share2 className="mr-2 h-4 w-4" /> 결과 공유하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}