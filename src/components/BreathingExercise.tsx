import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import BreathingCircleTimer from '@/components/BreathingCircleTimer';

interface BreathingExerciseProps {
  onClose: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASES: { phase: Phase; duration: number; label: string; type: 'inhale' | 'exhale' | 'hold' | 'pause' }[] = [
  { phase: 'inhale', duration: 4, label: 'שאפי...', type: 'inhale' },
  { phase: 'hold', duration: 4, label: 'החזיקי...', type: 'hold' },
  { phase: 'exhale', duration: 6, label: 'נשפי...', type: 'exhale' },
  { phase: 'rest', duration: 2, label: 'נוחי...', type: 'pause' },
];

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [timeLeft, setTimeLeft] = useState(PHASES[0].duration);

  const currentPhase = PHASES[phaseIndex];

  const nextPhase = useCallback(() => {
    setPhaseIndex(prev => {
      const next = (prev + 1) % PHASES.length;
      if (next === 0) setCycles(c => c + 1);
      setTimeLeft(PHASES[next].duration);
      return next;
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          nextPhase();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phaseIndex, nextPhase]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={28} />
      </button>

      <div className="flex flex-col items-center gap-8">
        <BreathingCircleTimer
          type={currentPhase.type}
          duration={currentPhase.duration}
          timeLeft={timeLeft}
          label={currentPhase.label}
        />

        <div className="text-center">
          <p className="text-2xl font-light text-foreground mb-2">{currentPhase.label}</p>
          <p className="text-muted-foreground text-sm">
            סבב {cycles + 1}
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
