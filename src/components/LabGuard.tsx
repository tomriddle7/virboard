import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LabGuardProps {
  children: React.ReactNode;
}

export default function LabGuard({ children }: LabGuardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // 통행증 검사 로직
    if (!location.state?.fromLab) {
      alert('정상적인 접근이 아닙니다. Lab 페이지를 통해 진입해 주세요.');
      navigate('/labs', { replace: true }); // 즉시 돌려보냄
    } else {
      setIsVerified(true); // 통과!
    }
  }, [location, navigate]);

  // 검증이 끝나기 전까지는 하위 컴포넌트를 렌더링하지 않음 (UI 깜빡임 방지)
  if (!isVerified) return null;

  // 검증을 통과하면 비로소 내용물(Appraisal 등)을 보여줌
  return <>{children}</>;
}