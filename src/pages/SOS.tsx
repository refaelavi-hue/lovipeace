import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wind, Mountain, MessageCircleHeart, Phone } from 'lucide-react';
import BreathingExercise from '@/components/BreathingExercise';
import { useOnboarding } from '@/hooks/useOnboarding';
import { g } from '@/lib/genderedText';

const SOS: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useOnboarding();
  const gender = profile.gender;
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
    `הגוף שלך יודע לחזור לאיזון.`,
    `${g(gender, 'נשמי', 'נשום')} — ${g(gender, 'את עושה', 'אתה עושה')} את זה נכון.`,
    `${g(gender, 'את יותר חזקה', 'אתה יותר חזק')} ממה שנראה לך.`,
  ];

  const [affirmationIndex, setAffirmationIndex] = useState(
    () => Math.floor(Math.random() * AFFIRMATIONS.length)
  );

  if (activeModule === 'breathing') {
    return <BreathingExercise onClose={() => setActiveModule('menu')} />;
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="px-6 pt-8 pb-4 flex items-center gap-4">
        <button
          onClick={() => activeModule === 'menu' ? navigate(-1) : setActiveModule('menu')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-semibold text-foreground">
          {activeModule === 'menu' && 'רגע של הרגעה'}
          {activeModule === 'grounding' && 'הארקה — 5-4-3-2-1'}
          {activeModule === 'affirmations' && 'משפטי הרגעה'}
        </h1>
      </div>

      {activeModule === 'menu' && (
        <div className="px-6 pt-4 space-y-4 animate-fade-up">
          <p className="text-muted-foreground mb-6 leading-relaxed">
            הכל בסדר. {g(gender, 'בחרי', 'בחר')} מה {g(gender, 'מרגיש לך', 'מרגיש לך')} נכון עכשיו.
          </p>

          <button
            onClick={() => setActiveModule('breathing')}
            className="w-full rounded-3xl bg-card border-2 border-transparent hover:border-primary/30 p-6 text-right flex items-center gap-5 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <Wind size={28} className="text-primary" />
            </div>
            <div>
              <h3 className="text-foreground text-lg font-semibold">נשימה מונחית</h3>
              <p className="text-muted-foreground text-sm mt-1">4-4-6 — {g(gender, 'שאפי, החזיקי, נשפי', 'שאף, החזק, נשוף')}</p>
            </div>
          </button>

          <button
            onClick={() => setActiveModule('grounding')}
            className="w-full rounded-3xl bg-card border-2 border-transparent hover:border-primary/30 p-6 text-right flex items-center gap-5 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <Mountain size={28} className="text-primary" />
            </div>
            <div>
              <h3 className="text-foreground text-lg font-semibold">הארקה (Grounding)</h3>
              <p className="text-muted-foreground text-sm mt-1">תרגיל 5-4-3-2-1 לחזרה להווה</p>
            </div>
          </button>

          <button
            onClick={() => setActiveModule('affirmations')}
            className="w-full rounded-3xl bg-card border-2 border-transparent hover:border-primary/30 p-6 text-right flex items-center gap-5 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent/15 flex items-center justify-center shrink-0">
              <MessageCircleHeart size={28} className="text-accent" />
            </div>
            <div>
              <h3 className="text-foreground text-lg font-semibold">משפטי הרגעה</h3>
              <p className="text-muted-foreground text-sm mt-1">תזכורות חמות שהכל בסדר</p>
            </div>
          </button>

          <a
            href="tel:1201"
            className="w-full flex items-center gap-3 rounded-2xl bg-destructive/10 border border-destructive/20 p-4 mt-2 transition-colors hover:bg-destructive/15 active:scale-[0.98]"
          >
            <Phone size={18} className="text-destructive shrink-0" />
            <span className="text-sm text-foreground/80 flex-1">במצוקה חריפה? קו ער״ן זמין 24/7</span>
            <span className="text-destructive font-bold text-base" dir="ltr">1201</span>
          </a>
        </div>
      )}

      {activeModule === 'grounding' && (
        <div className="px-6 pt-8 flex flex-col items-center animate-fade-up">
          <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center mb-10">
            <Mountain size={40} className="text-primary" />
          </div>

          <p className="text-foreground text-2xl font-light text-center leading-relaxed mb-4">
            {GROUNDING_STEPS[groundingStep]}
          </p>

          <p className="text-muted-foreground text-sm mb-10">
            שלב {groundingStep + 1} מתוך 5
          </p>

          <div className="flex gap-2 mb-10">
            {GROUNDING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i <= groundingStep ? 'w-8 bg-primary' : 'w-4 bg-muted'
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
            className="w-full max-w-sm h-14 rounded-2xl text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
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
    </div>
  );
};

export default SOS;
