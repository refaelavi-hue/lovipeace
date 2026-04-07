import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingStep from '@/components/OnboardingStep';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getGenderedTexts, g } from '@/lib/genderedText';
import { ChevronRight } from 'lucide-react';

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
  const [accepted, setAccepted] = useState(false);
  const { profile, updateProfile, completeOnboarding } = useOnboarding();
  const navigate = useNavigate();
  const t = getGenderedTexts(profile.gender);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return (profile.gender || '').length > 0 && profile.name.trim().length > 0;
      case 1: return (profile.reason || '').length > 0;
      case 2: return (profile.voicePreference || '').length > 0;
      case 3: return accepted;
      default: return false;
    }
  };

  const backButton = step > 0 ? (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors mb-6 self-start"
    >
      <ChevronRight size={16} />
      <span>חזרה</span>
    </button>
  ) : null;

  return (
    <div className="min-h-screen bg-background" key={step}>
      {/* Step 0: Gender + Name */}
      {step === 0 && (
        <OnboardingStep
          title="שלום 👋"
          subtitle="איך נפנה אליך?"
          step={0}
          totalSteps={totalSteps}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              {([
                { id: 'female' as const, label: 'פנייה בלשון נקבה', icon: '🌸' },
                { id: 'male' as const, label: 'פנייה בלשון זכר', icon: '🌿' },
              ]).map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateProfile({ gender: option.id })}
                  className={`w-full p-4 rounded-2xl text-right flex items-center gap-4 transition-all duration-300 ${
                    profile.gender === option.id
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-card border-2 border-transparent hover:border-primary/30'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-foreground text-lg">{option.label}</span>
                </button>
              ))}
            </div>

            <Input
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              placeholder="השם שלך..."
              className="bg-card border-border text-foreground text-center text-lg h-14 rounded-2xl"
            />

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-14 rounded-2xl text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 disabled:opacity-30 mt-2"
            >
              המשך
            </Button>
          </div>
        </OnboardingStep>
      )}

      {/* Step 1: Reason */}
      {step === 1 && (
        <OnboardingStep
          title={`היי ${profile.name} 🌿`}
          subtitle="מה הכי מביא אותך לכאן?"
          step={1}
          totalSteps={totalSteps}
        >
          <div className="space-y-3">
            {backButton}
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

      {/* Step 2: Voice preference */}
      {step === 2 && (
        <OnboardingStep
          title="איזה קול מרגיע? 🎧"
          subtitle={`${t.choose} קול להדרכות`}
          step={2}
          totalSteps={totalSteps}
        >
          <div className="space-y-3">
            {backButton}
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
              המשך
            </Button>
          </div>
        </OnboardingStep>
      )}

      {/* Step 3: Terms */}
      {step === 3 && (
        <OnboardingStep
          title="לפני שמתחילים 📋"
          subtitle={`חשוב ש${g(profile.gender, 'תדעי', 'תדע')}`}
          step={3}
          totalSteps={totalSteps}
        >
          <div className="space-y-5">
            {backButton}
            <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
              <p className="text-foreground/90 text-sm leading-relaxed font-medium mb-2">⚠️ הבהרה חשובה</p>
              <p className="text-foreground/70 text-sm leading-relaxed">
                אפליקציה זו <strong className="text-foreground/90">אינה מחליפה</strong> ייעוץ, אבחון או טיפול מקצועי.
              </p>
              <p className="text-foreground/70 text-sm leading-relaxed mt-2">
                במצוקה — {g(profile.gender, 'חייגי', 'חייג')} לער״ן: <a href="tel:1201" className="text-primary font-bold underline" dir="ltr">1201</a>
              </p>
            </div>

            <div className="bg-card rounded-2xl p-4 border border-border/50 text-foreground/60 text-xs leading-relaxed space-y-2 max-h-36 overflow-y-auto">
              <p><strong className="text-foreground/80">1. מהות השירות</strong> — תכנים חינוכיים ותרגולים. אינם מהווים טיפול.</p>
              <p><strong className="text-foreground/80">2. אחריות</strong> — השימוש על אחריותך בלבד.</p>
              <p><strong className="text-foreground/80">3. פרטיות</strong> — המידע נשמר מקומית במכשיר בלבד.</p>
              <p><strong className="text-foreground/80">4. גיל מינימלי</strong> — מעל גיל 13.</p>
            </div>

            <button
              onClick={() => navigate('/terms')}
              className="text-primary text-xs underline underline-offset-2 hover:opacity-80 transition-opacity text-center"
            >
              קריאת התנאים המלאים →
            </button>

            <div className="flex items-start gap-3 pt-1" dir="rtl">
              <Checkbox
                id="terms"
                checked={accepted}
                onCheckedChange={(v) => setAccepted(v === true)}
                className="mt-0.5 border-primary data-[state=checked]:bg-primary"
              />
              <label htmlFor="terms" className="text-sm text-foreground/80 leading-relaxed cursor-pointer">
                {t.read} והבנתי, ואני {g(profile.gender, 'מסכימה', 'מסכים')} לתנאים
              </label>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-14 rounded-2xl text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 disabled:opacity-30"
            >
              {t.letsStart} ✨
            </Button>
          </div>
        </OnboardingStep>
      )}
    </div>
  );
};

export default Onboarding;
