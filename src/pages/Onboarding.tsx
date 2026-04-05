import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingStep from '@/components/OnboardingStep';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const REASONS = [
  { id: 'anxiety', label: 'חרדה כללית', icon: '🌊' },
  { id: 'stress', label: 'לחץ ומתח', icon: '⚡' },
  { id: 'sleep', label: 'קשיי שינה', icon: '🌙' },
  { id: 'growth', label: 'צמיחה אישית', icon: '🌱' },
];

const VOICES = [
  { id: 'female', label: 'קול נשי', icon: '🎵' },
  { id: 'male', label: 'קול גברי', icon: '🎶' },
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const { profile, updateProfile, completeOnboarding } = useOnboarding();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      navigate('/dashboard');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return profile.name.trim().length > 0;
      case 1: return profile.reason.length > 0;
      case 2: return profile.voicePreference.length > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background" key={step}>
      {step === 0 && (
        <OnboardingStep
          title="ברוכה הבאה 💛"
          subtitle="זה בסדר להרגיש ככה. בואי ניצור יחד מרחב בטוח."
          step={0}
          totalSteps={3}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-muted-foreground text-sm mb-2">
                איך לקרוא לך?
              </label>
              <Input
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="השם שלך..."
                className="bg-card border-border text-foreground text-center text-lg h-14 rounded-2xl"
                autoFocus
              />
            </div>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-14 rounded-2xl text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 disabled:opacity-30"
            >
              המשך
            </Button>
          </div>
        </OnboardingStep>
      )}

      {step === 1 && (
        <OnboardingStep
          title={`היי ${profile.name} 🌿`}
          subtitle="מה הכי מביא אותך לכאן?"
          step={1}
          totalSteps={3}
        >
          <div className="space-y-3">
            {REASONS.map((reason) => (
              <button
                key={reason.id}
                onClick={() => updateProfile({ reason: reason.id })}
                className={`w-full p-4 rounded-2xl text-right flex items-center gap-4 transition-all duration-300 ${
                  profile.reason === reason.id
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-card border-2 border-transparent hover:border-primary/30'
                }`}
              >
                <span className="text-2xl">{reason.icon}</span>
                <span className="text-foreground text-lg">{reason.label}</span>
              </button>
            ))}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-14 rounded-2xl text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 disabled:opacity-30 mt-4"
            >
              המשך
            </Button>
          </div>
        </OnboardingStep>
      )}

      {step === 2 && (
        <OnboardingStep
          title="איזה קול מרגיע אותך? 🎧"
          subtitle="בחרי קול להדרכות המונחות"
          step={2}
          totalSteps={3}
        >
          <div className="space-y-3">
            {VOICES.map((voice) => (
              <button
                key={voice.id}
                onClick={() => updateProfile({ voicePreference: voice.id })}
                className={`w-full p-5 rounded-2xl text-right flex items-center gap-4 transition-all duration-300 ${
                  profile.voicePreference === voice.id
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-card border-2 border-transparent hover:border-primary/30'
                }`}
              >
                <span className="text-2xl">{voice.icon}</span>
                <span className="text-foreground text-lg">{voice.label}</span>
              </button>
            ))}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-14 rounded-2xl text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 disabled:opacity-30 mt-4"
            >
              בואי נתחיל ✨
            </Button>
          </div>
        </OnboardingStep>
      )}
    </div>
  );
};

export default Onboarding;
