import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { GUIDED_MEDITATIONS } from '@/data/guidedMeditations';
import { useAmbientSound } from '@/hooks/useAmbientSound';

const SOUND_LABELS: Record<string, string> = {
  ocean: '🌊 גלי ים',
  rain: '🌧️ גשם',
  bowl: '🔔 קערה טיבטית',
  wind: '🍃 רוח',
  silence: '🤫 שקט',
};

const GuidedExercise: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const meditation = GUIDED_MEDITATIONS.find(m => m.id === id);
  const { play, stop, isPlaying: soundPlaying } = useAmbientSound();

  const [phase, setPhase] = useState<'intro' | 'active' | 'outro' | 'idle'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      stop();
    };
  }, [clearTimer, stop]);

  const startMeditation = useCallback(() => {
    if (!meditation) return;
    setPhase('intro');
    setCurrentStep(0);
    setTimeLeft(8); // intro duration
    setIsPaused(false);
    if (soundOn) {
      play(meditation.soundType, 0.25);
    }
  }, [meditation, play, soundOn]);

  const resetMeditation = useCallback(() => {
    clearTimer();
    stop();
    setPhase('idle');
    setCurrentStep(0);
    setTimeLeft(0);
    setIsPaused(false);
  }, [clearTimer, stop]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const toggleSound = useCallback(() => {
    if (!meditation) return;
    if (soundOn) {
      stop();
      setSoundOn(false);
    } else {
      if (phase !== 'idle') {
        play(meditation.soundType, 0.25);
      }
      setSoundOn(true);
    }
  }, [soundOn, meditation, phase, play, stop]);

  // Timer logic
  useEffect(() => {
    clearTimer();
    if (phase === 'idle' || isPaused || !meditation) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Move to next phase/step
          if (phase === 'intro') {
            setPhase('active');
            setCurrentStep(0);
            return meditation.steps[0].duration;
          } else if (phase === 'active') {
            const nextStep = currentStep + 1;
            if (nextStep < meditation.steps.length) {
              setCurrentStep(nextStep);
              return meditation.steps[nextStep].duration;
            } else {
              setPhase('outro');
              return 8;
            }
          } else if (phase === 'outro') {
            clearTimer();
            stop();
            setPhase('idle');
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimer();
  }, [phase, isPaused, currentStep, meditation, clearTimer, stop]);

  if (!meditation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">תרגיל לא נמצא</p>
      </div>
    );
  }

  const step = phase === 'active' ? meditation.steps[currentStep] : null;
  const progress = phase === 'active' 
    ? (currentStep + 1) / meditation.steps.length 
    : phase === 'outro' ? 1 : 0;

  const getBgClass = () => {
    if (!step) return 'bg-background';
    switch (step.type) {
      case 'inhale': return 'bg-primary/5';
      case 'exhale': return 'bg-accent/5';
      case 'hold': return 'bg-secondary';
      default: return 'bg-background';
    }
  };

  const getBreathingScale = () => {
    if (!step) return 'scale-100';
    switch (step.type) {
      case 'inhale': return 'scale-150';
      case 'exhale': return 'scale-75';
      case 'hold': return 'scale-150';
      default: return 'scale-100';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${getBgClass()} flex flex-col`} dir="rtl">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <button
          onClick={() => { resetMeditation(); navigate(-1); }}
          className="flex items-center gap-1 text-primary text-sm font-medium hover:opacity-80 transition-opacity"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          {phase !== 'idle' && (
            <button
              onClick={resetMeditation}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {phase === 'idle' && (
          <div className="animate-fade-up">
            <span className="text-6xl mb-6 block">{meditation.icon}</span>
            <h1 className="text-2xl font-bold text-foreground mb-2">{meditation.title}</h1>
            <p className="text-muted-foreground mb-2">{meditation.subtitle}</p>
            <p className="text-sm text-muted-foreground mb-1">{meditation.totalDuration}</p>
            <p className="text-xs text-muted-foreground mb-8">{SOUND_LABELS[meditation.soundType]}</p>
            
            <button
              onClick={startMeditation}
              className="bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all active:scale-95"
            >
              <Play size={32} className="mr-[-2px]" />
            </button>
          </div>
        )}

        {phase === 'intro' && (
          <div className="animate-fade-up max-w-sm">
            <p className="text-xl text-foreground leading-relaxed font-medium">
              {meditation.intro}
            </p>
            <p className="text-sm text-muted-foreground mt-6">מתחילים בעוד {timeLeft} שניות...</p>
          </div>
        )}

        {phase === 'active' && step && (
          <div className="animate-scale-fade-in max-w-sm">
            {/* Breathing circle */}
            {(step.type === 'inhale' || step.type === 'exhale' || step.type === 'hold') && (
              <div className="mb-8 flex justify-center">
                <div
                  className={`w-28 h-28 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center transition-transform duration-[3000ms] ease-in-out ${getBreathingScale()}`}
                >
                  <span className="text-primary font-semibold text-sm">
                    {step.type === 'inhale' ? 'שאיפה' : step.type === 'exhale' ? 'נשיפה' : 'עצירה'}
                  </span>
                </div>
              </div>
            )}

            <p className="text-xl text-foreground leading-relaxed font-medium mb-6">
              {step.instruction}
            </p>

            <p className="text-3xl font-bold text-primary mb-4">{timeLeft}</p>
            
            {/* Step counter */}
            <p className="text-xs text-muted-foreground">
              {currentStep + 1} / {meditation.steps.length}
            </p>
          </div>
        )}

        {phase === 'outro' && (
          <div className="animate-fade-up max-w-sm">
            <span className="text-5xl mb-6 block">✨</span>
            <p className="text-xl text-foreground leading-relaxed font-medium">
              {meditation.outro}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {phase !== 'idle' && (
        <div className="px-8 pb-12">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {phase !== 'outro' && (
            <button
              onClick={togglePause}
              className="w-full py-4 rounded-2xl bg-card border border-border text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-muted transition-colors"
            >
              {isPaused ? (
                <>
                  <Play size={18} />
                  המשך
                </>
              ) : (
                <>
                  <Pause size={18} />
                  השהיה
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GuidedExercise;
