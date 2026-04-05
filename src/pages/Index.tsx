import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user-profile');
    if (stored) {
      const profile = JSON.parse(stored);
      if (profile.onboardingComplete) {
        navigate('/dashboard', { replace: true });
        return;
      }
    }
    navigate('/onboarding', { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
