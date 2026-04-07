/* eslint-disable no-unused-vars */
import { hanja_givenname } from './assets/hanja_givenname.json';
import { male_name } from './assets/name_list_male.json';
import { female_name } from './assets/name_list_female.json';
import { bad_name } from './assets/name_bad_list.json';

const chosungArr = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const jungseongArr = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const jongseongArr = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const proWuXing = {
    木: ['ㄱ', 'ㅋ'],
    火: ['ㄴ', 'ㄷ', 'ㄹ', 'ㅌ'],
    土: ['ㅇ', 'ㅎ'],
    金: ['ㅅ', 'ㅈ', 'ㅊ'],
    水: ['ㅁ', 'ㅂ', 'ㅍ'],
};

const sangsaengMap = {
    '木': ['木', '火', '水'],
    '火': ['火', '土', '木'],
    '土': ['土', '金', '火'],
    '金': ['金', '水', '土'],
    '水': ['水', '木', '金']
};

const wordObj = {
    ㄱ: ['가', '각', '간', '갈', '감', '갑', '강', '개', '객', '갱', '갹', '거', '건', '걸', '검', '겁', '게', '격', '견', '결', '겸', '경', '계', '고', '곡', '곤', '골', '공', '곶', '과', '곽', '관', '괄', '광', '괘', '괴', '괵', '굉', '교', '구', '국', '군', '굴', '궁', '권', '궐', '궤', '귀', '규', '균', '귤', '극', '근', '글', '금', '급', '긍', '기', '긴', '길', '김'],
    ㄲ: ['끽'],
    ㄴ: ['나', '낙', '난', '날', '남', '납', '낭', '내', '녀', '녁', '년', '녈', '념', '녑', '녕', '노', '농', '놜', '뇌', '뇨', '누', '눈', '눌', '뉴', '뉵', '늘', '능', '니', '닉', '닐'],
    ㄷ: ['다', '단', '달', '담', '답', '당', '대', '댁', '덕', '도', '독', '돈', '돌', '동', '두', '둔', '둘', '득', '등'],
    ㄸ: [],
    ㄹ: ['라', '락', '란', '랄', '람', '랍', '랑', '래', '랭', '략', '량', '려', '력', '련', '렬', '렴', '렵', '령', '례', '로', '록', '론', '롱', '뢰', '료', '룡', '루', '류', '륙', '륜', '률', '륭', '륵', '름', '릉', '리', '린', '림', '립'],
    ㅁ: ['마', '막', '만', '말', '망', '매', '맥', '맹', '멱', '면', '멸', '명', '몌', '모', '목', '몰', '몽', '묘', '무', '묵', '문', '물', '미', '민', '밀'],
    ㅂ: ['박', '반', '발', '방', '배', '백', '번', '벌', '범', '법', '벽', '변', '별', '병', '보', '복', '본', '볼', '봉', '부', '북', '분', '불', '붕', '비', '빈', '빙'],
    ㅃ: [],
    ㅅ: ['사', '삭', '산', '살', '삼', '삽', '상', '새', '색', '생', '서', '석', '선', '설', '섬', '섭', '성', '세', '소', '속', '손', '솔', '송', '쇄', '쇠', '수', '숙', '순', '술', '숭', '쉬', '슬', '습', '승', '시', '식', '신', '실', '심', '십'],
    ㅆ: ['쌍', '씨'],
    ㅇ: ['아', '악', '안', '알', '암', '압', '앙', '애', '액', '앵', '야', '약', '양', '어', '억', '언', '얼', '엄', '업', '에', '엔', '여', '역', '연', '열', '염', '엽', '영', '예', '오', '옥', '온', '올', '옹', '와', '완', '왈', '왕', '왜', '외', '요', '욕', '용', '우', '욱', '운', '울', '웅', '원', '월', '위', '유', '육', '윤', '율', '융', '은', '을', '음', '읍', '응', '의', '이', '익', '인', '일', '임', '입', '잉'],
    ㅈ: ['자', '작', '잔', '잠', '잡', '장', '재', '쟁', '저', '적', '전', '절', '점', '접', '정', '제', '조', '족', '존', '졸', '종', '좌', '죄', '주', '죽', '준', '줄', '중', '즉', '즐', '즙', '증', '지', '직', '진', '질', '짐', '집', '징'],
    ㅉ: [],
    ㅊ: ['차', '착', '찬', '찰', '참', '창', '채', '책', '처', '척', '천', '철', '첨', '첩', '청', '체', '초', '촉', '촌', '총', '촬', '최', '추', '축', '춘', '출', '충', '췌', '취', '측', '층', '치', '칙', '친', '칠', '침', '칩', '칭'],
    ㅋ: ['쾌'],
    ㅌ: ['타', '탁', '탄', '탈', '탐', '탑', '탕', '태', '택', '탱', '터', '토', '톤', '통', '퇴', '투', '퉁', '특', '틈'],
    ㅍ: ['파', '판', '팔', '패', '팽', '퍅', '편', '폄', '평', '폐', '포', '폭', '표', '품', '풍', '피', '픽', '필', '핍'],
    ㅎ: ['하', '학', '한', '할', '함', '합', '항', '해', '핵', '행', '향', '허', '헌', '헐', '험', '혁', '현', '혈', '혐', '협', '형', '혜', '호', '혹', '혼', '홀', '홍', '화', '확', '환', '활', '황', '회', '획', '횡', '효', '후', '훈', '훌', '훙', '훤', '훼', '휘', '휴', '휵', '휼', '흉', '흑', '흔', '흘', '흠', '흡', '흥', '희', '히', '힐']
};

const forbiddenHanja = new Set(['愛', '終', '美', '龍', '冬', '地', '石']);

const getChosung = (str) => {
    const code = str.codePointAt(0) - 44032;

    const chosung = Math.floor(code / (21 * 28));
    // const jungseong = Math.floor((code % (21 * 28)) / 28);
    // const jongseong = (code % (21 * 28)) % 28;

    return chosungArr[chosung];
};

const getProWuXing = (char) => {
    for (const [key, value] of Object.entries(proWuXing)) {
        if (value.includes(char)) {
            return key;
        }
    }
};

function getRecursiveProducts(matrix) {
    // 베이스 케이스 1: 행렬이 비어있는 경우
    if (matrix.length === 0) return [];

    // 베이스 케이스 2: 마지막 행인 경우, 해당 행의 요소들을 그대로 반환 (곱셈의 시작점)
    if (matrix.length === 1) return matrix[0];

    const firstRow = matrix[0];
    const restOfMatrix = matrix.slice(1);

    // 나머지 행들에 대해 먼저 재귀적으로 곱셈 결과를 가져옴
    const combinedRest = getRecursiveProducts(restOfMatrix);

    /**
     * 한 요소와 배열의 모든 요소를 곱하는 내부 재귀 함수
     */
    function multiplyElementWithArray(val, arr) {
        if (arr.length === 0) return [];
        const [head, ...tail] = arr;
        return [val + head, ...multiplyElementWithArray(val, tail)];
    }

    /**
     * 두 배열의 모든 조합을 곱해 합치는 내부 재귀 함수 (Cartesian Product)
     */
    function combine(arr1, arr2) {
        if (arr1.length === 0) return [];
        const [head, ...tail] = arr1;

        // 현재 요소(head)와 arr2의 모든 곱 + 나머지 요소들과 arr2의 곱
        return [...multiplyElementWithArray(head, arr2), ...combine(tail, arr2)];
    }

    return combine(firstRow, combinedRest);
};

/**
 * 모든 상생 경로를 찾는 재귀 함수
 * @param {string} currentElement 현재 오행
 * @param {number} targetLen 목표 이름 길이 (성 제외)
 * @returns {string[][]} 가능한 모든 오행 조합 배열
 */
const getValidElementPaths = (currentElement, targetLen) => {
    let results = [];

    const dfs = (path, depth) => {
        if (depth === targetLen) {
            results.push([...path]);
            return;
        }

        const lastElement = path[path.length - 1];
        const nextCandidates = sangsaengMap[lastElement];

        for (const next of nextCandidates) {
            path.push(next);
            dfs(path, depth + 1);
            path.pop(); // 백트래킹
        }
    };

    dfs([currentElement], 0);
    // 첫 번째 요소는 성씨이므로 제거하고 이름 부분만 반환
    return results.map(p => p.slice(1));
};

/**
   * 부족 오행을 기반으로 한자 Map 동적 생성
   * @param {string[]} favorableElements - 보충할 오행 리스트
   * @returns {Map} 필터링된 한자 맵
   */
const createDynamicWuXingMap = (favorableElements) => {
    const favorableSet = new Set(favorableElements);

    return hanja_givenname
        .filter(hanja => favorableSet.has(hanja.resource_five_elements))
        .reduce((map, hanja) => {
            if (!map.has(hanja.naming_sound)) map.set(hanja.naming_sound, []);
            map.get(hanja.naming_sound).push(hanja);
            return map;
        }, new Map());
};

/**
 * 조합 생성을 위한 Generator (메모리 최적화)
 */
function* cartesianProductGenerator(arrays) {
    function* recursive(index, current) {
        if (index === arrays.length) {
            yield current;
            return;
        }
        for (const item of arrays[index]) {
            yield* recursive(index + 1, [...current, item]);
        }
    }
    yield* recursive(0, []);
};

/**
 * 음양 조화 체크 함수
 * @param {number[]} strokes 성씨와 이름을 포함한 획수 배열
 * @returns {boolean} 조화가 맞으면 true
 */
const checkYinYang = (strokes) => {
    const counts = strokes.map(s => s % 2 === 0 ? '음' : '양');
    const uniqueTypes = new Set(counts);
    // 모든 획수가 음이거나 양인 경우 false 반환
    return uniqueTypes.size > 1;
};

const get_phonetic_matches = (firstName, len = 2) => {
    const startPronounce = getProWuXing(getChosung(firstName));

    // 1. 성씨 오행으로부터 가능한 모든 상생 오행 경로 추출
    // 예: '이'(水) -> [['木', '火'], ['木', '木'], ['金', '水'], ...]
    const validPaths = getValidElementPaths(startPronounce, len);

    let allNames = [];

    // 2. 각 경로별로 해당하는 한글 조합 생성
    for (const path of validPaths) {
        const syllableCandidates = path.map(element => {
            const choList = proWuXing[element] || [];
            return choList.flatMap(cho => wordObj[cho] || []);
        });

        // 데카르트 곱으로 한글 이름 조합 생성
        const pathNames = getRecursiveProducts(syllableCandidates);
        allNames = allNames.concat(pathNames);
    }

    // 3. 중복 제거 및 반환
    return [...new Set(allNames)];
};

const processNaming = (lastName, favorable, gender, len = 2) => {
    const lastNameObj = hanja_givenname.find(hanja =>
        lastName.hanja === hanja.hanja_char
        && lastName.hangul === hanja.naming_sound
    );

    if (!lastNameObj) return;

    // 해당 오행의 한자들로만 Map 구성 (동적 필터링)
    const wuXingMap = createDynamicWuXingMap(favorable);

    const valid_hangul_names = get_phonetic_matches(lastNameObj.naming_sound, len);
    const suri81 = new Set([7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 31, 32, 33, 35, 37, 38, 39]);
    const goodNames = [];

    const nameList = gender === 'male' ? male_name : female_name;
    const nameSet = new Set(nameList.map(name => name.name));

    const exactBadNames = new Set();
    // 2. 와일드카드 패턴을 위한 정규표현식 리스트
    const badPatterns = [];

    bad_name.forEach(item => {
        if (item.includes('*')) {
            // '*'를 정규표현식의 '.*'로 변환하고, 시작(^)과 끝($) 앵커 처리
            let pattern = item
                .replace(/\*/g, '.*')       // '*' -> '.*' (모든 문자열)
                .replace(/([+?^${}()|[\]/\\])/g, '\\$1'); // 특수문자 이스케이프

            // 패턴 형태에 따라 시작/끝 고정 여부 결정
            if (!item.startsWith('*')) pattern = '^' + pattern;
            if (!item.endsWith('*')) pattern = pattern + '$';

            badPatterns.push(new RegExp(pattern));
        } else {
            exactBadNames.add(item);
        }
    });

    // 모든 패턴을 하나로 통합 (성능 최적화: Or 연산)
    const combinedBadRegex = new RegExp(badPatterns.map(p => p.source).join('|'));

    for (const hangulName of valid_hangul_names) {
        // 이름을 사용하는 사람이 없으면 패스
        if (!nameSet.has(hangulName)) continue;

        // 어감이 나쁜 이름이 있으면 패스
        const fullName = lastNameObj.naming_sound + hangulName;
        if (exactBadNames.has(fullName)) continue;
        if (combinedBadRegex.test(fullName)) continue;

        const syllablesHanja = Array.from(hangulName).map(char => wuXingMap.get(char));

        // 해당 음절의 오행 한자가 하나라도 없으면 패스
        if (syllablesHanja.some(list => !list || list.length === 0)) continue;

        // Generator를 사용하여 메모리 효율적 탐색
        for (const combo of cartesianProductGenerator(syllablesHanja)) {
            // 1. 불용 한자 필터링
            if (combo.some(h => forbiddenHanja.has(h.hanja_char))) continue;

            const c1 = lastNameObj.original_stroke_count;
            const strokes = combo.map(h => h.original_stroke_count);

            // 2. 음양 조화 필터링
            if (!checkYinYang([c1, ...strokes])) continue;

            // 3. 81 수리 계산
            const sumGivenStrokes = strokes.reduce((a, b) => a + b, 0);

            /**
             * 수리성명학 4격 (n자 이름 대응)
             * 원격(元): 이름 전체 합
             * 형격(亨): 성 + 이름 첫글자
             * 이격(利): 성 + 이름 마지막글자
             * 정격(貞): 성 + 이름 전체 합
             */
            const won = sumGivenStrokes;
            const hyung = c1 + strokes[0];
            const lee = c1 + strokes[strokes.length - 1];
            const jung = c1 + sumGivenStrokes;

            if (suri81.has(won) && suri81.has(hyung) && suri81.has(lee) && suri81.has(jung)) {
                goodNames.push({
                    hangul: lastNameObj.naming_sound + hangulName,
                    hanja: combo.map(h => h.hanja_char).join(''),
                    strokes: [c1, ...strokes],
                    suri: { won, hyung, lee, jung }
                });
            }
        }
    }
    return goodNames;
};

export { processNaming };