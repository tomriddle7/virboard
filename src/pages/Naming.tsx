import React, { useState, useEffect } from 'react';
import { Loader2, Heart, Share2, ArrowRight } from 'lucide-react';

export default function NamingService() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [loadingText, setLoadingText] = useState('사주 오행을 분석 중입니다...');

  // 기본 테스트 폼 데이터
  const [formData, setFormData] = useState({
    currentName: '',
    birthDate: '1990-01-01',
    birthTime: '자시(23~01시)',
    gender: 'female',
  });

  // 로딩 텍스트 애니메이션 및 화면 전환
  useEffect(() => {
    if (step === 'loading') {
      const texts = [
        '사주 오행을 분석 중입니다...',
        '부족한 기운을 채워줄 한자를 찾는 중입니다...',
        '가장 조화로운 이름을 조합하고 있습니다...'
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 1500);

      // 4.5초 후 결과 화면으로 이동
      const timer = setTimeout(() => setStep('result'), 4500);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [step]);

  const handleStartAnalysis = () => {
    setStep('loading');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans">

      {/* 헤더 영역 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">새로운 시작을 위한 이름</h1>
        <p className="text-slate-500">사주 명리학 기반 맞춤 개명 추천 서비스</p>
      </div>

      {/* 1. 입력 폼 화면 */}
      {step === 'input' && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-900">기본 정보 입력</h2>
            <p className="text-sm text-slate-500 mt-1">정확한 분석을 위해 태어난 시간을 꼭 확인해 주세요.</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="currentName" className="block text-sm font-medium text-slate-700">현재 이름</label>
              <input
                id="currentName"
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                value={formData.currentName}
                onChange={(e) => setFormData({ ...formData, currentName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="birthDate" className="block text-sm font-medium text-slate-700">생년월일</label>
              <input
                id="birthDate"
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="birthTime" className="block text-sm font-medium text-slate-700">태어난 시간</label>
              <select
                id="birthTime"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors bg-white"
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
              >
                <option value="자시(23~01시)">자시 (23시~01시)</option>
                <option value="축시(01~03시)">축시 (01시~03시)</option>
                <option value="인시(03~05시)">인시 (03시~05시)</option>
                <option value="묘시(05~07시)">묘시 (05시~07시)</option>
                <option value="모름">시간 모름</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">성별</label>
              <div className="flex space-x-6 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 text-slate-900 focus:ring-slate-900 border-slate-300"
                  />
                  <span className="text-sm text-slate-700">남성</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 text-slate-900 focus:ring-slate-900 border-slate-300"
                  />
                  <span className="text-sm text-slate-700">여성</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <button
              className="w-full h-12 flex items-center justify-center text-lg font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              onClick={handleStartAnalysis}
            >
              내게 맞는 이름 찾기 <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. 로딩 화면 */}
      {step === 'loading' && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 py-16 px-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <Loader2 className="h-12 w-12 animate-spin text-slate-900" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-900">{loadingText}</h3>
              <p className="text-sm text-slate-500">입력하신 정보를 바탕으로 정통 명리학 로직을 돌리고 있습니다.</p>
            </div>

            <div className="w-full space-y-3 mt-8">
              <div className="h-20 w-full bg-slate-100 animate-pulse rounded-xl"></div>
              <div className="h-20 w-full bg-slate-100 animate-pulse rounded-xl"></div>
            </div>
          </div>
        </div>
      )}

      {/* 3. 결과 화면 */}
      {step === 'result' && (
        <div className="w-full max-w-3xl space-y-6 animate-[fadeIn_0.7s_ease-out]">

          {/* 사주 요약 정보 */}
          <div className="bg-slate-900 text-slate-50 rounded-2xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-1">사주 오행 분석 결과</h2>
            <p className="text-sm text-slate-300 mb-4">
              갑신(甲申) 일주와 갑자(甲子) 시주의 기운을 바탕으로 분석했습니다.
            </p>
            <p className="text-slate-200 leading-relaxed bg-slate-800/50 p-4 rounded-lg">
              현재 화(火)와 토(土)의 기운이 다소 부족하여, 이를 보완하고
              전체적인 오행의 조화를 이룰 수 있는 맑고 단단한 한자들을 선별했습니다.
            </p>
          </div>

          {/* 추천 이름 리스트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: '도윤', hanja: '道潤', tags: ['#안정감', '#재물운', '#화(火) 보완'], desc: '이끌 도, 윤택할 윤. 바른 길로 이끌어 삶을 윤택하게 한다는 의미입니다.' },
              { name: '서준', hanja: '瑞俊', tags: ['#명예운', '#지혜', '#토(土) 보완'], desc: '상서로울 서, 뛰어날 준. 상서로운 기운을 가진 뛰어난 인재라는 뜻을 담고 있습니다.' },
              { name: '이안', hanja: '利安', tags: ['#건강운', '#부드러움'], desc: '이로울 리, 편안할 안. 평생토록 이롭고 편안한 삶을 누리라는 축복의 이름입니다.' },
              { name: '건우', hanja: '建宇', tags: ['#리더십', '#대기만성'], desc: '세울 건, 집 우. 큰 뜻을 세우고 넓은 세상을 품으라는 웅장한 기운의 이름입니다.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">
                      {item.name} <span className="text-lg text-slate-400 ml-1 font-sans font-normal">{item.hanja}</span>
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-red-500 transition-colors p-1">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mt-2 pt-3 border-t border-slate-50">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-6 space-x-3">
            <button
              className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-50 transition-colors"
              onClick={() => setStep('input')}
            >
              다시 분석하기
            </button>
            <button className="px-6 py-2.5 flex items-center bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition-colors">
              <Share2 className="mr-2 h-4 w-4" /> 결과 공유하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}