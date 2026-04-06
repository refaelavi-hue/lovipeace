import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { GUIDED_MEDITATIONS } from '@/data/guidedMeditations';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { useVoiceCues } from '@/hooks/useVoiceCues';
import BreathingCircleTimer from '@/components/BreathingCircleTimer';

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
  const { playCue, stopCue } = useVoiceCues();

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
      stopCue();
    };
  }, [clearTimer, stop, stopCue]);

  const startMeditation = useCallback(() => {
    if (!meditation) return;
    setPhase('intro');
    setCurrentStep(0);
    setTimeLeft(8); // intro duration
    setIsPaused(false);
    if (soundOn) {
      play(meditation.soundType, 0.6);
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

  const handleBack = useCallback(() => {
    resetMeditation();

    const historyIndex = typeof window !== 'undefined'
      ? window.history.state?.idx ?? 0
      : 0;

    if (historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate('/tools', { replace: true });
  }, [navigate, resetMeditation]);

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
        play(meditation.soundType, 0.6);
      }
      setSoundOn(true);
    }
  }, [soundOn, meditation, phase, play, stop]);

  const advanceMeditation = useCallback(() => {
    if (!meditation) return;

    if (phase === 'intro') {
      setPhase('active');
      setCurrentStep(0);
      setTimeLeft(meditation.steps[0].duration);
      return;
    }

    if (phase === 'active') {
      const nextStep = currentStep + 1;

      if (nextStep < meditation.steps.length) {
        setCurrentStep(nextStep);
        setTimeLeft(meditation.steps[nextStep].duration);
      } else {
        setPhase('outro');
        setTimeLeft(8);
      }

      return;
    }

    if (phase === 'outro') {
      clearTimer();
      stop();
      setPhase('idle');
      setTimeLeft(0);
    }
  }, [clearTimer, currentStep, meditation, phase, stop]);

  // Timer logic
  useEffect(() => {
    if (phase === 'idle' || isPaused || !meditation || timeLeft > 0) return;

    advanceMeditation();
  }, [advanceMeditation, isPaused, meditation, phase, timeLeft]);

  useEffect(() => {
    clearTimer();
    if (phase === 'idle' || isPaused || !meditation || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimer();
  }, [phase, isPaused, meditation, timeLeft, clearTimer]);

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


  return (
    <div className={`min-h-screen transition-colors duration-1000 ${getBgClass()} flex flex-col`} dir="rtl">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <button
          onClick={handleBack}
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
            {/* Breathing circle with timer */}
            <div className="mb-8">
              <BreathingCircleTimer
                key={`${currentStep}-${step.type}-${step.duration}`}
                type={step.type}
                duration={step.duration}
                timeLeft={timeLeft}
              />
            </div>

            <p className="text-xl text-foreground leading-relaxed font-medium mb-4">
              {step.instruction}
            </p>
            
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
