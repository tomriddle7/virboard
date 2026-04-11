import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const EVENT_SHEET_URL = process.env.VITE_EVENT_SHEET_URL;
const VTUBER_SHEET_URL = process.env.VITE_VTUBER_SHEET_URL;
const PLATFORM_SHEET_URL = process.env.VITE_PLATFORM_SHEET_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_OUTPUT_PATH = path.join(__dirname, '../public/celebration.json');
const VTUBERS_OUTPUT_PATH = path.join(__dirname, '../public/vtubers.json');

const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

async function fetchAndParseTSV(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`데이터를 가져오는데 실패했습니다: ${response.statusText}`);

  const text = await response.text();
  const rows = text.split('\n').map(row => row.trim()).filter(row => row);
  const headers = rows[0].split('\t');

  return rows.slice(1).map(row => {
    const values = row.split(/\t(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj = {};
    headers.forEach((header, index) => {
      let value = values[index] ? values[index].replace(/^"|"$/g, '').trim() : "";
      if (!header.startsWith('_')) obj[header] = value;
    });
    return obj;
  });
}

async function fetchAndConvert() {
  try {
    console.log('구글 시트 데이터 가져오는 중...');

    const [rawVtubers, rawEvents, rawPlatforms] = await Promise.all([
      fetchAndParseTSV(VTUBER_SHEET_URL),
      fetchAndParseTSV(EVENT_SHEET_URL),
      fetchAndParseTSV(PLATFORM_SHEET_URL)
    ])
    
    // 2. 버튜버 마스터 데이터를 딕셔너리(Map) 형태로 변환하여 검색 속도를 높이고 배열화합니다.
    const vtuberMap = {};
    const formattedVtubers = [];
    rawVtubers.forEach(v => {
      const matchedPlatforms = Object.fromEntries(
        rawPlatforms
          .filter(p => p.vtuber_id === v.id)
          .map(p => [p.platform, p.url])
      );

      const formatted = {
        ...v,
        generation: v.generation ? v.generation.split(',').map(g => g.trim()) : [],
        unit: v.unit ? v.unit.split(',').map(u => u.trim()) : [],
        // ✨ 3-2. 조립된 플랫폼 배열을 객체 안에 쏙 넣어줍니다!
        platforms: matchedPlatforms
      };

      vtuberMap[v.id] = formatted;
      formattedVtubers.push(formatted);
    });

    const finalEvents = [];

    // 3. 일반 일정 조립 (모금/광고 이벤트 데이터에 버튜버 마스터 정보 덮어쓰기)
    rawEvents.forEach(event => {
      const vtuber = vtuberMap[event.vtuber_id];
      const vName = vtuber ? vtuber.name : '서사유';
      const vColor = vtuber ? vtuber.color : 'bg-gray-500';

      finalEvents.push({
        ...event,
        // vtuber_name: vName,
        // agency: vtuber ? vtuber.agency : '기타',
        // generation: vtuber ? vtuber.generation : [],
        // unit: vtuber ? vtuber.unit : [],
        // ✨ 색상 덮어쓰기: 이벤트 전용 색상이 있으면 쓰고, 없으면 마스터 시트 색상 사용
        color: event.color || vColor
      });
    });

    // 4. 생일 자동 생성 로직 (윤년 처리 포함)
    const currentYear = new Date().getFullYear();

    rawVtubers.forEach(vtuber => {
      if (!vtuber.birth || vtuber.privacy === 'Private') return; // 생일 정보가 없거나 비공개 행은 건너뜁니다.

      const vBirthday = vtuber.birth.substring(5);
      // 올해의 생일 데이터를 생성합니다.
      [currentYear].forEach(year => {
        let targetDate = `${year}-${vBirthday}`;
        let eventTitle = `🎂 ${vtuber.name} ${year}년 생일`;

        // ✨ 하코스 벨즈(02-29) 윤년 예외 처리
        if (vBirthday === '02-29' && !isLeapYear(year)) {
          targetDate = `${year}-02-28`;
          eventTitle = `🎂 ${vtuber.name} ${year}년 생일 (윤년 아님)`;
        }

        finalEvents.push({
          // event_id: `bday-${vtuber.id}-${year}`,
          id: vtuber.id,
          // status: '진행중',
          title: eventTitle,
          event_start_at: `${targetDate} 0:00`,
          event_end_at: `${targetDate} 23:59`,
          color: vtuber.color,
          type: '생일',
          location: '',
          link: vtuber.link || ' ',
          status: 'ongoing'
        });
      });
    });

    // 5. public 폴더 확인 및 JSON 파일 저장
    const outputDir = path.dirname(JSON_OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log('public 폴더가 없어서 새로 생성했습니다.');
    }

    fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(finalEvents, null, 2), 'utf-8');
    console.log(`✅ 성공적으로 ${rawEvents.length}개의 일정과 ${rawVtubers.length}개의 생일을 celebration.json에 저장했습니다! 🚀`);
    fs.writeFileSync(VTUBERS_OUTPUT_PATH, JSON.stringify(formattedVtubers, null, 2), 'utf-8');
    console.log(`✅ 성공적으로 ${formattedVtubers.length}개의 버튜버 프로필을 vtubers.json에 저장했습니다! 🚀`);

  } catch (error) {
    console.error('❌ 데이터 갱신 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

fetchAndConvert();
