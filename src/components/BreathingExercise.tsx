import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import BreathingCircleTimer from '@/components/BreathingCircleTimer';

interface BreathingExerciseProps {
  onClose: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';
type DurationMode = 'short' | 'regular' | 'long';

const PHASES: { phase: Phase; duration: number; label: string; type: 'inhale' | 'exhale' | 'hold' | 'pause' }[] = [
  { phase: 'inhale', duration: 4, label: 'שאפי...', type: 'inhale' },
  { phase: 'hold', duration: 4, label: 'החזיקי...', type: 'hold' },
  { phase: 'exhale', duration: 6, label: 'נשפי...', type: 'exhale' },
  { phase: 'rest', duration: 2, label: 'נוחי...', type: 'pause' },
];

const MAX_CYCLES: Record<DurationMode, number> = {
  short: 3,
  regular: 6,
  long: 10,
};

const DURATION_OPTIONS: { id: DurationMode; label: string; desc: string }[] = [
  { id: 'short', label: 'קצר', desc: '~1 דק׳' },
  { id: 'regular', label: 'רגיל', desc: '~2 דק׳' },
  { id: 'long', label: 'ארוך', desc: '~4 דק׳' },
];

const DURATION_KEY = 'preferred-duration';

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose }) => {
  const [durationMode, setDurationMode] = useState<DurationMode>(
    () => (localStorage.getItem(DURATION_KEY) as DurationMode) || 'regular'
  );
  const [started, setStarted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PHASES[0].duration);
  const [done, setDone] = useState(false);

  const maxCycles = MAX_CYCLES[durationMode];
  const currentPhase = PHASES[phaseIndex];

  const handleStart = (mode: DurationMode) => {
    setDurationMode(mode);
    localStorage.setItem(DURATION_KEY, mode);
    setStarted(true);
  };

  const nextPhase = useCallback(() => {
    setPhaseIndex(prev => {
      const next = (prev + 1) % PHASES.length;
      if (next === 0) {
        setCycles(c => {
          const newC = c + 1;
          if (newC >= maxCycles) {
            setDone(true);
          }
          return newC;
        });
      }
      setTimeLeft(PHASES[next].duration);
      return next;
    });
  }, [maxCycles]);

  useEffect(() => {
    if (!started || done || timeLeft > 0) return;
    nextPhase();
  }, [nextPhase, timeLeft, started, done]);

  useEffect(() => {
    if (!started || done || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseIndex, timeLeft, started, done]);

  if (!started) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-8" dir="rtl">
        <button
          onClick={onClose}
          aria-label="סגירה"
          className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg p-1"
        >
          <X size={28} />
        </button>

        <h2 className="text-2xl font-semibold text-foreground mb-2">נשימה מונחית</h2>
        <p className="text-muted-foreground mb-8">כמה זמן יש לך?</p>

        <div className="flex gap-3 w-full max-w-xs">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleStart(opt.id)}
              className={`flex-1 rounded-2xl py-4 px-2 text-center transition-all duration-200 ${
                durationMode === opt.id
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-card border-2 border-transparent hover:border-primary/20'
              }`}
            >
              <span className="text-foreground text-sm font-semibold block">{opt.label}</span>
              <span className="text-muted-foreground text-xs">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-8">
        <span className="text-5xl mb-6">✨</span>
        <p className="text-xl text-foreground font-medium text-center mb-2">כל הכבוד</p>
        <p className="text-muted-foreground text-center mb-10">{cycles} סבבים של נשימה. מרגישים את ההבדל?</p>
        <button
          onClick={onClose}
          className="text-primary hover:opacity-80 transition-opacity text-lg underline underline-offset-4"
        >
          סיום
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        aria-label="סגירה"
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg p-1"
      >
        <X size={28} />
      </button>

      <div className="flex flex-col items-center gap-8">
        <BreathingCircleTimer
          key={phaseIndex}
          type={currentPhase.type}
          duration={currentPhase.duration}
          timeLeft={timeLeft}
          label={currentPhase.label}
        />

        <div className="text-center">
          <p className="text-2xl font-light text-foreground mb-2">{currentPhase.label}</p>
          <p className="text-muted-foreground text-sm">
            סבב {cycles + 1} מתוך {maxCycles}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute bottom-20 text-muted-foreground hover:text-foreground transition-colors text-sm underline underline-offset-4"
      >
        סיום התרגיל
      </button>
    </div>
  );
};

export default BreathingExercise;
