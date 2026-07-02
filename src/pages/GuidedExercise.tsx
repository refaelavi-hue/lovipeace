import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Pause, Volume2, VolumeX, RotateCcw, Mic } from 'lucide-react';
import { GUIDED_MEDITATIONS, type MeditationStep } from '@/data/guidedMeditations';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { useVoiceCues } from '@/hooks/useVoiceCues';
import { useOnboarding } from '@/hooks/useOnboarding';
import BreathingCircleTimer from '@/components/BreathingCircleTimer';

const SOUND_LABELS: Record<string, string> = {
  ocean: '🌊 גלי ים',
  rain: '🌧️ גשם',
  bowl: '🔔 קערה טיבטית',
  wind: '🍃 רוח',
  silence: '🤫 שקט',
};

type DurationMode = 'short' | 'regular' | 'long';

const DURATION_OPTIONS: { id: DurationMode; label: string; desc: string }[] = [
  { id: 'short', label: 'קצר', desc: '~2 דק׳' },
  { id: 'regular', label: 'רגיל', desc: '~5 דק׳' },
  { id: 'long', label: 'ארוך', desc: '~8 דק׳' },
];

const DURATION_KEY = 'preferred-duration';

function getStepsForDuration(steps: MeditationStep[], mode: DurationMode): MeditationStep[] {
  if (mode === 'regular') return steps;
  if (mode === 'short') {
    // Take roughly first 40% of steps
    const count = Math.max(4, Math.ceil(steps.length * 0.4));
    return steps.slice(0, count);
  }
  // long — repeat the full set 1.5x by appending the first half again
  const extra = steps.slice(0, Math.ceil(steps.length * 0.5));
  return [...steps, ...extra];
}

const GuidedExercise: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const meditation = GUIDED_MEDITATIONS.find(m => m.id === id);
  const { play, stop } = useAmbientSound();
  const { unlock, playCue, stopCue } = useVoiceCues();
  const { profile } = useOnboarding();

  // Audio guide support
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const [audioMode, setAudioMode] = useState(false);

  const voiceUrl = useMemo(() => {
    if (!meditation) return null;
    return profile.voicePreference === 'male'
      ? meditation.maleVoiceUrl
      : meditation.femaleVoiceUrl;
  }, [meditation, profile.voicePreference]);

  const hasAudio = Boolean(voiceUrl);

  const [durationMode, setDurationMode] = useState<DurationMode>(
    () => (localStorage.getItem(DURATION_KEY) as DurationMode) || 'regular'
  );
  const [phase, setPhase] = useState<'intro' | 'active' | 'outro' | 'idle'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);
  const isSilent = meditation?.id === 'silent-16';
  const SILENT_DURATION = 16 * 60;

  const activeSteps = useMemo(
    () => meditation ? getStepsForDuration(meditation.steps, durationMode) : [],
    [meditation, durationMode]
  );

  const handleDurationChange = (mode: DurationMode) => {
    setDurationMode(mode);
    localStorage.setItem(DURATION_KEY, mode);
  };

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopVoiceAudio = useCallback(() => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
      voiceAudioRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      stop();
      stopCue();
      stopVoiceAudio();
    };
  }, [clearTimer, stop, stopCue, stopVoiceAudio]);

  const startMeditation = useCallback(() => {
    if (!meditation) return;
    unlock();
    setPhase('intro');
    setCurrentStep(0);
    setTimeLeft(8);
    setIsPaused(false);
    playCue('deep-breath');
    if (soundOn) {
      play(meditation.soundType, 0.6);
    }
  }, [meditation, play, playCue, soundOn, unlock]);

  const startAudioMeditation = useCallback(() => {
    if (!meditation || !voiceUrl) return;
    unlock();
    setAudioMode(true);
    setPhase('active');
    setIsPaused(false);
    if (soundOn) {
      play(meditation.soundType, 0.3); // lower ambient for voice
    }
    const audio = new Audio(voiceUrl);
    audio.play();
    audio.onended = () => {
      setPhase('outro');
      setTimeLeft(8);
    };
    voiceAudioRef.current = audio;
  }, [meditation, voiceUrl, play, soundOn, unlock]);

  const resetMeditation = useCallback(() => {
    clearTimer();
    stop();
    stopCue();
    stopVoiceAudio();
    setPhase('idle');
    setCurrentStep(0);
    setTimeLeft(0);
    setIsPaused(false);
    setAudioMode(false);
  }, [clearTimer, stop, stopCue, stopVoiceAudio]);

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
    setIsPaused(prev => {
      const next = !prev;
      if (voiceAudioRef.current) {
        next ? voiceAudioRef.current.pause() : voiceAudioRef.current.play();
      }
      return next;
    });
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

  const playStepCue = useCallback((type: string) => {
    if (type === 'inhale') playCue('inhale');
    else if (type === 'exhale') playCue('exhale');
  }, [playCue]);

  const advanceMeditation = useCallback(() => {
    if (!meditation) return;

    if (phase === 'intro') {
      setPhase('active');
      setCurrentStep(0);
      setTimeLeft(activeSteps[0].duration);
      playStepCue(activeSteps[0].type);
      return;
    }

    if (phase === 'active') {
      const nextStep = currentStep + 1;

      if (nextStep < activeSteps.length) {
        setCurrentStep(nextStep);
        setTimeLeft(activeSteps[nextStep].duration);
        playStepCue(activeSteps[nextStep].type);
      } else {
        setPhase('outro');
        setTimeLeft(8);
        playCue('thank-you');
      }

      return;
    }

    if (phase === 'outro') {
      clearTimer();
      stop();
      setPhase('idle');
      setTimeLeft(0);
    }
  }, [activeSteps, clearTimer, currentStep, meditation, phase, playCue, playStepCue, stop]);

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

  const step = phase === 'active' ? activeSteps[currentStep] : null;
  const progress = phase === 'active' 
    ? (currentStep + 1) / activeSteps.length 
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
          aria-label="חזרה"
          className="flex items-center gap-1 text-primary text-sm font-medium hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
        >
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
          חזרה
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={soundOn ? 'השתק סאונד' : 'הפעל סאונד'}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {soundOn ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
          </button>
          {phase !== 'idle' && (
            <button
              onClick={resetMeditation}
              aria-label="אתחול תרגול"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <RotateCcw size={18} aria-hidden="true" />
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
            <p className="text-muted-foreground mb-6">{meditation.subtitle}</p>

            {/* Duration selector */}
            <div className="flex gap-2 mb-8 w-full max-w-xs mx-auto">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleDurationChange(opt.id)}
                  className={`flex-1 rounded-2xl py-3 px-2 text-center transition-all duration-200 ${
                    durationMode === opt.id
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-card border-2 border-transparent hover:border-primary/20'
                  }`}
                >
                  <span className="text-foreground text-sm font-semibold block">{opt.label}</span>
                  <span className="text-muted-foreground text-xs">{opt.desc}</span>
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mb-6">{SOUND_LABELS[meditation.soundType]}</p>
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={startMeditation}
                aria-label="התחל תרגול טקסט"
                className="bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Play size={32} className="mr-[-2px]" />
              </button>

              {hasAudio && (
                <button
                  onClick={startAudioMeditation}
                  aria-label="התחל תרגול עם הנחיה קולית"
                  className="bg-accent/15 text-accent-foreground w-16 h-16 rounded-full flex flex-col items-center justify-center border-2 border-accent/25 hover:bg-accent/25 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Mic size={22} />
                  <span className="text-[9px] font-medium mt-0.5">קולי</span>
                </button>
              )}
            </div>
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

        {phase === 'active' && audioMode && (
          <div className="animate-fade-up max-w-sm">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 mx-auto animate-pulse">
              <Mic size={36} className="text-primary" />
            </div>
            <p className="text-lg text-foreground font-medium mb-2">הנחיה קולית פעילה</p>
            <p className="text-muted-foreground text-sm">הקשיבו והירגעו</p>
          </div>
        )}

        {phase === 'active' && !audioMode && step && (
          <div className="animate-scale-fade-in max-w-sm">
            {/* Breathing circle with timer */}
            <div className="mb-8">
              <BreathingCircleTimer
                key={`${currentStep}-${step.type}-${step.duration}`}
                type={step.type}
                duration={step.duration}
                timeLeft={timeLeft}
                shape={meditation?.id === 'box-breathing' ? 'square' : 'circle'}
              />
            </div>

            <p className="text-xl text-foreground leading-relaxed font-medium mb-4">
              {step.instruction}
            </p>
            
            {/* Step counter */}
            <p className="text-xs text-muted-foreground">
              {currentStep + 1} / {activeSteps.length}
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
