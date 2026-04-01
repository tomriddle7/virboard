import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Streamers from '@/pages/Streamers';
import CalendarHeader from '@/components/CalendarHeader';
import Footer from '@/components/Footer';

function App() {
  return (
    <BrowserRouter>
      {/* 이제 Props 없이 알아서 전역 상태를 구독합니다 */}
      <CalendarHeader />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/streamer" element={<Streamers />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;