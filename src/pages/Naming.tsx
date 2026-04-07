import React, { useState } from 'react';
import { Sparkles, Globe, Swords, Flame, Droplet, Mountain, Wind, Loader2, Sun, Moon } from 'lucide-react';

export default function VTuberNamingStudio() {
  const [activeTab, setActiveTab] = useState('korean');
  const [isGenerating, setIsGenerating] = useState(false);

  // 로딩 시뮬레이션
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300 selection:bg-indigo-500/30">

      <div className="max-w-4xl mx-auto space-y-8 pt-12 md:pt-16 p-6">

        {/* 헤더 섹션 */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-transparent text-sm font-medium transition-colors">
            버튜버 데뷔 준비
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">세계관 맞춤 작명 스튜디오</h1>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">캐릭터의 종족, 속성, 활동 지역에 맞는 완벽한 이름을 찾아보세요.</p>
        </div>

        {/* 탭 기반 메인 컨트롤러 */}
        <div className="w-full">
          {/* 탭 리스트 */}
          <div className="grid w-full grid-cols-3 bg-slate-200/50 dark:bg-slate-900 h-14 rounded-xl p-1 gap-1 mb-6 transition-colors">
            <button
              onClick={() => setActiveTab('korean')}
              className={`flex items-center justify-center text-sm md:text-base font-medium rounded-lg transition-all ${activeTab === 'korean'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                }`}
            >
              <Sparkles className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
              모던/동양 (K-Style)
            </button>
            <button
              onClick={() => setActiveTab('japanese')}
              className={`flex items-center justify-center text-sm md:text-base font-medium rounded-lg transition-all ${activeTab === 'japanese'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                }`}
            >
              <Globe className="w-4 h-4 mr-2 text-rose-500 dark:text-rose-400" />
              서브컬처 (JP-Style)
            </button>
            <button
              onClick={() => setActiveTab('western')}
              className={`flex items-center justify-center text-sm md:text-base font-medium rounded-lg transition-all ${activeTab === 'western'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                }`}
            >
              <Swords className="w-4 h-4 mr-2 text-emerald-500 dark:text-emerald-400" />
              판타지 (EN-Style)
            </button>
          </div>

          {/* 1. K-Style 탭 컨텐츠 */}
          {activeTab === 'korean' && (
            <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">오행 기반 2~3글자 조합</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">현대적이고 세련된 발음의 이름을 생성합니다.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">데뷔(예정)일</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">캐릭터 속성 (오행)</label>
                    <select className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
                      <option value="wood">목(木) - 요정, 숲, 엘프</option>
                      <option value="fire">화(火) - 악마, 드래곤, 열정</option>
                      <option value="earth">토(土) - 대지, 광물, 친근함</option>
                      <option value="metal">금(金) - 사이보그, 기사, 차가움</option>
                      <option value="water" selected>수(水) - 해양, 심해, 얼음</option>
                    </select>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
                  <button
                    className="w-full h-11 flex items-center justify-center font-medium bg-[#1e40af] hover:bg-[#1e3a8a] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-70"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 세계관 분석 중...</> : '이름 조합하기'}
                  </button>
                </div>
              </div>

              {/* 결과 예시 (K-Style) */}
              {!isGenerating && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-white">루미나</h4>
                      <span className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-medium rounded-md border border-blue-200 dark:border-blue-500/20">
                        수(水) + 수(水)
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      부드럽게 흘러가는 해양 속성 발음. 글로벌 표기(Rumina)가 직관적입니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. JP-Style 탭 컨텐츠 */}
          {activeTab === 'japanese' && (
            <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">서브컬처 일본식 조합</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">한자의 뜻(자원오행)과 발음오행을 매칭하여 애니메이션 스타일의 이름을 만듭니다.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">캐릭터 모티브</label>
                    <input
                      type="text"
                      placeholder="예: 구미호, 무녀, 우주, 해적..."
                      className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
                  <button
                    className="w-full h-11 flex items-center justify-center font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors disabled:opacity-70"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 생성 중...</> : '서브컬처 이름 생성'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. EN-Style 탭 컨텐츠 */}
          {activeTab === 'western' && (
            <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 transition-colors">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">4대 원소 서양식 판타지</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">서양의 4원소(불, 물, 땅, 바람)에 기반한 영어권 닉네임입니다.</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button className="h-24 flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-red-200 dark:border-red-900/50 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-300 dark:hover:border-red-800 text-slate-600 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 transition-all group">
                      <Flame className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">불 (Fire)</span>
                    </button>
                    <button className="h-24 flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-800 text-slate-600 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all group">
                      <Droplet className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">물 (Water)</span>
                    </button>
                    <button className="h-24 flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950 hover:border-amber-300 dark:hover:border-amber-800 text-slate-600 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all group">
                      <Mountain className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">땅 (Earth)</span>
                    </button>
                    <button className="h-24 flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-teal-200 dark:border-teal-900/50 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950 hover:border-teal-300 dark:hover:border-teal-800 text-slate-600 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-all group">
                      <Wind className="w-6 h-6 text-teal-500 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">바람 (Wind)</span>
                    </button>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50 transition-colors">
                  <button
                    className="w-full h-11 flex items-center justify-center font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-70"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 생성 중...</> : '영문 판타지 이름 조합'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}