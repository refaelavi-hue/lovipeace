import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

type Feeling = 'flooding' | 'pressure' | 'restless';
type Phase = 'choose' | 'grounding' | 'breathing' | 'affirmation';

/* ── Flooding-specific content ── */
const FLOODING_GROUNDING_LINES = [
  'עצור רגע.',
  'אתה כאן.',
  'שים לב לשתי כפות הרגליים שלך.',
  'הרגש את המגע שלהן עם הרצפה.',
  'אין לך מה לפתור עכשיו.',
  'רק להיות כאן לעוד רגע אחד.',
];

const FLOODING_AFFIRMATION_LINES = [
  'אתה לא חייב להחזיק את הכל עכשיו.',
  'הרגע הזה עובר.',
  'הגוף שלך יכול לחזור לאט לאיזון.',
  'בינתיים, רק עוד נשימה אחת.',
];

/* ── Generic fallback content for other feelings ── */
const CONTENT: Record<Feeling, { grounding: string[]; affirmation: string[] }> = {
  flooding: {
    grounding: FLOODING_GROUNDING_LINES,
    affirmation: FLOODING_AFFIRMATION_LINES,
  },
  pressure: {
    grounding: ['הרפה את הכתפיים.', 'קח נשימה אחת איטית.', 'אתה בטוח כאן.'],
    affirmation: ['אתה לא חייב לפתור הכל עכשיו.', 'מותר לך לעצור.'],
  },
  restless: {
    grounding: ['הרגש את הגב שלך נשען.', 'אתה במקום בטוח.', 'הכל בסדר.'],
    affirmation: ['גם חוסר שקט עובר.', 'אתה בסדר.'],
  },
};

/* ── Breathing config (flooding: no hold, 4 cycles) ── */
const FLOODING_BREATHING = [
  { label: 'שאיפה...', duration: 4, scale: 1.35 },
  { label: 'נשיפה...', duration: 6, scale: 1 },
];
const FLOODING_CYCLES = 4;

const DEFAULT_BREATHING = [
  { label: 'שאיפה...', duration: 4, scale: 1.35 },
  { label: 'החזקה...', duration: 4, scale: 1.35 },
  { label: 'נשיפה...', duration: 6, scale: 1 },
];
const DEFAULT_CYCLES = 3;

/* ── Line-by-line reveal component ── */
const RevealLines: React.FC<{
  lines: string[];
  totalDuration: number;
  onDone: () => void;
}> = ({ lines, totalDuration, onDone }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const interval = totalDuration / lines.length;

  useEffect(() => {
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), interval * 1000 * i));
    });
    timers.push(setTimeout(onDone, totalDuration * 1000));
    return () => timers.forEach(clearTimeout);
  }, [lines, totalDuration, onDone]);

  return (
    <div className="flex flex-col items-center gap-4 px-2">
      {lines.map((line, i) => (
        <p
          key={i}
          className="text-xl text-foreground font-medium text-center leading-relaxed transition-all duration-700"
          style={{ opacity: i < visibleCount ? 1 : 0, transform: i < visibleCount ? 'translateY(0)' : 'translateY(8px)' }}
        >
          {line}
        </p>
      ))}
    </div>
  );
};

/* ── Close button ── */
const CloseBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    aria-label="סגירה"
    className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  >
    <X size={24} />
  </button>
);

/* ── Main component ── */
const QuickRelief: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('choose');
  const [feeling, setFeeling] = useState<Feeling | null>(null);

  // Breathing state
  const [breathIndex, setBreathIndex] = useState(0);
  const [breathCycle, setBreathCycle] = useState(0);
  const [breathTimer, setBreathTimer] = useState(0);

  const breathingPhases = feeling === 'flooding' ? FLOODING_BREATHING : DEFAULT_BREATHING;
  const maxCycles = feeling === 'flooding' ? FLOODING_CYCLES : DEFAULT_CYCLES;
  const currentBreath = breathingPhases[breathIndex];

  const startExercise = (f: Feeling) => {
    setFeeling(f);
    setPhase('grounding');
  };

  const startBreathing = () => {
    setPhase('breathing');
    setBreathIndex(0);
    setBreathCycle(0);
    setBreathTimer(breathingPhases[0].duration);
  };

  // Breathing tick
  useEffect(() => {
    if (phase !== 'breathing' || breathTimer <= 0) return;
    const t = setInterval(() => setBreathTimer(p => Math.max(p - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [phase, breathIndex, breathTimer]);

  // Breathing phase advance
  useEffect(() => {
    if (phase !== 'breathing' || breathTimer > 0) return;
    const next = breathIndex + 1;
    if (next < breathingPhases.length) {
      setBreathIndex(next);
      setBreathTimer(breathingPhases[next].duration);
    } else {
      const nextCycle = breathCycle + 1;
      if (nextCycle < maxCycles) {
        setBreathCycle(nextCycle);
        setBreathIndex(0);
        setBreathTimer(breathingPhases[0].duration);
      } else {
        setPhase('affirmation');
      }
    }
  }, [phase, breathTimer, breathIndex, breathCycle, breathingPhases, maxCycles]);

  const handleClose = () => navigate(-1);

  /* ── Choose ── */
  if (phase === 'choose') {
    const buttons: { id: Feeling; label: string }[] = [
      { id: 'flooding', label: 'הצפה' },
      { id: 'pressure', label: 'לחץ' },
      { id: 'restless', label: 'חוסר שקט' },
    ];

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-8" dir="rtl">
        <CloseBtn onClick={handleClose} />
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

  /* ── Grounding (line-by-line reveal) ── */
  if (phase === 'grounding' && feeling) {
    const lines = CONTENT[feeling].grounding;
    const duration = feeling === 'flooding' ? 12 : 8;

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-10" dir="rtl">
        <CloseBtn onClick={handleClose} />
        <RevealLines lines={lines} totalDuration={duration} onDone={startBreathing} />
      </div>
    );
  }

  /* ── Breathing ── */
  if (phase === 'breathing' && currentBreath) {
    const progress = 1 - breathTimer / currentBreath.duration;
    const isExhale = currentBreath.label.includes('נשיפה');

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center" dir="rtl">
        <CloseBtn onClick={handleClose} />
        <div className="flex flex-col items-center gap-10">
          <div
            className="w-36 h-36 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center transition-transform"
            style={{
              transform: `scale(${1 + (currentBreath.scale - 1) * (isExhale ? 1 - progress : progress)})`,
              transitionDuration: '1s',
            }}
          >
            <span className="text-primary/60 text-3xl font-light">{breathTimer}</span>
          </div>
          <p className="text-xl text-foreground font-light">{currentBreath.label}</p>
          <p className="text-muted-foreground text-sm">
            {breathCycle + 1} / {maxCycles}
          </p>
        </div>
      </div>
    );
  }

  /* ── Affirmation (line-by-line reveal + finish button) ── */
  if (phase === 'affirmation' && feeling) {
    const lines = CONTENT[feeling].affirmation;

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-10" dir="rtl">
        <CloseBtn onClick={handleClose} />
        <RevealLines lines={lines} totalDuration={lines.length * 2.5} onDone={() => {}} />
        <button
          onClick={handleClose}
          className="mt-14 text-primary text-lg underline underline-offset-4 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded animate-fade-in"
          style={{ animationDelay: `${lines.length * 2.5}s`, animationFillMode: 'backwards' }}
        >
          סיום 💛
        </button>
      </div>
    );
  }

  return null;
};

export default QuickRelief;
