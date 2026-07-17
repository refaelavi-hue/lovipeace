import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, Check, Square } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { g, Gender } from '@/lib/genderedText';

interface ComfortableMovementExerciseProps {
  onClose: () => void;
  onComplete: () => void;
}

type MovementType = 'walk' | 'stretch' | 'free';
type Status = 'intro' | 'selection' | 'running' | 'paused' | 'done';

const TOTAL_DURATION = 10 * 60; // 10 minutes in seconds
const CUE_INTERVAL = 90; // change cue every 90 seconds

const CUES: Record<MovementType, string[]> = {
  walk: [
    'שימו לב לקצב שנוח לכם.',
    'הרגישו את המגע של כפות הרגליים עם הקרקע.',
    'אפשר להאט או לעצור בכל רגע.',
  ],
  stretch: [
    'נועו רק עד המקום שבו הגוף מרגיש נוח.',
    'אין צורך להגיע לטווח גדול יותר.',
    'שימו לב לנשימה ולתחושת השחרור.',
  ],
  free: [
    'תנו לגוף לבחור תנועה קטנה.',
    'שימו לב מה מרגיש חי או נעים.',
    'אין צורה נכונה לתנועה הזו.',
  ],
};

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const ComfortableMovementExercise: React.FC<ComfortableMovementExerciseProps> = ({ onClose, onComplete }) => {
  const { profile } = useOnboarding();
  const gender: Gender = (profile.gender as Gender) || 'female';

  const [status, setStatus] = useState<Status>('intro');
  const [movementType, setMovementType] = useState<MovementType | null>(null);
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

  const selectMovement = (type: MovementType) => {
    setMovementType(type);
    setStatus('running');
    setElapsed(0);
  };

  const pause = () => setStatus('paused');
  const resume = () => setStatus('running');
  const finishEarly = () => setStatus('done');
  const stop = () => {
    setStatus('intro');
    setElapsed(0);
    setMovementType(null);
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
          <span className="text-5xl">🧘</span>
          <h1 className="text-2xl font-semibold text-foreground">תנועה נוחה</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            בחרו תנועה שמתאימה לכם עכשיו: הליכה, מתיחות או תנועה חופשית.
          </p>

          <div className="bg-muted/40 rounded-2xl p-4 border border-border/40 w-full">
            <p className="text-sm text-muted-foreground leading-relaxed">
              אין צורך להתאמץ, להגיע למספר מסוים או לבצע את התנועה בצורה מושלמת. שימו לב להבדל בין תנועה שמיטיבה עם הגוף לבין מאמץ שמופעל מתוך לחץ.
            </p>
          </div>

          <button
            onClick={() => setStatus('selection')}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="w-5 h-5" />
            {g(gender, 'לבחור תנועה', 'לבחור תנועה')}
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

  // SELECTION
  if (status === 'selection') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col px-6 py-10 overflow-y-auto" dir="rtl">
        <button
          onClick={() => setStatus('intro')}
          aria-label="חזרה"
          className="self-start text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={28} />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center gap-6">
          <h2 className="text-xl font-semibold text-foreground">איזו תנועה מתאימה לכם?</h2>
          <p className="text-sm text-muted-foreground">
            הבחירה רק מכוונת את ההנחיות. אין שימוש ב-GPS או בהרשאות נוספות.
          </p>

          <div className="w-full space-y-3">
            <button
              onClick={() => selectMovement('walk')}
              className="w-full bg-card border border-border rounded-2xl p-5 text-right hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-2xl ml-3" aria-hidden>🚶</span>
              <span className="text-lg font-semibold text-foreground">הליכה</span>
            </button>
            <button
              onClick={() => selectMovement('stretch')}
              className="w-full bg-card border border-border rounded-2xl p-5 text-right hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-2xl ml-3" aria-hidden>🤸</span>
              <span className="text-lg font-semibold text-foreground">מתיחות</span>
            </button>
            <button
              onClick={() => selectMovement('free')}
              className="w-full bg-card border border-border rounded-2xl p-5 text-right hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-2xl ml-3" aria-hidden>💃</span>
              <span className="text-lg font-semibold text-foreground">תנועה חופשית</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DONE
  if (status === 'done') {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-8 text-center" dir="rtl">
        <span className="text-5xl mb-6">🧘</span>
        <h2 className="text-2xl font-semibold text-foreground mb-3">סיימתם את התנועה.</h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-10">
          המטרה לא הייתה לבצע בצורה מושלמת. רק להקשיב לגוף ולתת לו מעט מקום.
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
  const cues = movementType ? CUES[movementType] : [];
  const cueIndex = Math.floor(elapsed / CUE_INTERVAL) % cues.length;
  const cue = cues[cueIndex] ?? '';
  const isPaused = status === 'paused';

  const movementLabel = {
    walk: 'הליכה',
    stretch: 'מתיחות',
    free: 'תנועה חופשית',
  }[movementType as MovementType];

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
        <div className="text-left">
          <span className="text-xs text-muted-foreground block">{movementLabel}</span>
          <span className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
            נותרו {formatTime(remaining)}
          </span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-primary/60 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 text-center max-w-md mx-auto">
        <span className="text-6xl" aria-hidden>
          {movementType === 'walk' ? '🚶' : movementType === 'stretch' ? '🤸' : '💃'}
        </span>

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
        <p className="text-xs text-muted-foreground/70 text-center max-w-xs">
          אם מופיע כאב, סחרחורת או אי־נוחות, עצרו וחזרו למנוחה.
        </p>

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

export default ComfortableMovementExercise;
