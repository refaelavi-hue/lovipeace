import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface BreathingExerciseProps {
  onClose: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASES: { phase: Phase; duration: number; label: string }[] = [
  { phase: 'inhale', duration: 4000, label: 'שאפי...' },
  { phase: 'hold', duration: 4000, label: 'החזיקי...' },
  { phase: 'exhale', duration: 6000, label: 'נשפי...' },
  { phase: 'rest', duration: 2000, label: 'נוחי...' },
];

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycles, setCycles] = useState(0);

  const currentPhase = PHASES[phaseIndex];

  const nextPhase = useCallback(() => {
    setPhaseIndex(prev => {
      const next = (prev + 1) % PHASES.length;
      if (next === 0) setCycles(c => c + 1);
      return next;
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(nextPhase, currentPhase.duration);
    return () => clearTimeout(timer);
  }, [phaseIndex, currentPhase.duration, nextPhase]);

  const circleScale =
    currentPhase.phase === 'inhale' || currentPhase.phase === 'hold'
      ? 'scale-[1.8]'
      : 'scale-100';

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X size={28} />
      </button>

      <div className="flex flex-col items-center gap-12">
        {/* Breathing circle */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div
            className={`absolute w-32 h-32 rounded-full bg-primary/30 transition-transform ease-in-out ${circleScale}`}
            style={{ transitionDuration: `${currentPhase.duration}ms` }}
          />
          <div
            className={`absolute w-20 h-20 rounded-full bg-primary/60 transition-transform ease-in-out ${circleScale}`}
            style={{ transitionDuration: `${currentPhase.duration}ms` }}
          />
        </div>

        <div className="text-center">
          <p className="text-3xl font-light text-foreground mb-2">{currentPhase.label}</p>
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
