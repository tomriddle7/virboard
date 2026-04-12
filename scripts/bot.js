import fs from 'fs';
import path from 'path';
import { TwitterApi } from 'twitter-api-v2';

// 환경 변수에서 API 키와 웹앱 URL을 가져옵니다. (GitHub Secrets에서 주입됨)
const {
    VITE_TWITTER_API_KEY,
    VITE_TWITTER_API_SECRET,
    VITE_TWITTER_ACCESS_TOKEN,
    VITE_TWITTER_ACCESS_SECRET,
    VITE_EVENT_SHEET_URL
} = process.env;

// Twitter 클라이언트 초기화
const twitterClient = new TwitterApi({
    appKey: VITE_TWITTER_API_KEY,
    appSecret: VITE_TWITTER_API_SECRET,
    accessToken: VITE_TWITTER_ACCESS_TOKEN,
    accessSecret: VITE_TWITTER_ACCESS_SECRET,
});

const rwClient = twitterClient.readWrite;

// --- [핵심 로직] ---
async function runBot() {
    try {
        console.log('🤖 트위터 봇 실행을 시작합니다...');

        // 1. 데이터 불러오기 (실제 환경에 맞게 구현 필요: 로컬 JSON 파일 읽기 or API 호출)
        const eventsPath = path.join(process.cwd(), 'public/celebration.json');
        const vtubersPath = path.join(process.cwd(), 'public/vtubers.json');

        const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
        const vtubers = JSON.parse(fs.readFileSync(vtubersPath, 'utf8'));

        // 2. 아직 트윗되지 않은 행사 필터링 (TRUE가 아닌 것들만)
        const pendingEvents = events.filter(e => e.isTweeted !== 'TRUE' && e.isTweeted !== true);

        let tweetText = '';
        let targetEventRow = null;

        if (pendingEvents.length > 0) {
            // 🚀 [분기 1] 새로운 오프라인 행사가 있는 경우 (홍보 트윗)
            const targetEvent = pendingEvents[0]; // 가장 첫 번째 대기열 항목 선택
            targetEventRow = targetEvent.rowNum;

            const tagName = vtubers.find(vtuber => vtuber.id === targetEvent.vtuber_id).name;
            tweetText = `📢 새로운 오프라인 광고/행사가 등록되었습니다!

🎪 ${targetEvent.title}
📍 장소: ${targetEvent.location}
📅 시작일: ${targetEvent.start}

오시의 행사 정보를 확인하고 방문해 보세요!
👉 자세히 보기: https://virboard.me/?eventId=${targetEvent.id}

#${tagName} #버튜버 #Virboard`;

            console.log('📝 [모드: 행사 홍보] 트윗 텍스트 준비 완료');

        } else {
            // 🚀 [분기 2] 대기 중인 행사가 없을 경우 (기념일 또는 랜덤 버튜버 소개)
            if (!vtubers || vtubers.length === 0) {
                console.log('⚠️ 표시할 행사도, 버튜버 데이터도 없습니다. 봇을 종료합니다.');
                return;
            }

            const today = new Date();
            const todayString = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

            // 오늘 생일이거나 데뷔일인 버튜버 찾기
            const anniversaryVtuber = vtubers.find(
                (v) => v.birthday === todayString || v.debut_date === todayString
            );

            const targetVtuber = anniversaryVtuber || vtubers[Math.floor(Math.random() * vtubers.length)];
            const isAnniversary = !!anniversaryVtuber;

            const introText = isAnniversary
                ? `🎉 오늘은 ${targetVtuber.name}의 기념일(생일/데뷔)입니다! 모두 축하해 주세요! 🎉`
                : `✨ 오늘의 버튜버 탐구 ✨`;

            const tagName = targetVtuber.name.replace(/\s/g, '');
            const agency = targetVtuber.agency || '개인세';
            const birthday = targetVtuber.birthday || '미상';
            const debutDate = targetVtuber.debut_date || '미상';

            tweetText = `${introText}

🎤 이름: ${targetVtuber.name}
🏢 소속: ${agency}
🎂 생일: ${birthday}
🎉 데뷔일: ${debutDate}

지난 오프라인 광고 기록을 확인하거나 새로운 일정을 제보해 보세요!
👉 일정 보기: https://virboard.me/?vtuberId=${targetVtuber.id}

#${tagName} #버튜버 #Virboard`;

            console.log('📝 [모드: 버튜버 탐구] 트윗 텍스트 준비 완료');
        }

        // 3. 트위터(X) API로 트윗 전송
        console.log('🚀 트윗 전송 중...');
        const { data: createdTweet } = await rwClient.v2.tweet(tweetText);
        console.log(`✅ 트윗 전송 성공! (ID: ${createdTweet.id})`);

        // 4. 이벤트 홍보 트윗이었을 경우, 구글 시트에 완료 상태(TRUE) 업데이트
        if (targetEventRow !== null && VITE_EVENT_SHEET_URL) {
            console.log(`🔄 구글 시트 상태 업데이트 중... (Row: ${targetEventRow})`);

            const response = await fetch(VITE_EVENT_SHEET_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'updateTweetStatus',
                    rowNum: targetEventRow,
                }),
            });

            const result = await response.json();
            if (result.result === 'success') {
                console.log('✅ 구글 시트 상태 업데이트 완료!');
            } else {
                console.error('❌ 구글 시트 업데이트 실패:', result);
            }
        }

        console.log('🤖 트위터 봇 실행을 성공적으로 마쳤습니다.');

    } catch (error) {
        console.error('❌ 봇 실행 중 오류 발생:', error);
        process.exit(1); // 오류 발생 시 GitHub Actions 작업을 실패 처리함
    }
}

// 봇 실행
runBot();