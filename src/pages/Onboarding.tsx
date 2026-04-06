import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingStep from '@/components/OnboardingStep';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

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

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps - 1) {
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
      case 3: return accepted;
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
          totalSteps={totalSteps}
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
          totalSteps={totalSteps}
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
          totalSteps={totalSteps}
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
              המשך
            </Button>
          </div>
        </OnboardingStep>
      )}

      {step === 3 && (
        <OnboardingStep
          title="לפני שמתחילים 📋"
          subtitle="חשוב לנו שתדעי"
          step={3}
          totalSteps={totalSteps}
        >
          <div className="space-y-5">
            <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
              <p className="text-foreground/90 text-sm leading-relaxed font-medium mb-2">⚠️ הבהרה חשובה</p>
              <p className="text-foreground/70 text-sm leading-relaxed">
                אפליקציה זו <strong className="text-foreground/90">אינה מחליפה</strong> ייעוץ, אבחון או טיפול מקצועי בבריאות הנפש. 
                התכנים הם כלי עזר כלליים בלבד.
              </p>
              <p className="text-foreground/70 text-sm leading-relaxed mt-2">
                במצוקה חריפה — פנה/י לאיש מקצוע או חייג/י לקו ער״ן: <a href="tel:1201" className="text-primary font-bold underline" dir="ltr">1201</a>
              </p>
            </div>

            <div className="bg-card rounded-2xl p-4 border border-border/50 text-foreground/60 text-xs leading-relaxed space-y-2 max-h-36 overflow-y-auto">
              <p><strong className="text-foreground/80">1. מהות השירות</strong> — תכנים חינוכיים ותרגולים מבוססי CBT, מיינדפולנס ו-DBT. אינם מהווים טיפול.</p>
              <p><strong className="text-foreground/80">2. אחריות</strong> — השימוש על אחריותך בלבד.</p>
              <p><strong className="text-foreground/80">3. פרטיות</strong> — כל המידע נשמר מקומית במכשיר בלבד.</p>
              <p><strong className="text-foreground/80">4. גיל מינימלי</strong> — מעל גיל 13. קטינים דורשים הסכמת הורה.</p>
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
                קראתי והבנתי שאפליקציה זו אינה מחליפה טיפול מקצועי, ואני מסכים/ה לתנאי השימוש
              </label>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-14 rounded-2xl text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 disabled:opacity-30"
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
