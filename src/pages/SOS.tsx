import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, Home } from 'lucide-react';
import { AppIcon } from '@/components/AppIcon';
import BreathingExercise from '@/components/BreathingExercise';
import { useOnboarding } from '@/hooks/useOnboarding';
import { g } from '@/lib/genderedText';

const GROUNDING_ENCOURAGEMENTS = [
  'יופי. לאט לאט.',
  'מצוין. ממשיכים.',
  'נהדר. עוד קצת.',
  'כמעט שם.',
  'סיימת. כל הכבוד. 💛',
];

const SOS: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useOnboarding();
  const gender = profile.gender || 'female';
  const [activeModule, setActiveModule] = useState<'menu' | 'breathing' | 'grounding' | 'affirmations'>('menu');
  const [groundingStep, setGroundingStep] = useState(0);

  const GROUNDING_STEPS = [
    `5 דברים ש${g(gender, 'את רואה', 'אתה רואה')}`,
    `4 דברים ש${g(gender, 'את שומעת', 'אתה שומע')}`,
    `3 דברים ש${g(gender, 'את מרגישה', 'אתה מרגיש')} במגע`,
    `2 דברים ש${g(gender, 'את מריחה', 'אתה מריח')}`,
    `דבר 1 ש${g(gender, 'את טועמת', 'אתה טועם')}`,
  ];

  const AFFIRMATIONS = [
    `${g(gender, 'את בטוחה', 'אתה בטוח')} כאן ועכשיו.`,
    'הרגע הזה יעבור.',
    `${g(gender, 'את לא לבד', 'אתה לא לבד')} בזה.`,
    'הגוף שלך יודע לחזור לאיזון.',
    `${g(gender, 'נשמי', 'נשום')} — ${g(gender, 'את עושה', 'אתה עושה')} את זה נכון.`,
    `${g(gender, 'את יותר חזקה', 'אתה יותר חזק')} ממה שנראה לך.`,
  ];

  const [affirmationIndex, setAffirmationIndex] = useState(
    () => Math.floor(Math.random() * AFFIRMATIONS.length)
  );

  if (activeModule === 'breathing') {
    return <BreathingExercise onClose={() => setActiveModule('menu')} />;
  }

  const bottomBar = (
    <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border safe-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-6 gap-3">
        <a
          href="tel:1201"
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-destructive/10 border border-destructive/20 py-3 transition-colors hover:bg-destructive/15 active:scale-[0.97]"
        >
          <Phone size={16} className="text-destructive" />
          <span className="text-destructive font-semibold text-sm" dir="ltr">ער״ן 1201</span>
        </a>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-card border border-border py-3 transition-colors hover:bg-muted active:scale-[0.97]"
        >
          <Home size={16} className="text-muted-foreground" />
          <span className="text-foreground text-sm font-medium">חזרה הביתה</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-28" dir="rtl">
      {/* Header */}
      <div className="px-6 pt-8 pb-2 flex items-center gap-4">
        <button
          onClick={() => activeModule === 'menu' ? navigate(-1) : setActiveModule('menu')}
          aria-label="חזרה"
          className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg p-1"
        >
          <ArrowRight size={24} aria-hidden="true" />
        </button>
        <h1 className="text-xl font-semibold text-foreground">
          {activeModule === 'menu' && 'רגע של הרגעה'}
          {activeModule === 'grounding' && 'הארקה — 5-4-3-2-1'}
          {activeModule === 'affirmations' && 'משפטי הרגעה'}
        </h1>
      </div>

      {activeModule === 'menu' && (
        <div className="px-6 pt-2 space-y-5 animate-fade-up">
          {/* Safety line */}
          <p className="text-muted-foreground text-xs text-center" role="note">
            כלי עזר בלבד · אינו מחליף טיפול מקצועי
          </p>

          <p className="text-muted-foreground text-center mb-2">
            {g(gender, 'בחרי', 'בחר')} מה מתאים לך עכשיו
          </p>

          {/* 3 large action cards */}
          <button
            onClick={() => setActiveModule('breathing')}
            className="w-full rounded-3xl bg-primary/10 border-2 border-primary/20 hover:border-primary/40 p-7 text-right flex items-center gap-5 transition-all duration-300 active:scale-[0.97]"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <Wind size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-foreground text-xl font-semibold">נשימה מונחית</h3>
              <p className="text-muted-foreground text-sm mt-1">שאיפה, החזקה, נשיפה</p>
            </div>
          </button>

          <button
            onClick={() => setActiveModule('grounding')}
            className="w-full rounded-3xl bg-primary/10 border-2 border-primary/20 hover:border-primary/40 p-7 text-right flex items-center gap-5 transition-all duration-300 active:scale-[0.97]"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <Mountain size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-foreground text-xl font-semibold">הארקה</h3>
              <p className="text-muted-foreground text-sm mt-1">5-4-3-2-1 לחזרה להווה</p>
            </div>
          </button>

          <button
            onClick={() => setActiveModule('affirmations')}
            className="w-full rounded-3xl bg-accent/10 border-2 border-accent/20 hover:border-accent/40 p-7 text-right flex items-center gap-5 transition-all duration-300 active:scale-[0.97]"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center shrink-0">
              <MessageCircleHeart size={32} className="text-accent" />
            </div>
            <div>
              <h3 className="text-foreground text-xl font-semibold">משפטי הרגעה</h3>
              <p className="text-muted-foreground text-sm mt-1">תזכורות שהכל בסדר</p>
            </div>
          </button>
        </div>
      )}

      {activeModule === 'grounding' && (
        <div className="px-6 pt-8 flex flex-col items-center animate-fade-up">
          {/* Step number - large and clear */}
          <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-6">
            <span className="text-primary text-3xl font-bold">{groundingStep + 1}</span>
          </div>

          <p className="text-foreground text-2xl font-light text-center leading-relaxed mb-3">
            {GROUNDING_STEPS[groundingStep]}
          </p>

          {/* Encouragement line */}
          <p className="text-primary/70 text-sm mb-8">
            {GROUNDING_ENCOURAGEMENTS[groundingStep]}
          </p>

          <p className="text-muted-foreground text-xs mb-6">
            שלב {groundingStep + 1} מתוך 5
          </p>

          <div className="flex gap-2 mb-10">
            {GROUNDING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i <= groundingStep ? 'w-10 bg-primary' : 'w-5 bg-muted'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (groundingStep < 4) {
                setGroundingStep(groundingStep + 1);
              } else {
                setGroundingStep(0);
                setActiveModule('menu');
              }
            }}
            className="w-full max-w-sm h-14 rounded-2xl text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 active:scale-[0.97]"
          >
            {groundingStep < 4 ? 'הבא' : 'סיום ✨'}
          </button>
        </div>
      )}

      {activeModule === 'affirmations' && (
        <div className="px-6 pt-16 flex flex-col items-center animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center mb-12">
            <MessageCircleHeart size={36} className="text-accent" />
          </div>

          <p className="text-foreground text-3xl font-light text-center leading-relaxed max-w-sm mb-16">
            {AFFIRMATIONS[affirmationIndex]}
          </p>

          <button
            onClick={() => setAffirmationIndex((affirmationIndex + 1) % AFFIRMATIONS.length)}
            className="text-primary hover:text-primary/80 transition-colors text-lg underline underline-offset-4"
          >
            משפט נוסף
          </button>
        </div>
      )}

      {bottomBar}
    </div>
  );
};

export default SOS;
