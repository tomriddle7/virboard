import React from 'react';
import { Link } from 'react-router-dom';

// 실험 중인 기능 리스트 데이터
const labItems = [
    {
        id: 1,
        title: "버튜버 작명 감별기",
        description: "데뷔 예정인 버튜버들에게 적합한 이름을 추천해줍니다.",
        path: "/naming",
        status: "Alpha"
    },
    {
        id: 2,
        title: "버튜버 작명 평가기",
        description: "데뷔&데뷔 예정인 버튜버들의 이름을 명리학으로 평가해줍니다.",
        path: "/naming/appraisal",
        status: "Beta"
    },
    {
        id: 3,
        title: "새로운 테마 엔진",
        description: "런타임에서 동적으로 변하는 테마 시스템을 적용해 봅니다.",
        path: "/",
        status: "In Progress"
    },
];

const Labs = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>🧪 Experimental Labs</h1>
                <p style={styles.subtitle}>준비 중이거나 실험 중인 기능들을 미리 체험해 보세요.</p>
            </header>

            <div style={styles.grid}>
                {labItems.map((item) => (
                    <Link to={item.path} key={item.id} style={styles.card} state={{ fromLab: true }}>
                        <div style={styles.statusBadge}>{item.status}</div>
                        <h2 style={styles.cardTitle}>{item.title}</h2>
                        <p style={styles.cardDescription}>{item.description}</p>
                        <span style={styles.linkText}>자세히 보기 →</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

// 간단한 인라인 스타일 (Tailwind나 CSS Modules로 대체 가능합니다)
const styles = {
    container: { padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '40px', textAlign: 'center' },
    title: { fontSize: '2.5rem', fontWeight: 'bold', color: '#333' },
    subtitle: { color: '#666', marginTop: '10px' },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
    },
    card: {
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #eaeaea',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        cursor: 'pointer'
    },
    statusBadge: {
        fontSize: '0.75rem',
        backgroundColor: '#f0f0f0',
        padding: '4px 8px',
        borderRadius: '4px',
        width: 'fit-content',
        marginBottom: '12px',
        fontWeight: 'bold'
    },
    cardTitle: { fontSize: '1.25rem', marginBottom: '10px' },
    cardDescription: { color: '#555', fontSize: '0.95rem', flexGrow: 1, marginBottom: '20px' },
    linkText: { color: '#0070f3', fontWeight: '500' }
};

export default Labs;