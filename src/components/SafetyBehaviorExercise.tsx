import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ArrowLeft, Check, Square } from 'lucide-react';

interface SafetyBehaviorExerciseProps {
  onClose: () => void;
  onComplete: () => void;
}

type Status = 'intro' | 'step' | 'done';

const DRAFT_KEY = 'safety-behavior-draft-week2';

const STEPS = [
  'חשבו על רגע מהימים האחרונים שבו הרגשתם חרדה או חוסר ביטחון.',
  'מה חששתם שיקרה?',
  'מה עשיתם כדי להרגיש בטוחים יותר או כדי למנוע את מה שחששתם ממנו?',
  'מה הרגשתם בגוף וברגש לפני ואחרי שעשיתם זאת?',
  'אפשר לסיים כאן. לא צריך לפתור, להפסיק או לשנות דבר.',
];

const SafetyBehaviorExercise: React.FC<SafetyBehaviorExerciseProps> = ({ onClose, onComplete }) => {
  const [status, setStatus] = useState<Status>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? JSON.parse(saved) : ['', '', '', '', ''];
    } catch {
      return ['', '', '', '', ''];
    }
  });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // persist draft
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
  }, [answers]);

  // focus textarea when entering a step
  useEffect(() => {
    if (status === 'step') {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [status, stepIndex]);

  const startExercise = () => {
    setStatus('step');
    setStepIndex(0);
  };

  const updateCurrentAnswer = (value: string) => {
    setAnswers(prev => {
      const next = [...prev];
      next[stepIndex] = value;
      return next;
    });
  };

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      setStatus('done');
    }
  };

  const skipStep = () => {
    goNext();
  };

  const stopExercise = () => {
    setStatus('done');
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
          <span className="text-5xl">🪞</span>
          <h1 className="text-2xl font-semibold text-foreground">זיהוי התנהגות ביטחון</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            לפעמים אנחנו עושים דברים כדי להרגיש בטוחים יותר: בודקים, נמנעים, מבקשים אישור או מנסים לשלוט במה שיקרה. השבוע רק נלמד לזהות את זה, בלי ביקורת ובלי צורך לשנות.
          </p>
          <div className="bg-muted/40 rounded-2xl p-4 border border-border/40 w-full">
            <p className="text-sm text-muted-foreground leading-relaxed">
              אין צורך להפסיק שום התנהגות עכשיו. עצם הזיהוי הוא התרגול.
            </p>
          </div>

          <button
            onClick={startExercise}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            להתחיל
          </button>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            התשובות נשמרות מקומית במכשיר בלבד. שום דבר לא נשלח לשרת.
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
        <h2 className="text-2xl font-semibold text-foreground mb-3">סיימתם את התרגול.</h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-10">
          התבוננות אינה מחייבת שינוי. אפשר לתת למה שגיליתם להישאר איתכם בעדינות.
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

  // STEP
  const currentPrompt = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

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
          שלב {stepIndex + 1} מתוך {STEPS.length}
        </span>
      </div>

      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-3">
        <div
          className="h-full bg-primary/60 transition-all duration-500"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 flex-1 flex flex-col">
        <p className="text-lg leading-relaxed text-foreground mb-4">{currentPrompt}</p>

        <label htmlFor="safety-behavior-textarea" className="sr-only">
          אזור כתיבה
        </label>
        <textarea
          id="safety-behavior-textarea"
          ref={textareaRef}
          value={answers[stepIndex]}
          onChange={(e) => updateCurrentAnswer(e.target.value)}
          placeholder="כתבו כאן בחופשיות…"
          dir="rtl"
          className="flex-1 w-full resize-none rounded-2xl bg-card border border-border/50 p-4 text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <p className="text-xs text-muted-foreground/70 mt-2 text-center">
        התשובות נשמרות מקומית במכשיר בלבד. שום דבר לא נשלח לשרת.
      </p>

      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={goNext}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-base font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          {isLastStep ? 'סיום' : 'הבא'}
        </button>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={skipStep}
            className="flex-1 bg-card border border-border rounded-2xl py-3 text-sm font-semibold text-foreground flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
          >
            דלג על השלב
          </button>
          <button
            onClick={stopExercise}
            className="flex-1 bg-card border border-border rounded-2xl py-3 text-sm font-semibold text-foreground flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
            aria-label="עצירת התרגול"
          >
            <Square className="w-4 h-4" />
            עצירה
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyBehaviorExercise;
