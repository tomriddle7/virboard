import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSg-yT-5-Jf4gATzS6UIj3HLbfXb2uHok6Wccj5ujEd4YbylqetgNN6fqioYWNVWVj-DPqj6FT0wOQZ/pub?gid=392796143&single=true&output=tsv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_OUTPUT_PATH = path.join(__dirname, '../public/celebration.json');

async function fetchAndConvert() {
  try {
    console.log('구글 시트 데이터 가져오는 중...');
    const response = await fetch(CSV_URL);
    const csvText = await response.text();

    const rows = csvText.split('\n').map(row => row.trim()).filter(row => row);
    const headers = rows[0].split('\t');

    const jsonData = rows.slice(1).map(row => {
      const values = row.split(/\t(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const obj = {};

      headers.forEach((header, index) => {
        let value = values[index] ? values[index].replace(/^"|"$/g, '').trim() : "";
        obj[header] = value;
      });
      return obj;
    });

    // ✨ 추가된 핵심 로직: public 폴더가 없으면 자동으로 생성합니다!
    const outputDir = path.dirname(JSON_OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log('public 폴더가 없어서 새로 생성했습니다.');
    }

    // 기존 celebration.json 파일 덮어쓰기 (이제 에러가 나지 않습니다!)
    fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log(`성공적으로 ${jsonData.length}개의 일정을 celebration.json에 저장했습니다! 🚀`);

  } catch (error) {
    console.error('데이터 갱신 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

fetchAndConvert();
