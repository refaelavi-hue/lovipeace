import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, Square, Check } from 'lucide-react';

interface MindfulBreathingExerciseProps {
  onClose: () => void;
  onComplete: () => void;
}

type Status = 'intro' | 'running' | 'paused' | 'done';

const DEFAULT_DURATION_SEC = 7 * 60; // 7 minutes
const PROMPT_INTERVAL = 60; // seconds

const PROMPTS = [
  'שימו לב לתחושת האוויר כשהוא נכנס.',
  'שימו לב לתחושת האוויר כשהוא יוצא.',
  'הבחינו בתנועה העדינה של הגוף בזמן הנשימה.',
  'אם המחשבה נודדת, שימו לב לכך וחזרו בעדינות לנשימה.',
  'אין צורך לנשום בצורה מסוימת. רק להיות עם הנשימה.',
  'שימו לב אם יש רגע קטן של מרחב בין נשימה לנשימה.',
  'אפשר להישאר עוד רגע עם מה שנוכח עכשיו.',
];

const MindfulBreathingExercise: React.FC<MindfulBreathingExerciseProps> = ({ onClose, onComplete }) => {
  const [status, setStatus] = useState<Status>('intro');
  const [elapsed, setElapsed] = useState(0);
  const totalDuration = DEFAULT_DURATION_SEC;
  const intervalRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  useEffect(() => {
    if (status !== 'running') return;
    intervalRef.current = window.setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next >= totalDuration) {
          clearTimer();
          setStatus('done');
          return totalDuration;
        }
        return next;
      });
    }, 1000);
    return () => clearTimer();
  }, [status, totalDuration]);

  const start = () => {
    setElapsed(0);
    setStatus('running');
  };
  const pause = () => setStatus('paused');
  const resume = () => setStatus('running');
  const stop = () => {
    clearTimer();
    setStatus('intro');
    setElapsed(0);
  };

  const handleFinishEarly = () => {
    clearTimer();
    setStatus('done');
  };

  const handleMarkComplete = useCallback(() => {
    onComplete();
    onClose();
  }, [onClose, onComplete]);

  const totalTimeLeft = Math.max(0, totalDuration - elapsed);
  const mm = Math.floor(totalTimeLeft / 60);
  const ss = totalTimeLeft % 60;
  const progressPct = Math.min(100, (elapsed / totalDuration) * 100);

  const promptIndex = Math.min(
    Math.floor(elapsed / PROMPT_INTERVAL),
    PROMPTS.length - 1
  );
  const currentPrompt = PROMPTS[promptIndex];

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
          <span className="text-5xl">🌬️</span>
          <h1 className="text-2xl font-semibold text-foreground">קשב לנשימה</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            בתרגול הזה לא צריך לשנות את הנשימה. רק לשים לב אליה כפי שהיא, ברגע הזה.
          </p>
          <div className="bg-card/60 rounded-2xl p-4 border border-border/50 w-full">
            <p className="text-sm text-muted-foreground leading-relaxed">
              אם הנשימה משתנה מעצמה, זה בסדר. אין צורך לתקן אותה.
            </p>
          </div>

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
        <span className="text-5xl mb-6">🌿</span>
        <h2 className="text-2xl font-semibold text-foreground mb-3">סיימתם את התרגול.</h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-10">
          לא הייתם צריכים לשנות את הנשימה. רק לשים לב — וזה מספיק לרגע הזה.
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
          נותרו {mm}:{ss.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-primary/60 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-10">
        {/* Subtle ambient shape — not a breath pacing guide */}
        <div
          className={`w-40 h-40 rounded-full bg-primary/10 transition-transform ease-in-out ${
            status === 'running' ? 'scale-100 opacity-100' : 'scale-90 opacity-70'
          }`}
          style={{ transitionDuration: '3000ms' }}
          aria-hidden="true"
        />

        <div className="text-center px-4">
          <p
            className="text-xl leading-relaxed text-foreground min-h-[3.5rem]"
            aria-live="polite"
            key={promptIndex}
          >
            {currentPrompt}
          </p>
        </div>

        {status === 'paused' && (
          <p className="text-sm text-muted-foreground">התרגול מושהה</p>
        )}
      </div>

      <div className="flex flex-col gap-3 items-center">
        <p className="text-xs text-muted-foreground/70 text-center max-w-xs">
          אם מופיעה אי־נוחות, חזרו לנשימה הטבעית או עצרו.
        </p>

        <div className="flex items-center gap-3 w-full max-w-sm">
          {status === 'running' ? (
            <button
              onClick={pause}
              className="flex-1 bg-card border border-border rounded-2xl py-4 text-base font-semibold text-foreground flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
              aria-label="השהיה"
            >
              <Pause className="w-5 h-5" />
              השהיה
            </button>
          ) : (
            <button
              onClick={resume}
              className="flex-1 bg-primary text-primary-foreground rounded-2xl py-4 text-base font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              aria-label="המשך"
            >
              <Play className="w-5 h-5" />
              המשך
            </button>
          )}
          <button
            onClick={stop}
            className="flex-1 bg-card border border-border rounded-2xl py-4 text-base font-semibold text-foreground flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
            aria-label="עצירה"
          >
            <Square className="w-5 h-5" />
            עצירה
          </button>
        </div>
        <button
          onClick={handleFinishEarly}
          className="text-primary text-sm underline underline-offset-4 py-2"
        >
          סיום התרגול
        </button>
      </div>
    </div>
  );
};

export default MindfulBreathingExercise;
