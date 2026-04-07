import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

type Feeling = 'flooding' | 'pressure' | 'restless';
type Phase = 'choose' | 'grounding' | 'breathing' | 'affirmation' | 'done';

const CONTENT: Record<Feeling, { grounding: string; affirmation: string }> = {
  flooding: {
    grounding: 'שים לב לכפות הרגליים שלך על הרצפה. אתה כאן.',
    affirmation: 'הגל עובר. אתה לא הגל.',
  },
  pressure: {
    grounding: 'הרפה את הכתפיים. קח נשימה אחת איטית.',
    affirmation: 'אתה לא חייב לפתור הכל עכשיו.',
  },
  restless: {
    grounding: 'הרגש את הגב שלך נשען. אתה במקום בטוח.',
    affirmation: 'גם חוסר שקט עובר. אתה בסדר.',
  },
};

const BREATHING_PHASES = [
  { label: 'שאיפה...', duration: 4, scale: 1.35 },
  { label: 'החזקה...', duration: 4, scale: 1.35 },
  { label: 'נשיפה...', duration: 6, scale: 1 },
];
const BREATHING_CYCLES = 3;

const QuickRelief: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('choose');
  const [feeling, setFeeling] = useState<Feeling | null>(null);

  // Breathing state
  const [breathIndex, setBreathIndex] = useState(0);
  const [breathCycle, setBreathCycle] = useState(0);
  const [breathTimer, setBreathTimer] = useState(BREATHING_PHASES[0].duration);

  const currentBreath = BREATHING_PHASES[breathIndex];

  const startExercise = (f: Feeling) => {
    setFeeling(f);
    setPhase('grounding');
  };

  // Grounding auto-advance
  useEffect(() => {
    if (phase !== 'grounding') return;
    const t = setTimeout(() => {
      setPhase('breathing');
      setBreathIndex(0);
      setBreathCycle(0);
      setBreathTimer(BREATHING_PHASES[0].duration);
    }, 5000);
    return () => clearTimeout(t);
  }, [phase]);

  // Breathing tick
  useEffect(() => {
    if (phase !== 'breathing') return;
    if (breathTimer <= 0) return;
    const t = setInterval(() => setBreathTimer(p => Math.max(p - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [phase, breathIndex, breathTimer]);

  // Breathing phase advance
  useEffect(() => {
    if (phase !== 'breathing' || breathTimer > 0) return;
    const next = breathIndex + 1;
    if (next < BREATHING_PHASES.length) {
      setBreathIndex(next);
      setBreathTimer(BREATHING_PHASES[next].duration);
    } else {
      const nextCycle = breathCycle + 1;
      if (nextCycle < BREATHING_CYCLES) {
        setBreathCycle(nextCycle);
        setBreathIndex(0);
        setBreathTimer(BREATHING_PHASES[0].duration);
      } else {
        setPhase('affirmation');
      }
    }
  }, [phase, breathTimer, breathIndex, breathCycle]);

  const handleClose = () => navigate(-1);

  // Choose feeling
  if (phase === 'choose') {
    const buttons: { id: Feeling; label: string }[] = [
      { id: 'flooding', label: 'הצפה' },
      { id: 'pressure', label: 'לחץ' },
      { id: 'restless', label: 'חוסר שקט' },
    ];

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-8" dir="rtl">
        <button
          onClick={handleClose}
          aria-label="סגירה"
          className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={24} />
        </button>

        <h1 className="text-2xl font-semibold text-foreground mb-12 text-center">
          איך אתה מרגיש עכשיו?
        </h1>

        <div className="flex flex-col gap-5 w-full max-w-sm">
          {buttons.map((b) => (
            <button
              key={b.id}
              onClick={() => startExercise(b.id)}
              className="w-full rounded-3xl py-7 bg-card border border-border text-foreground text-xl font-medium transition-all duration-300 active:scale-[0.96] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Grounding
  if (phase === 'grounding' && feeling) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-10" dir="rtl">
        <button
          onClick={handleClose}
          aria-label="סגירה"
          className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={24} />
        </button>

        <p className="text-xl text-foreground font-medium text-center leading-relaxed animate-fade-in">
          {CONTENT[feeling].grounding}
        </p>
      </div>
    );
  }

  // Breathing
  if (phase === 'breathing') {
    const progress = 1 - breathTimer / currentBreath.duration;

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center" dir="rtl">
        <button
          onClick={handleClose}
          aria-label="סגירה"
          className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-10">
          {/* Breathing circle */}
          <div
            className="w-36 h-36 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center transition-transform"
            style={{
              transform: `scale(${1 + (currentBreath.scale - 1) * (breathIndex === 2 ? 1 - progress : progress)})`,
              transitionDuration: '1s',
            }}
          >
            <span className="text-primary/60 text-3xl font-light">{breathTimer}</span>
          </div>

          <p className="text-xl text-foreground font-light">{currentBreath.label}</p>

          <p className="text-muted-foreground text-sm">
            {breathCycle + 1} / {BREATHING_CYCLES}
          </p>
        </div>
      </div>
    );
  }

  // Affirmation
  if (phase === 'affirmation' && feeling) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-10" dir="rtl">
        <button
          onClick={handleClose}
          aria-label="סגירה"
          className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={24} />
        </button>

        <p className="text-xl text-foreground font-medium text-center leading-relaxed animate-fade-in mb-12">
          {CONTENT[feeling].affirmation}
        </p>

        <button
          onClick={handleClose}
          className="text-primary text-lg underline underline-offset-4 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          סיום 💛
        </button>
      </div>
    );
  }

  return null;
};

export default QuickRelief;
