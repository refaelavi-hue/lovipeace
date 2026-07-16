import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, Square, Check } from 'lucide-react';
import BreathingCircleTimer from '@/components/BreathingCircleTimer';

interface LongExhaleExerciseProps {
  onClose: () => void;
  onComplete: () => void;
}

type Phase = 'inhale' | 'exhale';
type Status = 'intro' | 'running' | 'paused' | 'done';

const INHALE = 4;
const EXHALE = 6;
const CYCLE = INHALE + EXHALE;
const DEFAULT_DURATION_SEC = 5 * 60; // 5 minutes

const LongExhaleExercise: React.FC<LongExhaleExerciseProps> = ({ onClose, onComplete }) => {
  const [status, setStatus] = useState<Status>('intro');
  const [elapsed, setElapsed] = useState(0); // seconds since start (running only)
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

  // Compute current phase
  const inCycle = elapsed % CYCLE;
  const isInhale = inCycle < INHALE;
  const phase: Phase = isInhale ? 'inhale' : 'exhale';
  const phaseDuration = isInhale ? INHALE : EXHALE;
  const phaseElapsed = isInhale ? inCycle : inCycle - INHALE;
  const timeLeft = Math.max(0, phaseDuration - phaseElapsed);
  const phaseLabel = isInhale ? 'שאיפה' : 'נשיפה';

  const totalTimeLeft = Math.max(0, totalDuration - elapsed);
  const mm = Math.floor(totalTimeLeft / 60);
  const ss = totalTimeLeft % 60;
  const progressPct = Math.min(100, (elapsed / totalDuration) * 100);

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
          <h1 className="text-2xl font-semibold text-foreground">נשיפה ארוכה</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            תרגול עדין של נשימה בקצב נוח. אין צורך לנשום עמוק או בכוח. אם מופיעה אי־נוחות, חזרו לנשימה הטבעית או עצרו.
          </p>

          <div className="bg-card/60 rounded-2xl p-4 border border-border/50 w-full">
            <p className="text-sm text-muted-foreground mb-2">מחזור נשימה</p>
            <div className="flex items-center justify-center gap-6 text-foreground">
              <div>
                <p className="text-2xl font-semibold">4</p>
                <p className="text-xs text-muted-foreground">שנ׳ שאיפה</p>
              </div>
              <span className="text-muted-foreground">·</span>
              <div>
                <p className="text-2xl font-semibold">6</p>
                <p className="text-xs text-muted-foreground">שנ׳ נשיפה</p>
              </div>
              <span className="text-muted-foreground">·</span>
              <div>
                <p className="text-2xl font-semibold">5</p>
                <p className="text-xs text-muted-foreground">דקות</p>
              </div>
            </div>
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
          אין צורך להרגיש אחרת מיד. עצם העצירה והתרגול הם צעד.
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

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <BreathingCircleTimer
          type={phase}
          duration={phaseDuration}
          timeLeft={Math.ceil(timeLeft)}
          shape="circle"
        />
        <div className="text-center">
          <p className="text-3xl font-light text-foreground mb-2" aria-live="polite">{phaseLabel}</p>
          <p className="text-muted-foreground text-base tabular-nums">
            {Math.ceil(timeLeft)} שנ׳
          </p>
        </div>
        {status === 'paused' && (
          <p className="text-sm text-muted-foreground">התרגול מושהה</p>
        )}
      </div>

      <div className="flex flex-col gap-3 items-center">
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

export default LongExhaleExercise;
