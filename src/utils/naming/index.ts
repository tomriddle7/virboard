export interface KanjiData {
  pronunciation_five_elements?: string;
  resource_five_elements?: string;
  original_stroke_count?: number;
  dictionary_stroke_count?: number;
}

let cachedKanjiDict: Record<string, KanjiData> | null = null;

// --- 1. 상수 데이터 (Constants) ---

export const elementLabels = {
  wood: '목(木) - 성장의 기운 (학생, 청춘, 요정, 숲)',
  fire: '화(火) - 확산의 기운 (악마, 드래곤, 빛)',
  earth: '토(土) - 중재의 기운 (평범한 인간, 일상, 대지)',
  metal: '금(金) - 결실의 기운 (사이보그, 기사, 기계)',
  water: '수(水) - 지혜의 기운 (해양, 심해, 얼음)'
};

export const elementStory = {
  wood: '맑고 풋풋한 나무(木)',
  fire: '폭발적인 대중의 관심(火)',
  earth: '단단하고 안정적인 대지(土)',
  metal: '예리하고 빛나는 보석(金)',
  water: '깊고 유연한 물(水)'
};

export const mbtiStory = {
  INTJ: "통찰력 있고 전략적인 INTJ의 기질을 조화시켜",
  INTP: "독창적이고 분석적인 INTP의 성향을 살려",
  ENTJ: "카리스마 넘치고 주도적인 ENTJ의 매력을 더해",
  ENTP: "재치 있고 창의적인 ENTP의 에너지를 담아",
  INFJ: "신비롭고 깊이 있는 INFJ의 분위기를 녹여내어",
  INFP: "감수성이 풍부하고 따뜻한 INFP의 감성을 더해",
  ENFJ: "다정하고 사람을 이끄는 ENFJ의 매력을 살려",
  ENFP: "자유롭고 열정적인 ENFP의 에너지를 듬뿍 담아",
  ISTJ: "차분하고 신뢰감 주는 ISTJ의 매력을 더해",
  ISFJ: "섬세하고 배려심 깊은 ISFJ의 따뜻함을 살려",
  ESTJ: "명확하고 리더십 있는 ESTJ의 기운을 담아",
  ESFJ: "사교적이고 친근한 ESFJ의 에너지를 조화시켜",
  ISTP: "쿨하고 다재다능한 ISTP의 매력을 녹여내어",
  ISFP: "온화하고 예술적인 ISFP의 감성을 더해",
  ESTP: "활동적이고 매력적인 ESTP의 에너지를 살려",
  ESFP: "밝고 긍정적인 에너지가 넘치는 ESFP의 기운을 담아"
};

export const mbtiWeights = {
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

export const luckyNumbers = [11, 13, 15, 16, 21, 23, 24, 25, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 63, 65, 67, 68, 81];

export const luckyStrokes = [
  { num: 21, name: "두령격(頭領格)", desc: "탁월한 리더십과 매력으로 거대한 팬덤을 이끌고 굳건히 자리 잡는 대길수입니다." },
  { num: 23, name: "융창격(隆昌格)", desc: "아침 해가 솟아오르듯 인기가 급상승하며, 큰 권위와 명성을 얻는 길수입니다." },
  { num: 24, name: "입신격(立身格)", desc: "무에서 유를 창조하는 기운으로, 초반의 어려움을 딛고 막대한 재물과 인기를 거머쥡니다." },
  { num: 31, name: "대성격(大成格)", desc: "의지가 굳건하고 뜻을 이루어, 장기적으로 흔들림 없이 이름을 널리 알리는 완벽한 길수입니다." },
  { num: 32, name: "순풍격(順風格)", desc: "순조롭게 기회를 만나 뜻을 이루며, 합방이나 콜라보 등에서 귀인의 도움을 받아 대성합니다." }
];


// --- 2. 공통 헬퍼 함수 (Helpers) ---

// 배열 셔플 유틸리티
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 한자 오행을 영어 키로 변환
export const mapSajuElement = (hanja: string): string => {
  const map: Record<string, string> = {
    '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water'
  };
  return map[hanja] || 'water';
};

// 상생(相生) 관계 판별기
export const isGenerating = (needed: string, provided: string): boolean => {
  const generatingMap: Record<string, string> = {
    'wood': 'water',  
    'fire': 'wood',   
    'earth': 'fire',  
    'metal': 'earth', 
    'water': 'metal'  
  };
  return generatingMap[needed] === provided;
};

/**
 * 입력된 문자열의 언어를 감지하는 헬퍼 함수
 * @param text 감정할 이름 텍스트
 * @returns 'korean' | 'english' | 'japanese' | 'mixed' | 'empty'
 */
export const detectLanguage = (
  text: string
): 'korean' | 'english' | 'japanese' | 'mixed' | 'empty' => {
  const sanitized = text.trim();
  
  if (!sanitized) return 'empty';

  // 1. 순수 한글 (자음/모음 단독 제외, 완성형 글자와 띄어쓰기만 허용)
  const koreanRegex = /^[가-힣\s]+$/;
  
  // 2. 순수 영문 (알파벳 대소문자와 띄어쓰기만 허용)
  const englishRegex = /^[a-zA-Z\s]+$/;
  
  // 3. 순수 일본어 (히라가나, 가타카나, 한자, 반복 기호(々) 및 띄어쓰기 허용)
  const japaneseRegex = /^[ぁ-んァ-ヶ一-龥々〆・\s]+$/;

  if (koreanRegex.test(sanitized)) return 'korean';
  if (englishRegex.test(sanitized)) return 'english';
  if (japaneseRegex.test(sanitized)) return 'japanese';

  // 단일 언어 정규식을 하나도 통과하지 못하면 '혼합(mixed)' 또는 기호 포함으로 간주
  return 'mixed';
};

// 영어 알파벳 획수 사전 (대문자 기준 표준 획수)
const englishStrokeMap: Record<string, number> = {
  A: 3, B: 2, C: 1, D: 2, E: 4, F: 3, G: 2, H: 3, I: 1,
  J: 2, K: 3, L: 2, M: 4, N: 3, O: 1, P: 2, Q: 2, R: 3,
  S: 1, T: 2, U: 1, V: 2, W: 4, X: 2, Y: 3, Z: 3
};

const getEnglishStrokeCount = (name: string): number => {
  let strokes = 0;
  const upperName = name.toUpperCase().replace(/\s/g, ''); // 공백 제거 및 대문자 변환
  for (const char of upperName) {
    strokes += englishStrokeMap[char] || 0;
  }
  return strokes;
};

// 한글 자음/모음 획수 사전
const CHOSEONG_STROKES = [2, 4, 1, 2, 4, 3, 3, 4, 8, 2, 4, 1, 3, 6, 4, 3, 3, 4, 3]; // ㄱ, ㄲ, ㄴ, ㄷ...
const JUNGSEONG_STROKES = [2, 3, 3, 4, 2, 3, 3, 4, 2, 4, 5, 3, 3, 2, 4, 5, 3, 3, 1, 2, 1]; // ㅏ, ㅐ, ㅑ...
const JONGSEONG_STROKES = [0, 2, 4, 3, 1, 3, 4, 4, 5, 4, 6, 7, 5, 6, 7, 3, 4, 4, 2, 4, 1, 3, 4, 3, 4, 4, 3, 3]; // (없음), ㄱ, ㄲ, ㄳ...

const getKoreanStrokeCount = (name: string): number => {
  let strokes = 0;
  const sanitizedName = name.replace(/\s/g, '');

  for (let i = 0; i < sanitizedName.length; i++) {
    const charCode = sanitizedName.charCodeAt(i);
    // 한글 유니코드 범위 (가 ~ 힣)
    if (charCode >= 0xAC00 && charCode <= 0xD7A3) {
      const offset = charCode - 0xAC00;
      const jongseongIndex = offset % 28;
      const jungseongIndex = Math.floor((offset % 588) / 28);
      const choseongIndex = Math.floor(offset / 588);

      strokes += CHOSEONG_STROKES[choseongIndex] + JUNGSEONG_STROKES[jungseongIndex] + JONGSEONG_STROKES[jongseongIndex];
    }
  }
  return strokes;
};

// 가나 획수 사전
const kanaStrokeMap: Record<string, number> = {
  // === 히라가나 (Hiragana) ===
  'あ': 3, 'い': 2, 'う': 2, 'え': 2, 'お': 3,
  'ぁ': 3, 'ぃ': 2, 'ぅ': 2, 'ぇ': 2, 'ぉ': 3,
  'か': 3, 'き': 4, 'く': 1, 'け': 3, 'こ': 2,
  'が': 5, 'ぎ': 6, 'ぐ': 3, 'げ': 5, 'ご': 4,
  'さ': 3, 'し': 1, 'す': 2, 'せ': 3, 'そ': 1,
  'ざ': 5, 'じ': 3, 'ず': 4, 'ぜ': 5, 'ぞ': 3,
  'た': 4, 'ち': 2, 'つ': 1, 'て': 1, 'と': 2,
  'だ': 6, 'ぢ': 4, 'づ': 3, 'で': 3, 'ど': 4,
  'っ': 1,
  'な': 5, 'に': 3, 'ぬ': 2, 'ね': 4, 'の': 1,
  'は': 3, 'ひ': 1, 'ふ': 4, 'へ': 1, 'ほ': 4,
  'ば': 5, 'び': 3, 'ぶ': 6, 'べ': 3, 'ぼ': 6,
  'ぱ': 5, 'ぴ': 3, 'ぷ': 6, 'ぺ': 3, 'ぽ': 6,
  'ま': 3, 'み': 2, 'む': 3, 'め': 2, 'も': 3,
  'や': 3, 'ゆ': 2, 'よ': 2,
  'ゃ': 3, 'ゅ': 2, 'ょ': 2,
  'ら': 2, 'り': 2, 'る': 1, 'れ': 2, 'ろ': 1,
  'わ': 2, 'ゐ': 3, 'ゑ': 3, 'を': 3, 'ん': 1,
  // === 가타카나 (Katakana) ===
  'ア': 2, 'イ': 2, 'ウ': 3, 'エ': 3, 'オ': 3,
  'ァ': 2, 'ィ': 2, 'ゥ': 3, 'ェ': 3, 'ォ': 3,
  'カ': 2, 'キ': 3, 'ク': 2, 'ケ': 3, 'コ': 2,
  'ガ': 4, 'ギ': 5, 'グ': 4, 'ゲ': 5, 'ゴ': 4,
  'サ': 3, 'シ': 3, 'ス': 2, 'セ': 2, 'ソ': 2,
  'ザ': 5, 'ジ': 5, 'ズ': 4, 'ゼ': 4, 'ゾ': 4,
  'タ': 3, 'チ': 3, 'ツ': 3, 'テ': 3, 'ト': 2,
  'ダ': 5, 'ヂ': 5, 'ヅ': 5, 'デ': 5, 'ド': 4,
  'ッ': 3,
  'ナ': 2, 'ニ': 2, 'ヌ': 2, 'ネ': 4, 'ノ': 1,
  'ハ': 2, 'ヒ': 2, 'フ': 1, 'ヘ': 1, 'ホ': 4,
  'バ': 4, 'ビ': 4, 'ブ': 3, 'ベ': 3, 'ボ': 6,
  'パ': 4, 'ピ': 4, 'プ': 3, 'ペ': 3, 'ポ': 6,
  'マ': 2, 'ミ': 3, 'ム': 2, 'メ': 2, 'モ': 3,
  'ヤ': 2, 'ユ': 2, 'ヨ': 3,
  'ャ': 2, 'ュ': 2, 'ョ': 3,
  'ラ': 2, 'リ': 2, 'ル': 2, 'レ': 1, 'ロ': 3,
  'ワ': 2, 'ヰ': 4, 'ヱ': 3, 'ヲ': 3, 'ン': 2,
  // === 특수 기호 ===
  'ー': 1,
  '々': 3
};

// 프로덕션용 비동기 일본어 획수 계산 함수
export const getJapaneseStrokeCount = async (name: string): Promise<{ strokes: number, missingChars: string[] }> => {
  let strokes = 0;
  const missingChars: string[] = [];
  const sanitizedName = name.replace(/\s/g, '');

  // 💡 1. 캐싱된 딕셔너리가 없다면 최초 1회만 Fetch 및 변환 작업을 수행합니다.
  if (!cachedKanjiDict) {
    const response = await fetch('/db/kanji_strokes.json');
    cachedKanjiDict = await response.json();
  }

  for (const char of sanitizedName) {
    if (kanaStrokeMap[char]) {
      strokes += kanaStrokeMap[char];
    } else if (cachedKanjiDict![char]) {
      strokes += cachedKanjiDict![char].original_stroke_count!;
    } else if (/[\u4e00-\u9faf]/.test(char)) {
      strokes += 7; // DB에 없는 한자는 임시로 7획 부여
      missingChars.push(char);
    } else {
      strokes += 1; // 특수기호나 알파벳 등
    }
  }

  return { strokes, missingChars };
};

// 프론트엔드용 결정적(Deterministic) 획수 계산기
export const getStrokeCount = async (
  name: string, 
  language: string
): Promise<{ strokes: number, missingChars: string[] }> => {
  
  let strokes = 0;
  let missingChars: string[] = [];

  switch (language) {
    case 'korean':
      strokes = getKoreanStrokeCount(name);
      break;
    case 'english':
      strokes = getEnglishStrokeCount(name);
      break;
    case 'japanese':
      // 💡 일본어일 경우 객체를 통째로 받아와서 각각 분해해줍니다.
      { const jpResult = await getJapaneseStrokeCount(name);
      strokes = jpResult.strokes;
      missingChars = jpResult.missingChars;
      break; }
    default:
      strokes = 10; // mixed나 empty일 경우의 Fallback
  }

  // 81수리는 81을 초과하면 다시 1부터 순환하는 성명학 원칙 적용
  const finalStrokes = strokes > 81 ? (strokes % 80) + 1 : strokes;

  // 💡 최종적으로 획수와 누락된 한자 배열을 모두 담은 객체를 반환합니다.
  return { 
    strokes: finalStrokes, 
    missingChars 
  };
};