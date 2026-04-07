import React, { useState } from 'react';
import { Loader2, Heart, Share2, ArrowRight } from 'lucide-react';
import { DateTime } from "luxon";
import { createLuxonAdapter } from "@gracefullight/saju/adapters/luxon";
import { getSaju } from "@gracefullight/saju";
import { processNaming } from '@/utils/naming';

export default function Naming() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');

  // 1. 상태 관리: 기존 App.jsx의 구조와 UI 폼 구조를 병합
  const [formData, setFormData] = useState({
    lastNameHangul: '',
    lastNameHanja: '',
    birthDate: '1990-01-01',
    birthTime: '00:00', // Saju 계산을 위해 정확한 시간 사용
    gender: 'female',
  });

  // 결과 데이터를 담을 상태
  const [resultNames, setResultNames] = useState([]);
  const [totalHanjaCount, setTotalHanjaCount] = useState(0);

  // 2. 코어 로직 연동 (기존 App.jsx의 로직)
  const getOwnNaming = async (lastName, birthDate, gender, len = 2) => {
    const adapter = await createLuxonAdapter();
    const { yongShen: { primary, secondary } } = getSaju(birthDate, { adapter, gender });
    return processNaming(lastName, [primary.hanja, secondary.hanja], gender, len);
  };

  // 3. 실행 및 화면 전환 로직
  const handleStartAnalysis = async () => {
    setStep('loading'); // 즉시 로딩 화면으로 전환

    // 비동기 처리 중 UI가 멈추지 않도록 약간의 딜레이를 줌 (애니메이션 렌더링 확보)
    setTimeout(async () => {
      try {
        const [year, month, day] = formData.birthDate.split('-');
        const [hour, minute] = formData.birthTime.split(':');

        const birthDateTime = DateTime.fromObject(
          { year, month, day, hour, minute },
          { zone: "Asia/Seoul" }
        );

        const lastNameObj = { hanja: formData.lastNameHanja, hangul: formData.lastNameHangul };

        // 코어 로직 실행
        const finalResult = await getOwnNaming(lastNameObj, birthDateTime, formData.gender);

        setTotalHanjaCount(finalResult.length);

        // 결과 그룹핑 로직 (기존 App.jsx와 동일)
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
        nameList.sort((a, b) => a.hangul < b.hangul ? -1 : a.hangul > b.hangul ? 1 : 0);

        setResultNames(nameList);
        setStep('result'); // 연산 완료 후 결과 화면으로 전환

      } catch (error) {
        console.error("작명 분석 중 오류 발생:", error);
        alert("분석 중 오류가 발생했습니다. 입력 정보를 확인해 주세요.");
        setStep('input');
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-sans">

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

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">성씨 (한글)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900"
                  value={formData.lastNameHangul}
                  onChange={(e) => setFormData({ ...formData, lastNameHangul: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">성씨 (한자)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900"
                  value={formData.lastNameHanja}
                  onChange={(e) => setFormData({ ...formData, lastNameHanja: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">생년월일</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">태어난 시간</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 bg-white"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">성별</label>
              <div className="flex space-x-6 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-sm text-slate-700">남성</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-sm text-slate-700">여성</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <button
              className="w-full h-12 flex items-center justify-center text-lg font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors"
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
              <h3 className="text-lg font-medium text-slate-900">사주 오행을 분석 중입니다...</h3>
              <p className="text-sm text-slate-500">조합 가능한 모든 한자의 수를 계산하고 있습니다.</p>
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

          {/* 요약 정보 */}
          <div className="bg-slate-900 text-slate-50 rounded-2xl p-6 shadow-md flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-1">분석 완료</h2>
              <p className="text-sm text-slate-300">
                사주에 맞는 한글 이름 <span className="font-bold text-white">{resultNames.length}</span>개,
                조합 가능한 한자 이름 <span className="font-bold text-white">{totalHanjaCount}</span>개를 찾았습니다.
              </p>
            </div>
          </div>

          {/* 추천 이름 리스트 (그룹화된 데이터 매핑) */}
          <div className="grid grid-cols-1 gap-4">
            {resultNames.map((item, index) => (
              <div key={`hangul-${index}`} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <h3 className="text-2xl font-serif font-bold text-slate-900">
                    {item.hangul}
                  </h3>
                  <button className="text-slate-300 hover:text-red-500 transition-colors p-1">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>

                {/* 한자 조합 리스트 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {item.children.map((child, i) => (
                    <div key={`hanja-${i}`} className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                      <div className="text-xl font-serif text-slate-800 mb-1 tracking-widest">
                        {formData.lastNameHanja}{child.hanja}
                      </div>
                      <div className="text-xs text-slate-500">
                        획수: {child.strokes.join(' - ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-6 space-x-3">
            <button
              className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-md hover:bg-slate-50"
              onClick={() => setStep('input')}
            >
              다시 분석하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}