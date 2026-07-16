import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, Check, Square } from 'lucide-react';

interface MindfulWalkExerciseProps {
  onClose: () => void;
  onComplete: () => void;
}

type Status = 'intro' | 'running' | 'paused' | 'done';

const TOTAL_DURATION = 10 * 60; // 10 minutes in seconds
const CUE_INTERVAL = 90; // change cue every 90 seconds

const CUES: string[] = [
  'שימו לב למגע כפות הרגליים עם הקרקע.',
  'שימו לב לקצב הצעדים.',
  'הבחינו בשלושה דברים שאתם רואים סביבכם.',
  'שימו לב לאוויר על העור.',
  'אפשר לחזור בעדינות לתחושת ההליכה.',
];

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const MindfulWalkExercise: React.FC<MindfulWalkExerciseProps> = ({ onClose, onComplete }) => {
  const [status, setStatus] = useState<Status>('intro');
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= TOTAL_DURATION) {
            setStatus('done');
            return TOTAL_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  const start = () => {
    setElapsed(0);
    setStatus('running');
  };
  const pause = () => setStatus('paused');
  const resume = () => setStatus('running');
  const finishEarly = () => setStatus('done');
  const stop = () => {
    setStatus('intro');
    setElapsed(0);
  };

  const handleMarkComplete = useCallback(() => {
    onComplete();
    onClose();
  }, [onClose, onComplete]);

  // INTRO
  if (status === 'intro') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col px-6 py-10 overflow-y-auto" dir="rtl">
        <button
          onClick={onClose}
          aria-label="סגירה"
          className="self-start text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={28} />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center gap-6">
          <span className="text-5xl">🚶</span>
          <h1 className="text-2xl font-semibold text-foreground">הליכה מודעת</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            הליכה קצרה בקצב נוח, עם תשומת לב לצעדים, לגוף ולסביבה.
          </p>

          <div className="bg-muted/40 rounded-2xl p-4 border border-border/40 w-full">
            <p className="text-sm text-muted-foreground leading-relaxed">
              אין צורך ללכת מהר, להגיע למקום מסוים או לשנות את מצב הרוח.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">משך התרגול: 10 דקות</p>

          <button
            onClick={start}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="w-5 h-5" />
            להתחיל
          </button>
          <button
            onClick={onClose}
            className="text-muted-foreground text-sm underline underline-offset-4"
          >
            לא עכשיו
          </button>
        </div>
      </div>
    );
  }

  // DONE
  if (status === 'done') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-8 text-center" dir="rtl">
        <span className="text-5xl mb-6">🚶</span>
        <h2 className="text-2xl font-semibold text-foreground mb-3">סיימתם את ההליכה המודעת.</h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-10">
          אפשר לקחת איתכם את תשומת הלב הזו גם לצעד הבא.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={handleMarkComplete}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-base font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Check className="w-5 h-5" />
            סימון כהושלם
          </button>
          <button
            onClick={onClose}
            className="text-muted-foreground text-sm underline underline-offset-4 py-2"
          >
            סגירה בלי לסמן
          </button>
        </div>
      </div>
    );
  }

  // RUNNING / PAUSED
  const remaining = TOTAL_DURATION - elapsed;
  const progressPct = (elapsed / TOTAL_DURATION) * 100;
  const cueIndex = Math.floor(elapsed / CUE_INTERVAL) % CUES.length;
  const cue = CUES[cueIndex];
  const isPaused = status === 'paused';

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col px-6 py-10" dir="rtl">
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          aria-label="סגירה"
          className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={28} />
        </button>
        <span className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
          נותרו {formatTime(remaining)}
        </span>
      </div>

      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-primary/60 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center max-w-md mx-auto">
        <span className="text-6xl" aria-hidden>🚶</span>

        <div
          className="w-40 h-40 rounded-full bg-primary/10 flex items-center justify-center"
          aria-hidden
        >
          <span className="text-4xl font-light text-primary tabular-nums">
            {formatTime(remaining)}
          </span>
        </div>

        <p
          key={cueIndex}
          className="text-xl leading-relaxed text-foreground transition-opacity duration-700"
          aria-live="polite"
        >
          {cue}
        </p>

        {isPaused && (
          <p className="text-sm text-muted-foreground">התרגול מושהה</p>
        )}
      </div>

      <div className="flex flex-col gap-3 items-center">
        {isPaused ? (
          <button
            onClick={resume}
            className="w-full max-w-sm bg-primary text-primary-foreground rounded-2xl py-4 text-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="w-5 h-5" />
            המשך
          </button>
        ) : (
          <button
            onClick={pause}
            className="w-full max-w-sm bg-primary text-primary-foreground rounded-2xl py-4 text-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Pause className="w-5 h-5" />
            השהיה
          </button>
        )}
        <div className="flex items-center gap-3 w-full max-w-sm">
          <button
            onClick={finishEarly}
            className="flex-1 bg-card border border-border rounded-2xl py-3 text-sm font-medium text-foreground flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
            aria-label="סיום מוקדם"
          >
            <Check className="w-4 h-4" />
            סיום מוקדם
          </button>
          <button
            onClick={stop}
            className="flex-1 bg-card border border-border rounded-2xl py-3 text-sm font-medium text-foreground flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
            aria-label="עצירה"
          >
            <Square className="w-4 h-4" />
            עצירה
          </button>
        </div>
      </div>
    </div>
  );
};

export default MindfulWalkExercise;
