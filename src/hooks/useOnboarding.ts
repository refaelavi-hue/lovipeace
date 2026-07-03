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
    try {
      const stored = localStorage.getItem('user-profile');
      return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Persist synchronously on every change so navigation right after
  // updateProfile/completeOnboarding never loses the write.
  const persist = (next: UserProfile) => {
    try {
      localStorage.setItem('user-profile', JSON.stringify(next));
    } catch {
      /* noop */
    }
  };

  // Safety net — also persist via effect (covers external setState paths).
  useEffect(() => {
    persist(profile);
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      persist(next);
      return next;
    });
  };

  const completeOnboarding = () => {
    setProfile(prev => {
      const next = { ...prev, onboardingComplete: true };
      persist(next);
      return next;
    });
  };

  const resetOnboarding = () => {
    setProfile(DEFAULT_PROFILE);
    try {
      localStorage.removeItem('user-profile');
    } catch {
      /* noop */
    }
  };

  return { profile, updateProfile, completeOnboarding, resetOnboarding };
}
