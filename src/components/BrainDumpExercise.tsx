import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, Check, Square } from 'lucide-react';

interface BrainDumpExerciseProps {
  onClose: () => void;
  onComplete: () => void;
}

type Status = 'intro' | 'writing' | 'done';

const DEFAULT_DURATION_SEC = 5 * 60;
const DRAFT_KEY = 'brain-dump-draft-week1';

const PROMPTS = [
  'מה נמצא בי עכשיו?',
  'מה הייתי רוצה להניח לרגע בצד?',
  'מה הגוף שלי מנסה לומר לי?',
];

const BrainDumpExercise: React.FC<BrainDumpExerciseProps> = ({ onClose, onComplete }) => {
  const [status, setStatus] = useState<Status>('intro');
  const [text, setText] = useState<string>(() => {
    try {
      return localStorage.getItem(DRAFT_KEY) || '';
    } catch {
      return '';
    }
  });
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const totalDuration = DEFAULT_DURATION_SEC;
  const intervalRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  useEffect(() => () => clearTimer(), []);

  // persist draft
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, text);
    } catch {
      /* ignore */
    }
  }, [text]);

  // timer tick
  useEffect(() => {
    if (!timerRunning) return;
    intervalRef.current = window.setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        if (next >= totalDuration) {
          clearTimer();
          setTimerRunning(false);
          return totalDuration;
        }
        return next;
      });
    }, 1000);
    return () => clearTimer();
  }, [timerRunning, totalDuration]);

  const startWriting = () => {
    setStatus('writing');
    setElapsed(0);
    setTimerRunning(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };
  const pauseTimer = () => setTimerRunning(false);
  const resumeTimer = () => setTimerRunning(true);
  const finish = () => {
    clearTimer();
    setTimerRunning(false);
    setStatus('done');
  };

  const insertPrompt = (prompt: string) => {
    setText(prev => {
      const prefix = prev.trim().length > 0 ? prev.replace(/\s+$/, '') + '\n\n' : '';
      return prefix + prompt + '\n';
    });
    setTimeout(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }, 0);
  };

  const handleMarkComplete = useCallback(() => {
    onComplete();
    onClose();
  }, [onClose, onComplete]);

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
          <span className="text-5xl">✍️</span>
          <h1 className="text-2xl font-semibold text-foreground">דף פריקה</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            כמה דקות שבהן אפשר לכתוב את מה שנמצא בתוככם עכשיו, בלי לסדר, להסביר או לנסח יפה.
          </p>
          <div className="bg-muted/40 rounded-2xl p-4 border border-border/40 w-full">
            <p className="text-sm text-muted-foreground leading-relaxed">
              אין צורך למצוא פתרון. פשוט לתת למחשבות מקום.
            </p>
          </div>

          <button
            onClick={startWriting}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Play className="w-5 h-5" />
            להתחיל לכתוב
          </button>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            הכתיבה נשמרת מקומית במכשיר בלבד. שום דבר לא נשלח לשרת.
          </p>
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
        <h2 className="text-2xl font-semibold text-foreground mb-3">סיימתם את הכתיבה.</h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-10">
          לא צריך לקרוא מחדש או לנתח עכשיו. אפשר פשוט להניח לדף להיות.
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

  // WRITING
  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col px-5 py-6" dir="rtl">
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

      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-3">
        <div
          className="h-full bg-primary/60 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => insertPrompt(p)}
            className="text-xs bg-card border border-border rounded-full px-3 py-1.5 text-foreground hover:bg-muted/50 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      <label htmlFor="brain-dump-textarea" className="sr-only">אזור כתיבה</label>
      <textarea
        id="brain-dump-textarea"
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="כתבו כאן בחופשיות…"
        dir="rtl"
        className="flex-1 mt-4 w-full resize-none rounded-2xl bg-card border border-border/50 p-4 text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <p className="text-xs text-muted-foreground/70 mt-2 text-center">
        הכתיבה נשמרת מקומית במכשיר בלבד. שום דבר לא נשלח לשרת.
      </p>

      <div className="flex flex-col gap-3 items-center mt-4">
        <div className="flex items-center gap-3 w-full max-w-sm">
          {timerRunning ? (
            <button
              onClick={pauseTimer}
              className="flex-1 bg-card border border-border rounded-2xl py-3 text-sm font-semibold text-foreground flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
              aria-label="השהיית טיימר"
            >
              <Pause className="w-4 h-4" />
              השהיית טיימר
            </button>
          ) : (
            <button
              onClick={resumeTimer}
              disabled={elapsed >= totalDuration}
              className="flex-1 bg-card border border-border rounded-2xl py-3 text-sm font-semibold text-foreground flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors disabled:opacity-50"
              aria-label="המשך טיימר"
            >
              <Play className="w-4 h-4" />
              המשך טיימר
            </button>
          )}
          <button
            onClick={finish}
            className="flex-1 bg-primary text-primary-foreground rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            aria-label="סיום התרגול"
          >
            <Square className="w-4 h-4" />
            סיום התרגול
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrainDumpExercise;
