import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { g, Gender } from '@/lib/genderedText';

type Feeling = 'flooding' | 'pressure' | 'restless';
type Phase = 'choose' | 'grounding' | 'breathing' | 'affirmation';

/* ── Gendered content builders ── */
function getFloodingGrounding(gender: Gender): string[] {
  return [
    g(gender, 'עצרי רגע.', 'עצור רגע.'),
    g(gender, 'את כאן.', 'אתה כאן.'),
    g(gender, 'שימי לב לשתי כפות הרגליים שלך.', 'שים לב לשתי כפות הרגליים שלך.'),
    g(gender, 'הרגישי את המגע שלהן עם הרצפה.', 'הרגש את המגע שלהן עם הרצפה.'),
    g(gender, 'אין לך מה לפתור עכשיו.', 'אין לך מה לפתור עכשיו.'),
    'רק להיות כאן לעוד רגע אחד.',
  ];
}

function getFloodingAffirmation(gender: Gender): string[] {
  return [
    g(gender, 'את לא חייבת להחזיק את הכל עכשיו.', 'אתה לא חייב להחזיק את הכל עכשיו.'),
    'הרגע הזה עובר.',
    g(gender, 'הגוף שלך יכול לחזור לאט לאיזון.', 'הגוף שלך יכול לחזור לאט לאיזון.'),
    'בינתיים, רק עוד נשימה אחת.',
  ];
}

function getRestlessBreathing(gender: Gender) {
  return [
    { label: g(gender, 'הרגישי את האוויר נכנס...', 'הרגש את האוויר נכנס...'), duration: 4, scale: 1.3 },
    { label: 'הבטן עולה...', duration: 2, scale: 1.3 },
    { label: 'והאוויר יוצא...', duration: 5, scale: 1 },
    { label: 'והבטן יורדת...', duration: 2, scale: 1 },
  ];
}

function getContent(gender: Gender): Record<Feeling, { grounding: string[]; affirmation: string[] }> {
  return {
    flooding: {
      grounding: getFloodingGrounding(gender),
      affirmation: getFloodingAffirmation(gender),
    },
    pressure: {
      grounding: [
        g(gender, 'עצרי לרגע.', 'עצור לרגע.'),
        g(gender, 'את לא חייבת לרוץ עכשיו.', 'אתה לא חייב לרוץ עכשיו.'),
        g(gender, 'הרפי את הכתפיים.', 'הרפה את הכתפיים.'),
        g(gender, 'הרפי את הלסת.', 'הרפה את הלסת.'),
        g(gender, 'קחי נשימה אחת איטית.', 'קח נשימה אחת איטית.'),
        g(gender, 'את בטוחה כאן.', 'אתה בטוח כאן.'),
      ],
      affirmation: [
        g(gender, 'את לא חייבת לפתור הכל עכשיו.', 'אתה לא חייב לפתור הכל עכשיו.'),
        g(gender, 'מותר לך לעצור.', 'מותר לך לעצור.'),
        g(gender, 'את עושה מספיק.', 'אתה עושה מספיק.'),
        g(gender, 'תני לגוף לנוח רגע.', 'תן לגוף לנוח רגע.'),
      ],
    },
    restless: {
      grounding: [
        g(gender, 'הגוף שלך קצת חסר שקט עכשיו.', 'הגוף שלך קצת חסר שקט עכשיו.'),
        'זה בסדר.',
        g(gender, 'שימי לב לידיים שלך.', 'שים לב לידיים שלך.'),
        g(gender, 'שימי לב לרגליים.', 'שים לב לרגליים.'),
        g(gender, 'את בתוך הגוף שלך.', 'אתה בתוך הגוף שלך.'),
      ],
      affirmation: [
        g(gender, 'את לא צריכה להיות רגועה לגמרי.', 'אתה לא צריך להיות רגוע לגמרי.'),
        g(gender, 'רק קצת יותר נוכחת.', 'רק קצת יותר נוכח.'),
        'וזה כבר קורה עכשיו.',
      ],
    },
  };
}

/* ── Breathing config ── */
const FLOODING_BREATHING = [
  { label: 'שאיפה...', duration: 4, scale: 1.35 },
  { label: 'נשיפה...', duration: 6, scale: 1 },
];
const FLOODING_CYCLES = 4;

const PRESSURE_BREATHING = [
  { label: 'שאיפה...', duration: 4, scale: 1.3 },
  { label: 'החזקה...', duration: 7, scale: 1.3 },
  { label: 'נשיפה...', duration: 8, scale: 1 },
];
const PRESSURE_CYCLES = 3;

const RESTLESS_CYCLES = 3;

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
  const { profile } = useOnboarding();
  const gender = profile.gender || '';
  const content = getContent(gender);

  const [phase, setPhase] = useState<Phase>('choose');
  const [feeling, setFeeling] = useState<Feeling | null>(null);

  // Breathing state
  const [breathIndex, setBreathIndex] = useState(0);
  const [breathCycle, setBreathCycle] = useState(0);
  const [breathTimer, setBreathTimer] = useState(0);

  // Ambient sound
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  const restlessBreathing = getRestlessBreathing(gender);
  const breathingPhases = feeling === 'flooding' ? FLOODING_BREATHING : feeling === 'restless' ? restlessBreathing : feeling === 'pressure' ? PRESSURE_BREATHING : DEFAULT_BREATHING;
  const maxCycles = feeling === 'flooding' ? FLOODING_CYCLES : feeling === 'restless' ? RESTLESS_CYCLES : feeling === 'pressure' ? PRESSURE_CYCLES : DEFAULT_CYCLES;
  const currentBreath = breathingPhases[breathIndex];

  // Voice cue sounds
  const inhaleAudioRef = useRef<HTMLAudioElement | null>(null);
  const exhaleAudioRef = useRef<HTMLAudioElement | null>(null);
  const exhaleAltRef = useRef<HTMLAudioElement | null>(null);
  const thankYouRef = useRef<HTMLAudioElement | null>(null);
  const useAltExhale = useRef(false);

  // Start/stop ambient sound with exercise
  useEffect(() => {
    if (phase === 'grounding' || phase === 'breathing') {
      if (!ambientRef.current) {
        ambientRef.current = new Audio('/audio/tibetan-bowl.mp3');
        ambientRef.current.loop = true;
        ambientRef.current.volume = 0.3;
      }
      ambientRef.current.play().catch(() => {});
    }
    if (phase === 'choose' || phase === 'affirmation') {
      if (ambientRef.current) {
        ambientRef.current.pause();
        ambientRef.current.currentTime = 0;
      }
    }
    return () => {
      if (ambientRef.current) {
        ambientRef.current.pause();
        ambientRef.current.currentTime = 0;
      }
    };
  }, [phase]);

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

  const handleClose = () => {
    if (ambientRef.current) {
      ambientRef.current.pause();
      ambientRef.current.currentTime = 0;
    }
    navigate(-1);
  };

  const questionText = g(gender, 'איך את מרגישה עכשיו?', 'איך אתה מרגיש עכשיו?');

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
          {questionText}
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
    const lines = content[feeling].grounding;
    const duration = feeling === 'flooding' ? 12 : 10;

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
    const isExhale = currentBreath.label.includes('נשיפה') || currentBreath.label.includes('יוצא') || currentBreath.label.includes('יורדת');

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
    const lines = content[feeling].affirmation;

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
