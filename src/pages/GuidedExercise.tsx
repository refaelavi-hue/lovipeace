import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Pause, Volume2, VolumeX, RotateCcw, Mic, ChevronUp } from 'lucide-react';
import { AppIcon } from '@/components/AppIcon';
import { GUIDED_MEDITATIONS, type MeditationStep } from '@/data/guidedMeditations';
import { getIllustration } from '@/data/meditationIllustrations';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { useVoiceCues } from '@/hooks/useVoiceCues';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useRecentMeditations } from '@/hooks/useRecentMeditations';
import BreathingCircleTimer from '@/components/BreathingCircleTimer';
import { useWakeLock } from '@/hooks/useWakeLock';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import tibetanBellAsset from '@/assets/tibetan-bell.m4a.asset.json';

const BELL_URL = tibetanBellAsset.url;

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
  const { profile, updateProfile } = useOnboarding();
  const { record: recordRecent } = useRecentMeditations();
  const [sheetOpen, setSheetOpen] = useState(false);

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
  useWakeLock(phase !== 'idle');
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

  // Preload bell so playback at the end of a long silent meditation
  // doesn't get blocked by autoplay policies (no user gesture at that moment).
  const preloadBell = useCallback(() => {
    if (bellAudioRef.current) return;
    try {
      const bell = new Audio(BELL_URL);
      bell.volume = 0.7;
      bell.preload = 'auto';
      bell.load();
      bellAudioRef.current = bell;
    } catch {
      /* noop */
    }
  }, []);

  const playBell = useCallback(() => {
    try {
      let bell = bellAudioRef.current;
      if (!bell) {
        bell = new Audio(BELL_URL);
        bell.volume = 0.7;
        bellAudioRef.current = bell;
      }
      bell.currentTime = 0;
      const p = bell.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch {
      /* noop */
    }
  }, []);

  const stopBell = useCallback(() => {
    if (bellAudioRef.current) {
      bellAudioRef.current.pause();
      bellAudioRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      stop();
      stopCue();
      stopVoiceAudio();
      stopBell();
    };
  }, [clearTimer, stop, stopCue, stopVoiceAudio, stopBell]);

  const startMeditation = useCallback(() => {
    if (!meditation) return;
    unlock();
    recordRecent(meditation.id);
    setSheetOpen(false);

    if (isSilent) {
      preloadBell();
      setPhase('active');
      setCurrentStep(0);
      setTimeLeft(SILENT_DURATION);
      setIsPaused(false);
      playBell();
      return;
    }

    setPhase('intro');
    setCurrentStep(0);
    setTimeLeft(8);
    setIsPaused(false);
    playCue('deep-breath');
    if (soundOn) {
      play(meditation.soundType, 0.6);
    }
  }, [meditation, play, playCue, soundOn, unlock, isSilent, playBell, preloadBell, recordRecent]);

  const startAudioMeditation = useCallback(() => {
    if (!meditation || !voiceUrl) return;
    unlock();
    recordRecent(meditation.id);
    setSheetOpen(false);
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
  }, [meditation, voiceUrl, play, soundOn, unlock, recordRecent]);

  const resetMeditation = useCallback(() => {
    clearTimer();
    stop();
    stopCue();
    stopVoiceAudio();
    stopBell();
    setPhase('idle');
    setCurrentStep(0);
    setTimeLeft(0);
    setIsPaused(false);
    setAudioMode(false);
  }, [clearTimer, stop, stopCue, stopVoiceAudio, stopBell]);

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
      if (isSilent) {
        playBell();
        setPhase('outro');
        setTimeLeft(10);
        return;
      }

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
  }, [activeSteps, clearTimer, currentStep, meditation, phase, playCue, playStepCue, stop, isSilent, playBell]);

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
    if (phase === 'idle') return 'bg-phase-idle';
    if (phase === 'intro') return 'bg-phase-inhale';
    if (phase === 'outro') return 'bg-phase-outro';
    if (phase === 'active' && isSilent) return 'bg-phase-silent';
    if (!step) return 'bg-phase-idle';
    switch (step.type) {
      case 'inhale': return 'bg-phase-inhale';
      case 'exhale': return 'bg-phase-exhale';
      case 'hold': return 'bg-phase-hold';
      default: return 'bg-phase-idle';
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
          <div className="animate-fade-up flex flex-col items-center">
            {getIllustration(meditation.id) ? (
              <img
                src={getIllustration(meditation.id)}
                alt=""
                width={192}
                height={192}
                className="w-48 h-48 object-contain mb-4 rounded-3xl"
              />
            ) : (
              <span className="text-7xl mb-6 block">{meditation.icon}</span>
            )}
            <h1 className="text-3xl font-bold text-foreground mb-2">{meditation.title}</h1>
            <p className="text-muted-foreground mb-8 max-w-xs">{meditation.subtitle}</p>

            {/* Quick summary chips */}
            <div className="flex items-center gap-3 mb-10 text-xs text-muted-foreground">
              {!isSilent && (
                <span className="px-3 py-1.5 rounded-full bg-card border border-border">
                  {DURATION_OPTIONS.find(o => o.id === durationMode)?.desc}
                </span>
              )}
              <span className="px-3 py-1.5 rounded-full bg-card border border-border">
                {SOUND_LABELS[meditation.soundType]}
              </span>
              {hasAudio && (
                <span className="px-3 py-1.5 rounded-full bg-card border border-border">
                  {profile.voicePreference === 'male' ? '🎙️ קול גברי' : '🎙️ קול נשי'}
                </span>
              )}
            </div>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="פתח אפשרויות והתחל"
                  className="bg-primary text-primary-foreground px-10 py-4 rounded-full flex items-center gap-3 shadow-lg hover:opacity-90 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Play size={22} className="mr-[-2px]" />
                  <span className="font-semibold text-lg">התחל</span>
                  <ChevronUp size={18} className="opacity-70" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-3xl border-t-0 pb-8"
                dir="rtl"
              >
                <SheetHeader className="text-right">
                  <SheetTitle className="text-xl">{meditation.title}</SheetTitle>
                </SheetHeader>

                {!isSilent && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-foreground mb-3">משך התרגול</p>
                    <div className="flex gap-2">
                      {DURATION_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleDurationChange(opt.id)}
                          className={`flex-1 rounded-2xl py-3 px-2 text-center transition-all duration-200 ${
                            durationMode === opt.id
                              ? 'bg-primary/15 border-2 border-primary'
                              : 'bg-card border-2 border-border hover:border-primary/30'
                          }`}
                        >
                          <span className="text-foreground text-sm font-semibold block">{opt.label}</span>
                          <span className="text-muted-foreground text-xs">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hasAudio && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-foreground mb-3">קול המנחה</p>
                    <div className="flex gap-2">
                      {[
                        { id: 'female', label: 'נשי', emoji: '👩' },
                        { id: 'male', label: 'גברי', emoji: '👨' },
                      ].map((v) => (
                        <button
                          key={v.id}
                          onClick={() => updateProfile({ voicePreference: v.id })}
                          className={`flex-1 rounded-2xl py-3 px-2 flex items-center justify-center gap-2 transition-all duration-200 ${
                            profile.voicePreference === v.id
                              ? 'bg-accent/15 border-2 border-accent'
                              : 'bg-card border-2 border-border hover:border-accent/30'
                          }`}
                        >
                          <span className="text-xl">{v.emoji}</span>
                          <span className="text-foreground text-sm font-semibold">{v.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={startMeditation}
                    className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
                  >
                    <Play size={20} />
                    התחל תרגול
                  </button>

                  {hasAudio && (
                    <button
                      onClick={startAudioMeditation}
                      className="w-full bg-card border-2 border-accent/30 text-foreground rounded-2xl py-4 font-medium flex items-center justify-center gap-2 hover:bg-accent/10 transition-all active:scale-[0.98]"
                    >
                      <Mic size={18} className="text-accent" />
                      התחל עם הנחיה קולית
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
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

        {phase === 'active' && isSilent && (
          <div className="animate-fade-up max-w-sm">
            <span className="text-6xl mb-8 block">🔔</span>
            <p className="text-5xl font-light text-foreground tabular-nums mb-4">
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}
              :
              {(timeLeft % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-muted-foreground text-sm">שקט. רק את הנשימה שלכם.</p>
          </div>
        )}

        {phase === 'active' && !isSilent && audioMode && (
          <div className="animate-fade-up max-w-sm">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 mx-auto animate-pulse">
              <Mic size={36} className="text-primary" />
            </div>
            <p className="text-lg text-foreground font-medium mb-2">הנחיה קולית פעילה</p>
            <p className="text-muted-foreground text-sm">הקשיבו והירגעו</p>
          </div>
        )}

        {phase === 'active' && !isSilent && !audioMode && step && (
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
          <div className="progress-bar-track w-full h-2 mb-6">
            <div
              className="progress-bar-fill"
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
