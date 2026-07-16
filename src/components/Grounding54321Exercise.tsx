import React, { useState, useCallback } from 'react';
import { X, Play, Check, ArrowLeft, SkipForward, Square } from 'lucide-react';

interface Grounding54321ExerciseProps {
  onClose: () => void;
  onComplete: () => void;
}

type Status = 'intro' | 'running' | 'done';

interface Step {
  count: number;
  sense: string;
  instruction: string;
  hint: string;
  emoji: string;
}

const STEPS: Step[] = [
  {
    count: 5,
    sense: 'רואים',
    instruction: '5 דברים שאתם רואים',
    hint: 'הביטו סביבכם ושימו לב לצבעים, לצורות ולפרטים הקטנים.',
    emoji: '👀',
  },
  {
    count: 4,
    sense: 'שומעים',
    instruction: '4 דברים שאתם שומעים',
    hint: 'הקשיבו לצלילים הקרובים והרחוקים, גם השקטים ביותר.',
    emoji: '👂',
  },
  {
    count: 3,
    sense: 'מרגישים במגע',
    instruction: '3 דברים שאתם מרגישים במגע',
    hint: 'שימו לב למגע של הבגדים, של הכיסא או של הרצפה תחת הרגליים.',
    emoji: '✋',
  },
  {
    count: 2,
    sense: 'מריחים',
    instruction: '2 דברים שאתם מריחים',
    hint: 'נשמו בעדינות דרך האף וגלו איזה ריחות נמצאים סביבכם.',
    emoji: '👃',
  },
  {
    count: 1,
    sense: 'טועמים',
    instruction: 'דבר אחד שאתם טועמים',
    hint: 'שימו לב לטעם שבפה, גם אם הוא עדין מאוד.',
    emoji: '👅',
  },
];

const Grounding54321Exercise: React.FC<Grounding54321ExerciseProps> = ({ onClose, onComplete }) => {
  const [status, setStatus] = useState<Status>('intro');
  const [stepIndex, setStepIndex] = useState(0);

  const start = () => {
    setStepIndex(0);
    setStatus('running');
  };

  const next = () => {
    if (stepIndex >= STEPS.length - 1) {
      setStatus('done');
    } else {
      setStepIndex(i => i + 1);
    }
  };

  const stop = () => {
    setStatus('intro');
    setStepIndex(0);
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
          <span className="text-5xl">🌿</span>
          <h1 className="text-2xl font-semibold text-foreground">קרקוע 5-4-3-2-1</h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            תרגול קצר שמזמין את תשומת הלב לחושים ולרגע הזה. אין צורך לבצע אותו בצורה מושלמת.
          </p>

          <div className="bg-muted/40 rounded-2xl p-4 border border-border/40 w-full">
            <p className="text-sm text-muted-foreground leading-relaxed">
              אם משהו מרגיש לא נעים, אפשר לדלג על שלב, לחזור לנשימה הטבעית או לעצור.
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
        <h2 className="text-2xl font-semibold text-foreground mb-3">סיימתם את תרגול הקרקוע.</h2>
        <p className="text-muted-foreground text-base leading-relaxed max-w-sm mb-10">
          לא צריך להרגיש אחרת מיד. שמתם לב למה שנמצא כאן עכשיו.
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

  // RUNNING
  const step = STEPS[stepIndex];
  const progressPct = ((stepIndex + 1) / STEPS.length) * 100;
  const isLast = stepIndex === STEPS.length - 1;

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
          {stepIndex + 1} מתוך {STEPS.length}
        </span>
      </div>

      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-primary/60 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto">
        <span className="text-6xl" aria-hidden>{step.emoji}</span>
        <div
          className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center"
          aria-hidden
        >
          <span className="text-6xl font-light text-primary tabular-nums">{step.count}</span>
        </div>
        <h2 className="text-2xl font-semibold text-foreground" aria-live="polite">
          {step.instruction}
        </h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          {step.hint}
        </p>
      </div>

      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={next}
          className="w-full max-w-sm bg-primary text-primary-foreground rounded-2xl py-4 text-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          {isLast ? (
            <>
              <Check className="w-5 h-5" />
              סיום
            </>
          ) : (
            <>
              הבא
              <ArrowLeft className="w-5 h-5" />
            </>
          )}
        </button>
        <div className="flex items-center gap-3 w-full max-w-sm">
          <button
            onClick={next}
            className="flex-1 bg-card border border-border rounded-2xl py-3 text-sm font-medium text-foreground flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
            aria-label="דלג על השלב"
          >
            <SkipForward className="w-4 h-4" />
            דלג על השלב
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

export default Grounding54321Exercise;
