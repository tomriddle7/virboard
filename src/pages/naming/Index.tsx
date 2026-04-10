import React, { useState } from 'react';
import { Sparkles, Globe, Swords, Loader2, Heart, Share2, Info } from 'lucide-react';
import { DateTime } from "luxon";
import { createLuxonAdapter } from "@gracefullight/saju/adapters/luxon";
import { getSaju } from "@gracefullight/saju";

// --- 1. 퍼스트 네임 데이터 (영어식) ---
const vtuberNames = {
  wood: [
    { name: "Arancium", kr: "아란치움", meaning: "오렌지", gender: "neutral" },
    { name: "Arbor", kr: "아르보르", meaning: "나무", gender: "neutral" },
    { name: "Floris", kr: "플로리스", meaning: "꽃", gender: "neutral" },
    { name: "Herba", kr: "헤르바", meaning: "풀, 약초", gender: "female" },
    { name: "Laura", kr: "라우라", meaning: "월계수", gender: "female" },
    { name: "Lilium", kr: "릴리움", meaning: "백합", gender: "neutral" },
    { name: "Mariposa", kr: "마리포사", meaning: "나비", gender: "female" },
    { name: "Natura", kr: "나투라", meaning: "자연", gender: "female" },
    { name: "Phyllis", kr: "필리스", meaning: "잎이 무성한 가지", gender: "female" },
    { name: "Rana", kr: "라나", meaning: "개구리", gender: "female" },
    { name: "Rosa", kr: "로사", meaning: "장미", gender: "female" },
    { name: "Trifolium", kr: "트리폴리움", meaning: "클로버", gender: "neutral" },
    { name: "Tigris", kr: "티그리스", meaning: "호랑이", gender: "male" },
    { name: "Calantha", kr: "칼란타", meaning: "꽃 이름 (아름다움)", gender: "female" },
    { name: "Briar", kr: "브라이어", meaning: "가시나무", gender: "neutral" },
    { name: "Daphne", kr: "다프네", meaning: "아폴로의 연인 (월계수)", gender: "female" },
    { name: "Rowan", kr: "로완", meaning: "마법의 나무", gender: "neutral" },
    { name: "Sawyer", kr: "소이어", meaning: "나무를 베는 사람", gender: "male" },
    { name: "Willow", kr: "윌로우", meaning: "버드나무", gender: "female" },
    { name: "Flora", kr: "플로라", meaning: "꽃/식물군", gender: "female" },
    { name: "Ivy", kr: "아이비", meaning: "담쟁이덩굴", gender: "female" },
    { name: "Rose", kr: "로즈", meaning: "장미", gender: "female" },
    { name: "Silvestra", kr: "실베스트라", meaning: "숲의, 야생의", gender: "female" },
    { name: "Leo", kr: "레오", meaning: "사자", gender: "male" }
  ],
  fire: [
    { name: "Angelus", kr: "안겔루스", meaning: "천사", gender: "male" },
    { name: "Aileen", kr: "에일린", meaning: "빛", gender: "female" },
    { name: "Amor", kr: "아모르", meaning: "사랑", gender: "male" },
    { name: "Aestas", kr: "아이스타스", meaning: "여름", gender: "female" },
    { name: "Aura", kr: "아우라", meaning: "공기, 미풍", gender: "female" },
    { name: "Bellum", kr: "벨리움", meaning: "전쟁", gender: "neutral" },
    { name: "Bellatrix", kr: "벨라트릭스", meaning: "여전사", gender: "female" },
    { name: "Carmen", kr: "카르맨", meaning: "노래, 시", gender: "female" },
    { name: "Corona", kr: "코로나", meaning: "왕관", gender: "female" },
    { name: "Diabolus", kr: "디아볼로스", meaning: "악마", gender: "male" },
    { name: "Daemon", kr: "데몬", meaning: "악마", gender: "male" },
    { name: "Emotio", kr: "에모티오", meaning: "감정, 감동", gender: "neutral" },
    { name: "Gaudium", kr: "가우디움", meaning: "기쁨, 환희", gender: "neutral" },
    { name: "Gloria", kr: "글로리아", meaning: "명예, 영광", gender: "female" },
    { name: "Ignis", kr: "이그니스", meaning: "불", gender: "male" },
    { name: "Lampas", kr: "람파스", meaning: "등불, 등잔", gender: "female" },
    { name: "Lumen", kr: "루멘", meaning: "빛", gender: "neutral" },
    { name: "Lucifer", kr: "루치페르", meaning: "샛별", gender: "male" },
    { name: "Nova", kr: "노바", meaning: "새로운 별", gender: "female" },
    { name: "Risus", kr: "리수스", meaning: "웃음", gender: "male" },
    { name: "Ridere", kr: "리데레", meaning: "미소", gender: "neutral" },
    { name: "Ruber", kr: "루베르", meaning: "붉은, 빨간", gender: "neutral" },
    { name: "Sol", kr: "솔", meaning: "해", gender: "male" },
    { name: "Stella", kr: "스텔라", meaning: "별", gender: "female" },
    { name: "Victoria", kr: "빅토리아", meaning: "승리", gender: "female" },
    { name: "Aurora", kr: "아우로라", meaning: "여신의 이름, 북극광", gender: "female" },
    { name: "Ember", kr: "엠버", meaning: "불꽃", gender: "neutral" },
    { name: "Icarus", kr: "이카루스", meaning: "날개를 단 인간", gender: "male" },
    { name: "Lucian", kr: "루시안", meaning: "빛의 신", gender: "male" },
    { name: "Orion", kr: "오리온", meaning: "사냥꾼", gender: "male" },
    { name: "Phoenix", kr: "피닉스", meaning: "불사조", gender: "neutral" },
    { name: "Sirius", kr: "시리우스", meaning: "별자리의 이름", gender: "male" },
    { name: "Vega", kr: "베가", meaning: "밝은 별", gender: "female" },
    { name: "Zephyr", kr: "제퍼", meaning: "서풍", gender: "male" },
    { name: "Seraphina", kr: "세라핀나", meaning: "천사(세라핌)", gender: "female" },
    { name: "Athena", kr: "아테나", meaning: "지혜와 전략의 여신", gender: "female" },
    { name: "Aria", kr: "아리아", meaning: "노래", gender: "female" },
    { name: "Eros", kr: "에로스", meaning: "사랑의 신", gender: "male" }
  ],
  earth: [
    { name: "Aeternum", kr: "아이테르눔", meaning: "영원", gender: "neutral" },
    { name: "Amicitia", kr: "아미키티아", meaning: "우정", gender: "female" },
    { name: "Accredere", kr: "아크레데레", meaning: "신용", gender: "neutral" },
    { name: "Bonita", kr: "보니따", meaning: "아름다운", gender: "female" },
    { name: "Beatrice", kr: "비아트리스", meaning: "축복받은", gender: "female" },
    { name: "Basilica", kr: "바실리카", meaning: "대성당", gender: "female" },
    { name: "Bella", kr: "벨라", meaning: "예쁜, 멋진", gender: "female" },
    { name: "Cordelia", kr: "코델리아", meaning: "바다의 보석", gender: "female" },
    { name: "Creator", kr: "크레아토르", meaning: "창조주", gender: "male" },
    { name: "Capitalis", kr: "카피탈리스", meaning: "으뜸가는", gender: "male" },
    { name: "Cara", kr: "카라", meaning: "귀여운, 소중한", gender: "female" },
    { name: "Dorothy", kr: "도로시", meaning: "신이 내린 선물", gender: "female" },
    { name: "Dea", kr: "데아", meaning: "여신", gender: "female" },
    { name: "Equus", kr: "에쿠스", meaning: "말", gender: "male" },
    { name: "Essentia", kr: "엣센티아", meaning: "정수, 본성", gender: "female" },
    { name: "Fortuna", kr: "포르투나", meaning: "행운, 운명", gender: "female" },
    { name: "Familia", kr: "파밀리아", meaning: "가족, 가문", gender: "female" },
    { name: "Felix", kr: "펠릭스", meaning: "행복한, 복 있는", gender: "male" },
    { name: "Gratia", kr: "그라티아", meaning: "은혜, 은총", gender: "female" },
    { name: "Lactea", kr: "락테아", meaning: "은하수", gender: "female" },
    { name: "Lapis", kr: "라피스", meaning: "돌", gender: "male" },
    { name: "Margarita", kr: "마르가리타", meaning: "진주", gender: "female" },
    { name: "Magnus", kr: "마그누스", meaning: "거대한", gender: "male" },
    { name: "Mel", kr: "멜", meaning: "꿀", gender: "neutral" },
    { name: "Nectar", kr: "넥타르", meaning: "달콤한 음료", gender: "neutral" },
    { name: "Orbis", kr: "오르비스", meaning: "구형, 구", gender: "male" },
    { name: "Petra", kr: "페트라", meaning: "바위", gender: "female" },
    { name: "Spatium", kr: "스파티움", meaning: "공간", gender: "neutral" },
    { name: "Terra", kr: "테라", meaning: "땅", gender: "female" },
    { name: "Universum", kr: "우니베르줌", meaning: "우주", gender: "neutral" },
    { name: "Gemma", kr: "제마", meaning: "보석", gender: "female" },
    { name: "Jasper", kr: "재스퍼", meaning: "보석", gender: "male" },
    { name: "Daxton", kr: "닥스턴", meaning: "기분 좋은 돌", gender: "male" },
    { name: "Eden", kr: "에덴", meaning: "모든 것이 아름다운 곳", gender: "neutral" },
    { name: "Vida", kr: "비다", meaning: "삶", gender: "female" },
    { name: "Cosima", kr: "코시마", meaning: "우주의 조화", gender: "female" },
    { name: "Caleb", kr: "카렙", meaning: "강한, 믿음직한", gender: "male" }
  ],
  metal: [
    { name: "Aurum", kr: "아우룸", meaning: "황금", gender: "neutral" },
    { name: "Ferrum", kr: "페룸", meaning: "철", gender: "neutral" },
    { name: "Gladius", kr: "글라디우스", meaning: "검", gender: "male" },
    { name: "Justitia", kr: "유스티티아", meaning: "정의, 공정", gender: "female" },
    { name: "Judicis", kr: "유디키스", meaning: "재판관, 판사", gender: "male" },
    { name: "Axl", kr: "액슬", meaning: "신의 검", gender: "male" },
    { name: "Sterling", kr: "스털링", meaning: "고결한, 빛나는", gender: "male" },
    { name: "Talon", kr: "탤런", meaning: "발톱", gender: "male" },
    { name: "Tristan", kr: "트리스탄", meaning: "기사", gender: "male" },
    { name: "Xander", kr: "잔더", meaning: "디펜더", gender: "male" },
    { name: "Xavier", kr: "자비어", meaning: "신성한, 새로운 집", gender: "male" },
    { name: "Reese", kr: "리스", meaning: "정의", gender: "neutral" }
  ],
  water: [
    { name: "Aqua", kr: "아쿠아", meaning: "물", gender: "female" },
    { name: "Atrox", kr: "아트록스", meaning: "공포", gender: "male" },
    { name: "Caligo", kr: "칼리고", meaning: "안개", gender: "female" },
    { name: "Chaos", kr: "카오스", meaning: "혼돈", gender: "neutral" },
    { name: "Glacies", kr: "글라키에스", meaning: "얼음", gender: "female" },
    { name: "Hielo", kr: "이엘로", meaning: "얼음", gender: "neutral" },
    { name: "Hiemis", kr: "히에미스", meaning: "겨울", gender: "female" },
    { name: "Inferna", kr: "인페르나", meaning: "지옥", gender: "female" },
    { name: "Lacrima", kr: "라크리마", meaning: "눈물", gender: "female" },
    { name: "Luna", kr: "루나", meaning: "달", gender: "female" },
    { name: "Maris", kr: "마리스", meaning: "바다, 해안", gender: "female" },
    { name: "Mors", kr: "모르스", meaning: "죽음", gender: "female" },
    { name: "Nebula", kr: "네불라", meaning: "구름", gender: "female" },
    { name: "Nix", kr: "닉스", meaning: "눈(Snow)", gender: "female" },
    { name: "Niveus", kr: "니베우스", meaning: "순백의", gender: "male" },
    { name: "Nox", kr: "녹스", meaning: "어둠", gender: "female" },
    { name: "Seio", kr: "시오", meaning: "물결", gender: "neutral" },
    { name: "Caspian", kr: "카스피안", meaning: "카스피해", gender: "male" },
    { name: "Darya", kr: "다리야", meaning: "해변", gender: "female" },
    { name: "Eira", kr: "에이라", meaning: "눈", gender: "female" },
    { name: "Eirlys", kr: "에어리스", meaning: "눈", gender: "female" },
    { name: "Kai", kr: "카이", meaning: "바다", gender: "male" },
    { name: "Naida", kr: "나이다", meaning: "물의 요정", gender: "female" },
    { name: "Nyx", kr: "닉스", meaning: "밤의 여신", gender: "female" },
    { name: "Ophelia", kr: "오펠리아", meaning: "해변가의 여인", gender: "female" },
    { name: "Rayne", kr: "레인", meaning: "비", gender: "neutral" },
    { name: "Selene", kr: "셀레네", meaning: "달의 여신", gender: "female" },
    { name: "Yara", kr: "야라", meaning: "물의 여신", gender: "female" },
    { name: "Ayla", kr: "아일라", meaning: "달빛", gender: "female" },
    { name: "Liriel", kr: "리리엘", meaning: "하늘의 노래", gender: "female" }
  ]
};

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

// --- 2. 성씨 데이터 ---
const vtuberSurnames = [
  { kanji: "星宮", kana: "호시미야", meaning: "별의 궁전" },
  { kanji: "白羽", kana: "시라하네", meaning: "하얀 깃털" },
  { kanji: "黒影", kana: "쿠로카게", meaning: "검은 그림자" },
  { kanji: "月代", kana: "츠키시로", meaning: "달빛 / 달의 시대" },
  { kanji: "天海", kana: "아마미", meaning: "하늘과 바다" },
  { kanji: "水城", kana: "미즈키", meaning: "물의 성" },
  { kanji: "炎城", kana: "엔죠", meaning: "불꽃의 성" },
  { kanji: "風間", kana: "카자마", meaning: "바람이 부는 사이" },
  { kanji: "蒼井", kana: "아오이", meaning: "푸른 우물" },
  { kanji: "桜野", kana: "사쿠라노", meaning: "벚꽃이 피는 들판" },
  { kanji: "華月", kana: "카츠키", meaning: "꽃과 달" },
  { kanji: "幻夜", kana: "겐야", meaning: "환상의 밤" },
  { kanji: "霧雨", kana: "키리사메", meaning: "안개비" },
  { kanji: "雷門", kana: "카미나리몬", meaning: "천둥의 문" },
  { kanji: "剣崎", kana: "켄자키", meaning: "검의 곶(지형)" },
  { kanji: "琴音", kana: "코토네", meaning: "거문고 소리" },
  { kanji: "鈴谷", kana: "스즈야", meaning: "방울 소리가 나는 계곡" },
  { kanji: "舞風", kana: "마이카제", meaning: "춤추는 바람" },
  { kanji: "神楽", kana: "카구라", meaning: "신을 위한 연주/춤" },
  { kanji: "御影", kana: "미카게", meaning: "신성한 그림자 / 영혼" },
  { kanji: "龍崎", kana: "류자키", meaning: "용의 곶" },
  { kanji: "獅堂", kana: "시도우", meaning: "사자의 전당" },
  { kanji: "兎月", kana: "우즈키", meaning: "토끼의 달" },
  { kanji: "狐塚", kana: "키츠네즈카", meaning: "여우 무덤" },
  { kanji: "狼谷", kana: "카미가야", meaning: "늑대 계곡" },
  { kanji: "氷室", kana: "히무로", meaning: "얼음 방" },
  { kanji: "冬木", kana: "후유키", meaning: "겨울 나무" },
  { kanji: "夏目", kana: "나츠메", "meaning": "여름의 눈" },
  { kanji: "春風", kana: "하루카제", meaning: "봄바람" },
  { kanji: "秋葉", kana: "아키하", meaning: "가을 단풍" },
  { kanji: "小鳥遊", kana: "타카나시", meaning: "작은 새가 노는 곳 (천적이 없음)" },
  { kanji: "有栖川", kana: "아리스가와", meaning: "앨리스 강 (명문가/아가씨 속성)" },
  { kanji: "西園寺", kana: "사이온지", meaning: "서원사 (전통적인 부잣집/명문가)" },
  { kanji: "神宮寺", kana: "진구지", meaning: "신궁사 (신비롭고 기품있는 속성)" },
  { kanji: "早乙女", kana: "사오토메", meaning: "벼 심는 소녀 (청순/무술가 속성)" },
  { kanji: "獅子王", kana: "시시오", meaning: "사자왕 (카리스마/압도적인 힘)" },
  { kanji: "九頭竜", kana: "쿠즈류", meaning: "구두룡 (드래곤/보스 속성)" },
  { kanji: "雪ノ下", kana: "유키노시타", meaning: "눈 아래 (지적이고 차가운 느낌)" },
  { kanji: "綾小路", kana: "아야노코지", meaning: "비단 좁은 길 (최상위 귀족 속성)" },
  { kanji: "東雲", kana: "시노노메", meaning: "새벽의 구름 (신비롭고 고풍스러운 느낌)" },
  { kanji: "五十嵐", kana: "이가라시", meaning: "50의 폭풍 (어감이 강렬하고 세련됨)" },
  { kanji: "薬師寺", kana: "야쿠시지", meaning: "약사사 (치유, 신성한 느낌)" },
  { kanji: "飛鳥井", kana: "아스카이", meaning: "나는 새의 우물 (고전적인 명문가 느낌)" },
  { kanji: "伊集院", kana: "이쥬인", meaning: "이주인 (엘리트, 부잣집 속성)" },
  { kanji: "鳳凰院", kana: "호오인", meaning: "봉황원 (웅장하고 중2병스러운 느낌)" },
  { kanji: "天王寺", kana: "텐노지", meaning: "천왕사 (당당하고 강한 느낌)" },
  { kanji: "宇都宮", kana: "우츠노미야", meaning: "우츠노미야 (우주나 별의 느낌을 은유적으로 줌)" },
  { kanji: "八百万", kana: "야오요로즈", meaning: "8백만 (일본의 수많은 신을 의미, 신성함)" },
  { kanji: "不知火", kana: "시라누이", meaning: "도깨비불 / 바다의 신기루 (요괴, 불꽃 속성)" },
  { kanji: "四ノ宮", kana: "시노미야", meaning: "4의 궁전 (왕족, 엘리트 느낌)" }
];

// --- 3. 81수리 성명학 데이터 (대길수 모음) ---
const luckyStrokes = [
  { num: 21, name: "두령격(頭領格)", desc: "탁월한 리더십과 매력으로 거대한 팬덤을 이끌고 굳건히 자리 잡는 대길수입니다." },
  { num: 23, name: "융창격(隆昌格)", desc: "아침 해가 솟아오르듯 인기가 급상승하며, 큰 권위와 명성을 얻는 길수입니다." },
  { num: 24, name: "입신격(立身格)", desc: "무에서 유를 창조하는 기운으로, 초반의 어려움을 딛고 막대한 재물과 인기를 거머쥡니다." },
  { num: 31, name: "대성격(大成格)", desc: "의지가 굳건하고 뜻을 이루어, 장기적으로 흔들림 없이 이름을 널리 알리는 완벽한 길수입니다." },
  { num: 32, name: "순풍격(順風格)", desc: "순조롭게 기회를 만나 뜻을 이루며, 합방이나 콜라보 등에서 귀인의 도움을 받아 대성합니다." }
];

const elementLabels = {
  wood: '목(木) - 성장의 기운 (학생, 청춘, 요정, 숲)',
  fire: '화(火) - 확산의 기운 (악마, 드래곤, 빛)',
  earth: '토(土) - 중재의 기운 (평범한 인간, 일상, 대지)',
  metal: '금(金) - 결실의 기운 (사이보그, 기사, 기계)',
  water: '수(水) - 지혜의 기운 (해양, 심해, 얼음)'
};

// 스토리텔링용 오행 묘사 텍스트
const elementStory = {
  wood: '맑고 푸른 나무(木)',
  fire: '폭발적인 대중의 관심(火)',
  earth: '단단하고 안정적인 대지(土)',
  metal: '예리하고 빛나는 보석(金)',
  water: '깊고 유연한 물(水)'
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
    characterAttribute: 'water',
    birthDate: '1989-11-20',
    debutDate: '',
    mbti: '',
    gender: 'male', // 정정된 기본값
    nameStyle: 'japanese',
  });

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      let coreElement: keyof typeof vtuberNames = 'water';
      let successElement: keyof typeof vtuberNames | null = null;
      let finalElement: keyof typeof vtuberNames = 'water';
      let elementScores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

      // 포맷팅된 날짜 텍스트 (MM/DD)
      const birthStr = formData.birthDate ? `${formData.birthDate.split('-')[1]}/${formData.birthDate.split('-')[2]}` : '';
      const debutStr = formData.debutDate ? `${formData.debutDate.split('-')[1]}/${formData.debutDate.split('-')[2]}` : '';

      const adapter = await createLuxonAdapter();

      // 0. 캐릭터 세계관 속성 분석 (최대 가중치)
      if (formData.characterAttribute) {
        elementScores[formData.characterAttribute as keyof typeof elementScores] += 15;
      }

      // 1. 생일 사주 분석
      if (formData.birthDate) {
        const [year, month, day] = formData.birthDate.split('-');
        const birthDt = DateTime.fromObject({ year: Number(year), month: Number(month), day: Number(day), hour: 12, minute: 0 }, { zone: "Asia/Seoul" });

        if (birthDt.isValid) {
          const saju = getSaju(birthDt, { adapter, gender: formData.gender });
          coreElement = mapSajuElement(saju.yongShen.primary.element) || 'water';
          elementScores[coreElement] += 10;
        }
      }

      // 2. 데뷔일 사주 분석 
      if (formData.debutDate) {
        const [dYear, dMonth, dDay] = formData.debutDate.split('-');
        const debutDt = DateTime.fromObject({ year: Number(dYear), month: Number(dMonth), day: Number(dDay), hour: 12, minute: 0 }, { zone: "Asia/Seoul" });

        if (debutDt.isValid) {
          const debutSaju = getSaju(debutDt, { adapter, gender: formData.gender });
          successElement = mapSajuElement(debutSaju.yongShen.primary.element);
          if (successElement) {
            elementScores[successElement] += 5;
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

      // 4. 최종 오행 선정
      finalElement = Object.keys(elementScores).reduce((a, b) =>
        elementScores[a as keyof typeof elementScores] > elementScores[b as keyof typeof elementScores] ? a : b
      ) as keyof typeof vtuberNames;

      // 5. 조합 생성 (81수리 및 스토리텔링 요소 포함)
      setTimeout(() => {
        const targetFirstNamePool = formData.nameStyle === 'english' ? vtuberNames[finalElement] : vtuberJapaneseNames[finalElement];

        const shuffledFirstNames = shuffleArray(targetFirstNamePool);
        const shuffledSurnames = shuffleArray(vtuberSurnames);

        const combinations = [];
        const resultCount = Math.min(10, shuffledSurnames.length, shuffledFirstNames.length);

        for (let i = 0; i < resultCount; i++) {
          const randomLuckyStroke = luckyStrokes[Math.floor(Math.random() * luckyStrokes.length)];

          combinations.push({
            surname: shuffledSurnames[i],
            firstName: shuffledFirstNames[i],
            matchedElement: finalElement,
            luckyStroke: randomLuckyStroke,
            birthElement: coreElement,
            debutElement: successElement,
            birthStr: birthStr,
            debutStr: debutStr
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

                    {/* 캐릭터 속성 */}
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
                        <option value="wood">목(木) - 학생, 청춘, 요정, 숲</option>
                        <option value="fire">화(火) - 악마, 드래곤, 빛</option>
                        <option value="earth">토(土) - 평범한 인간, 일상, 대지</option>
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
                    <p className="text-sm text-slate-500 dark:text-slate-400">선택하신 속성과 데뷔일의 흐름, 81수리의 대길수(大吉數)를 조합 중입니다.</p>
                  </div>
                </div>
              </div>
            )}

            {/* JP-Style 결과 화면 */}
            {activeTab === 'japanese' && jpResults.length > 0 && !isGenerating && (
              <div className="w-full space-y-6 animate-[fadeIn_0.5s_ease-out]">

                {/* 분석 결과 헤더 박스 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400">
                      최종 테마 도출: {elementLabels[jpResults[0].matchedElement as keyof typeof elementLabels]}
                    </h2>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 mt-4 flex gap-3">
                    <Info className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                      {formData.mbti ? `[${formData.mbti} 맞춤 기질 적용] ` : ''}
                      선택하신 캐릭터 모티브에 생일과 데뷔일의 기운을 융합하여 추출된 이름입니다. 특히 성공운을 좌우하는 81수리의 '대길수(大吉數)' 조합만을 엄선했습니다.
                    </p>
                  </div>
                </div>

                {/* 이름 카드 영역 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {jpResults.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-300 dark:hover:border-rose-700 transition-colors group flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
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
                      </div>

                      {/* 💡 텍스트 스토리텔링 (명리학 기반) 영역 */}
                      <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50 text-sm space-y-3">
                        <div className="flex items-start gap-2">
                          <span className="text-slate-600 dark:text-slate-300 leading-snug">
                            {item.birthStr ? `캐릭터 생일(${item.birthStr})의 ${elementStory[item.birthElement as keyof typeof elementStory]} 기운을 담아 '${item.surname.kana}(${item.surname.kanji})' 성씨를, ` : `캐릭터의 본질적인 ${elementStory[item.birthElement as keyof typeof elementStory]} 기운을 담아 '${item.surname.kana}(${item.surname.kanji})' 성씨를 정하고, `}
                            {item.debutStr && item.debutElement ? `데뷔일(${item.debutStr})에 필요한 ${elementStory[item.debutElement as keyof typeof elementStory]} 기운을 이끌어내기 위해 '${item.firstName.kr}' 이름을 추천합니다.` : `방송 흥행을 위해 '${item.firstName.kr}' 이름을 결합했습니다.`}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-slate-600 dark:text-slate-300 leading-snug">
                            총 획수 <strong>{item.luckyStroke.num}획 ({item.luckyStroke.name})</strong>: {item.luckyStroke.desc}
                          </span>
                        </div>
                      </div>
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