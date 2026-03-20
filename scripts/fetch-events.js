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

    // TSV 데이터를 줄바꿈으로 나누고, 헤더 추출
    const rows = csvText.split('\n').map(row => row.trim()).filter(row => row);
    const headers = rows[0].split('\t');

    const jsonData = rows.slice(1).map(row => {
      // 탭을 기준으로 데이터를 나눕니다 (따옴표로 묶인 데이터 처리를 위해 정규식 사용)
      const values = row.split(/\t(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const obj = {};
      
      headers.forEach((header, index) => {
        let value = values[index] ? values[index].replace(/^"|"$/g, '').trim() : "";
        obj[header] = value;
      });
      return obj;
    });

    // 기존 celebration.json 파일 덮어쓰기
    fs.writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log(`성공적으로 ${jsonData.length}개의 일정을 celebration.json에 저장했습니다! 🚀`);
    
  } catch (error) {
    console.error('데이터 갱신 중 오류가 발생했습니다:', error);
    process.exit(1); // 오류 시 GitHub Action 실패 처리
  }
}

fetchAndConvert();