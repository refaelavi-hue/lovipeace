import { useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  gender: 'female' | 'male' | '';
  reason: string;
  voicePreference: string;
  onboardingComplete: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  gender: '',
  reason: '',
  voicePreference: '',
  onboardingComplete: false,
};

export function useOnboarding() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem('user-profile');
    return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('user-profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const completeOnboarding = () => {
    updateProfile({ onboardingComplete: true });
  };

  const resetOnboarding = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem('user-profile');
  };

  return { profile, updateProfile, completeOnboarding, resetOnboarding };
}
