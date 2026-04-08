import React, { useState } from 'react';
import { Sparkles, Globe, Swords, Loader2, Heart, Share2, Info } from 'lucide-react';
import { DateTime } from "luxon";
import { createLuxonAdapter } from "@gracefullight/saju/adapters/luxon";
import { getSaju } from "@gracefullight/saju";

import { vtuberNames } from "@/utils/naming/assets/vtuber_first_name.json";
import { vtuberSurnames } from "@/utils/naming/assets/vtuber_last_name.json"

// --- 1-2. 퍼스트 네임 데이터 (일본어식) ---
const vtuberJapaneseNames = {
  wood: [
    { name: "サクラ", kr: "사쿠라", meaning: "벚꽃", gender: "female" },
    { name: "カエデ", kr: "카에데", meaning: "단풍나무", gender: "female" },
    { name: "ユズ", kr: "유즈", meaning: "유자", gender: "female" },
    { name: "ツバキ", kr: "츠바키", meaning: "동백", gender: "female" },
    { name: "モエ", kr: "모에", meaning: "싹틈, 시작", gender: "female" },
    { name: "リンゴ", kr: "링고", meaning: "사과", gender: "female" }
  ],
  fire: [
    { name: "アカリ", kr: "아카리", meaning: "등불, 밝음", gender: "female" },
    { name: "ホタル", kr: "호타루", meaning: "반딧불이", gender: "female" },
    { name: "ヒナ", kr: "히나", meaning: "햇살", gender: "female" },
    { name: "アカネ", kr: "아카네", meaning: "붉은 빛", gender: "female" },
    { name: "ホムラ", kr: "호무라", meaning: "불꽃", gender: "neutral" },
    { name: "マツリ", kr: "마츠리", meaning: "축제", gender: "neutral" }
  ],
  earth: [
    { name: "コハク", kr: "코하쿠", meaning: "호박(보석)", gender: "neutral" },
    { name: "ユイ", kr: "유이", meaning: "결속, 맺음", gender: "female" },
    { name: "ダイチ", kr: "다이치", meaning: "대지", gender: "male" },
    { name: "カナ", kr: "카나", meaning: "온화함, 아름다움", gender: "female" },
    { name: "マシロ", kr: "마시로", meaning: "순백, 깨끗함", gender: "female" },
    { name: "チセ", kr: "치세", meaning: "요정, 작은 별", gender: "female" }
  ],
  metal: [
    { name: "スズ", kr: "스즈", meaning: "방울", gender: "female" },
    { name: "ツルギ", kr: "츠루기", meaning: "검", gender: "male" },
    { name: "ギン", kr: "긴", meaning: "은", gender: "neutral" },
    { name: "コテツ", kr: "코테츠", meaning: "강철", gender: "male" },
    { name: "ウタ", kr: "우타", meaning: "노래", gender: "female" },
    { name: "カノン", kr: "카논", meaning: "선율", gender: "female" }
  ],
  water: [
    { name: "シズク", kr: "시즈쿠", meaning: "물방울", gender: "female" },
    { name: "ミナト", kr: "미나토", meaning: "항구", gender: "neutral" },
    { name: "ウミ", kr: "우미", meaning: "바다", gender: "female" },
    { name: "ユキ", kr: "유키", meaning: "눈", gender: "female" },
    { name: "イズミ", kr: "이즈미", meaning: "샘", gender: "neutral" },
    { name: "ミオ", kr: "미오", meaning: "물결, 흐름", gender: "female" }
  ]
};

const elementLabels = {
  wood: '목(木) - 성장의 기운 (나무, 꽃, 자연숲)',
  fire: '화(火) - 확산의 기운 (악마, 드래곤, 빛)',
  earth: '토(土) - 중재의 기운 (인간, 대지, 광물)',
  metal: '금(金) - 결실의 기운 (사이보그, 기사, 기계)',
  water: '수(水) - 지혜의 기운 (해양, 심해, 얼음)'
};

// 16가지 MBTI별 오행 가중치 매핑
const mbtiWeights = {
  INTJ: { wood: 0.8, fire: 1.5, earth: 1.0, metal: 2.0, water: 1.2 },
  INTP: { wood: 0.8, fire: 1.2, earth: 1.0, metal: 2.5, water: 1.5 },
  ENTJ: { wood: 1.0, fire: 2.0, earth: 1.5, metal: 2.0, water: 1.0 },
  ENTP: { wood: 1.0, fire: 1.8, earth: 1.0, metal: 2.0, water: 1.5 },
  INFJ: { wood: 2.0, fire: 1.5, earth: 1.0, metal: 0.8, water: 2.0 },
  INFP: { wood: 2.5, fire: 1.5, earth: 1.0, metal: 0.5, water: 2.0 },
  ENFJ: { wood: 2.0, fire: 2.0, earth: 1.0, metal: 0.8, water: 1.5 },
  ENFP: { wood: 2.0, fire: 2.5, earth: 1.0, metal: 0.5, water: 1.5 },
  ISTJ: { wood: 1.0, fire: 0.8, earth: 2.5, metal: 2.0, water: 1.0 },
  ISFJ: { wood: 1.5, fire: 1.0, earth: 2.5, metal: 1.5, water: 1.5 },
  ESTJ: { wood: 1.0, fire: 1.2, earth: 2.0, metal: 2.5, water: 1.0 },
  ESFJ: { wood: 1.5, fire: 1.5, earth: 2.0, metal: 1.5, water: 1.5 },
  ISTP: { wood: 1.0, fire: 1.0, earth: 1.5, metal: 2.5, water: 1.5 },
  ISFP: { wood: 2.0, fire: 1.5, earth: 1.5, metal: 1.0, water: 2.0 },
  ESTP: { wood: 1.0, fire: 2.0, earth: 1.0, metal: 2.0, water: 1.5 },
  ESFP: { wood: 1.5, fire: 2.5, earth: 1.0, metal: 1.0, water: 2.0 }
};

// 배열 셔플 유틸리티
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 한자 오행을 영어 키로 변환
const mapSajuElement = (hanja: string): keyof typeof vtuberNames | null => {
  const map: Record<string, keyof typeof vtuberNames> = {
    '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water'
  };
  return map[hanja] || null;
};

export default function VTuberNamingStudio() {
  const [activeTab, setActiveTab] = useState('japanese');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jpResults, setJpResults] = useState<any[]>([]);

  // 폼 상태 관리 
  const [formData, setFormData] = useState({
    characterAttribute: 'water', // ⬅️ 추가된 캐릭터 속성 필드
    birthDate: '1990-01-01',
    debutDate: '',
    mbti: '',
    gender: 'female',
    nameStyle: 'japanese', // 이름 스타일 옵션 (english | japanese)
  });

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      let coreElement: keyof typeof vtuberNames = 'water';
      let successElement: keyof typeof vtuberNames | null = null;
      let finalElement: keyof typeof vtuberNames = 'water';
      let elementScores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

      const adapter = await createLuxonAdapter();

      // 0. 캐릭터 세계관 속성 (모티브) 분석 - 가장 높은 가중치 부여
      if (formData.characterAttribute) {
        elementScores[formData.characterAttribute as keyof typeof elementScores] += 15;
      }

      // 1. 생일 사주 분석 (캐릭터 본질) - 시간을 모름으로 가정하고 정오(12:00) 세팅
      if (formData.birthDate) {
        const [year, month, day] = formData.birthDate.split('-');
        const birthDt = DateTime.fromObject({ year: Number(year), month: Number(month), day: Number(day), hour: 12, minute: 0 }, { zone: "Asia/Seoul" });

        if (birthDt.isValid) {
          const saju = getSaju(birthDt, { adapter, gender: formData.gender });
          coreElement = mapSajuElement(saju.yongShen.primary.element) || 'water';
          elementScores[coreElement] += 10; // 생일 용신 가산점
        }
      }

      // 2. 데뷔일 사주 분석 (성공/흥행운) - 시간 모름으로 가정
      if (formData.debutDate) {
        const [dYear, dMonth, dDay] = formData.debutDate.split('-');
        const debutDt = DateTime.fromObject({ year: Number(dYear), month: Number(dMonth), day: Number(dDay), hour: 12, minute: 0 }, { zone: "Asia/Seoul" });

        if (debutDt.isValid) {
          const debutSaju = getSaju(debutDt, { adapter, gender: formData.gender });
          successElement = mapSajuElement(debutSaju.yongShen.primary.element);
          if (successElement) {
            elementScores[successElement] += 5; // 데뷔일 용신 가산점
          }
        }
      }

      // 3. MBTI 성향 가중치 곱연산
      if (formData.mbti && mbtiWeights[formData.mbti as keyof typeof mbtiWeights]) {
        const weights = mbtiWeights[formData.mbti as keyof typeof mbtiWeights];
        for (let key in elementScores) {
          const baseScore = elementScores[key as keyof typeof elementScores] || 1;
          elementScores[key as keyof typeof elementScores] = baseScore * weights[key as keyof typeof weights];
        }
      }

      // 4. 최종 점수가 가장 높은 오행 테마 선정
      finalElement = Object.keys(elementScores).reduce((a, b) =>
        elementScores[a as keyof typeof elementScores] > elementScores[b as keyof typeof elementScores] ? a : b
      ) as keyof typeof vtuberNames;

      // 5. 이름 및 성씨 조합 생성
      setTimeout(() => {
        // 선택한 이름 스타일에 따라 퍼스트 네임 풀 결정
        const targetFirstNamePool = formData.nameStyle === 'english' ? vtuberNames[finalElement] : vtuberJapaneseNames[finalElement];

        const shuffledFirstNames = shuffleArray(targetFirstNamePool);
        const { twoCharSurnames, longSurnames } = vtuberSurnames;
        const shuffledSurnames = shuffleArray([...twoCharSurnames, ...longSurnames]);

        const combinations = [];
        const resultCount = Math.min(10, shuffledSurnames.length, shuffledFirstNames.length);

        for (let i = 0; i < resultCount; i++) {
          combinations.push({
            surname: shuffledSurnames[i],
            firstName: shuffledFirstNames[i],
            matchedElement: finalElement
          });
        }

        setJpResults(combinations);
        setIsGenerating(false);
      }, 800);

    } catch (error) {
      console.error("작명 분석 중 오류 발생:", error);
      alert("분석 중 오류가 발생했습니다. 날짜 형식을 확인해주세요.");
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300 selection:bg-indigo-500/30">

        <div className="max-w-4xl mx-auto space-y-8 pt-12 md:pt-16 p-6">

          <div className="text-center space-y-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-transparent text-sm font-medium">
              버튜버 데뷔 준비
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">세계관 맞춤 작명 스튜디오</h1>
            <p className="text-slate-500 dark:text-slate-400">명리학 분석과 기질(MBTI)을 종합하여 당신만의 세계관을 만듭니다.</p>
          </div>

          <div className="w-full">
            {/* 탭 리스트 */}
            <div className="grid w-full grid-cols-3 bg-slate-200/50 dark:bg-slate-900 h-14 rounded-xl p-1 gap-1 mb-6">
              <button
                disabled
                onClick={() => { setActiveTab('korean'); setJpResults([]); }}
                className={`flex items-center justify-center text-sm md:text-base font-medium rounded-lg transition-all ${activeTab === 'korean' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                <Sparkles className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" /> 모던/동양
              </button>
              <button
                onClick={() => setActiveTab('japanese')}
                className={`flex items-center justify-center text-sm md:text-base font-medium rounded-lg transition-all ${activeTab === 'japanese' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                <Globe className="w-4 h-4 mr-2 text-rose-500 dark:text-rose-400" /> 서브컬처 (JP)
              </button>
              <button
                disabled
                onClick={() => { setActiveTab('western'); setJpResults([]); }}
                className={`flex items-center justify-center text-sm md:text-base font-medium rounded-lg transition-all ${activeTab === 'western' ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                <Swords className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" /> 판타지 (EN)
              </button>
            </div>

            {/* JP-Style 탭 폼 컨텐츠 */}
            {activeTab === 'japanese' && jpResults.length === 0 && !isGenerating && (
              <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">통합 작명 분석 엔진</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">캐릭터 속성과 사주를 결합하여 완벽한 서브컬처 네이밍을 조합합니다.</p>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* 캐릭터 속성 (새로 추가됨) */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                        <span>캐릭터 속성 (모티브)</span>
                        <span className="text-xs text-rose-500 font-medium">※ 작명에 가장 큰 영향을 줍니다</span>
                      </label>
                      <select
                        value={formData.characterAttribute}
                        onChange={(e) => setFormData({ ...formData, characterAttribute: e.target.value })}
                        className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 outline-none font-medium"
                      >
                        <option value="water">수(水) - 해양, 심해, 얼음</option>
                        <option value="wood">목(木) - 요정, 숲, 엘프</option>
                        <option value="fire">화(火) - 악마, 드래곤, 빛</option>
                        <option value="earth">토(土) - 인간, 대지, 광물</option>
                        <option value="metal">금(金) - 사이보그, 기사, 기계</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">캐릭터 생일 (본질)</label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                      <p className="text-xs text-slate-400 mt-1">※ 시간 모름 (정오 기준으로 분석됩니다)</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">방송 데뷔(예정)일 (흥행운)</label>
                      <input
                        type="date"
                        value={formData.debutDate}
                        onChange={(e) => setFormData({ ...formData, debutDate: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                      <p className="text-xs text-slate-400 mt-1">※ 시간 모름</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
                        <span>MBTI 성향 (선택)</span>
                        <span className="text-xs text-slate-400 font-normal">성격 가중치 적용</span>
                      </label>
                      <select
                        value={formData.mbti}
                        onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
                        className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      >
                        <option value="">선택 안함</option>
                        {Object.keys(mbtiWeights).map(mbti => (
                          <option key={mbti} value={mbti}>{mbti}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">이름 스타일</label>
                      <div className="flex space-x-6 pt-2 border border-transparent">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="nameStyle"
                            value="english"
                            checked={formData.nameStyle === 'english'}
                            onChange={(e) => setFormData({ ...formData, nameStyle: e.target.value })}
                            className="text-rose-500 focus:ring-rose-500"
                          />
                          <span className="text-slate-700 dark:text-slate-300">영어식 (판타지)</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="nameStyle"
                            value="japanese"
                            checked={formData.nameStyle === 'japanese'}
                            onChange={(e) => setFormData({ ...formData, nameStyle: e.target.value })}
                            className="text-rose-500 focus:ring-rose-500"
                          />
                          <span className="text-slate-700 dark:text-slate-300">완전 일본어식</span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">성별 기준 (사주 분석용)</label>
                      <div className="flex space-x-6 pt-2 border border-transparent">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="text-rose-500 focus:ring-rose-500"
                          />
                          <span className="text-slate-700 dark:text-slate-300">남성</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="text-rose-500 focus:ring-rose-500"
                          />
                          <span className="text-slate-700 dark:text-slate-300">여성</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50">
                    <button
                      className="w-full h-12 flex items-center justify-center text-lg font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors disabled:opacity-70"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      운명적 이름 조합하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 로딩 화면 */}
            {isGenerating && (
              <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 py-16 px-6 text-center animate-[fadeIn_0.2s_ease-out]">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">사주와 성향을 융합하고 있습니다...</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">입력된 데이터를 바탕으로 최적의 오행 테마를 계산 중입니다.</p>
                  </div>
                </div>
              </div>
            )}

            {/* JP-Style 결과 화면 */}
            {activeTab === 'japanese' && jpResults.length > 0 && !isGenerating && (
              <div className="w-full space-y-6 animate-[fadeIn_0.5s_ease-out]">

                {/* 💡 수정된 분석 결과 헤더 박스 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400">
                      분석 결과: {elementLabels[jpResults[0].matchedElement as keyof typeof elementLabels]}
                    </h2>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 mt-4 flex gap-3">
                    <Info className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                      {formData.mbti ? `[${formData.mbti} 맞춤 기질 적용] ` : ''}
                      선택하신 캐릭터 모티브에 생일과 데뷔일의 기운을 융합하여 추출된 이름입니다. 당신의 매력을 가장 잘 살릴 수 있는 세계관을 확인해보세요.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {jpResults.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-300 dark:hover:border-rose-700 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          {/* 루비(후리가나) + 한글 발음 표기 */}
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 ml-1 font-medium tracking-widest">
                            {item.surname.kanji} {item.firstName.name}
                          </div>
                          <div className="flex items-baseline space-x-2">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-serif">
                              {item.surname.kana} {item.firstName.kr}
                            </h3>
                          </div>
                        </div>
                        <button className="text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-500 transition-colors focus:outline-none">
                          <Heart className="h-6 w-6 stroke-[1.5]" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700">
                          성씨: {item.surname.meaning}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-xs font-medium rounded-md border border-rose-100 dark:border-rose-800/50">
                          이름: {item.firstName.meaning}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                        "{item.surname.meaning}"을 상징하는 성씨와 "{item.firstName.meaning}"의 의미를 결합하여 세계관을 강조했습니다.
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-4 space-x-4">
                  <button
                    className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                    onClick={() => setJpResults([])}
                  >
                    다시 분석하기
                  </button>
                  <button className="px-6 py-3 flex items-center bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors shadow-sm">
                    <Share2 className="mr-2 h-4 w-4" /> 결과 공유하기
                  </button>
                </div>
              </div>
            )}

            {/* K-Style 및 EN-Style 탭 플레이스홀더 */}
            {(activeTab === 'korean' || activeTab === 'western') && (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400">해당 탭의 로직은 준비 중입니다.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}