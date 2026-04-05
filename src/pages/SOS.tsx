import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Wind, Mountain, MessageCircleHeart } from 'lucide-react';
import BreathingExercise from '@/components/BreathingExercise';

const GROUNDING_STEPS = [
  '5 דברים שאת רואה',
  '4 דברים שאת שומעת',
  '3 דברים שאת מרגישה במגע',
  '2 דברים שאת מריחה',
  'דבר 1 שאת טועמת',
];

const AFFIRMATIONS = [
  'את בטוחה כאן ועכשיו.',
  'הרגע הזה יעבור.',
  'את לא לבד בזה.',
  'הגוף שלך יודע לחזור לאיזון.',
  'נשמי — את עושה את זה נכון.',
  'את יותר חזקה ממה שנראה לך.',
];

const SOS: React.FC = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<'menu' | 'breathing' | 'grounding' | 'affirmations'>('menu');
  const [groundingStep, setGroundingStep] = useState(0);
  const [affirmationIndex, setAffirmationIndex] = useState(
    () => Math.floor(Math.random() * AFFIRMATIONS.length)
  );

  if (activeModule === 'breathing') {
    return <BreathingExercise onClose={() => setActiveModule('menu')} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            הכל בסדר. בחרי מה מרגיש לך נכון עכשיו.
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
              <p className="text-muted-foreground text-sm mt-1">4-4-6 — שאפי, החזיקי, נשפי</p>
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
