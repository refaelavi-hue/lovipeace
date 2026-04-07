import { useRef, useCallback } from 'react';

type CueType = 'inhale' | 'exhale' | 'deep-breath' | 'thank-you';

const CUE_FILES: Record<string, string[]> = {
  inhale: ['/audio/inhale.mp3'],
  exhale: ['/audio/exhale1.mp3', '/audio/exhale2.mp3'],
  'deep-breath': ['/audio/deep-breath.mp3'],
  'thank-you': ['/audio/thank-you.mp3'],
};

export function useVoiceCues() {
  const poolRef = useRef<Record<string, HTMLAudioElement[]>>({});
  const exhaleIndexRef = useRef(0);
  const unlockedRef = useRef(false);

  // Call this once from a direct user click to unlock all audio elements
  const unlock = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;

    // Pre-create and preload audio elements without playing them
    for (const [key, files] of Object.entries(CUE_FILES)) {
      poolRef.current[key] = files.map(src => {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.volume = 0.9;
        // Just load, don't play — avoids duplicate sound on first cue
        audio.load();
        return audio;
      });
    }
  }, []);

  const playCue = useCallback((cue: CueType, volume = 0.9) => {
    const pool = poolRef.current[cue];
    if (!pool || pool.length === 0) return;

    let audio: HTMLAudioElement;
    if (cue === 'exhale') {
      audio = pool[exhaleIndexRef.current % pool.length];
      exhaleIndexRef.current += 1;
    } else {
      audio = pool[0];
    }

    // Stop any current playback before replaying
    audio.pause();
    audio.currentTime = 0;
    audio.volume = Math.min(Math.max(volume, 0), 1);
    audio.play().catch(e => console.warn('Voice cue failed:', e));
  }, []);

  const stopCue = useCallback(() => {
    for (const audios of Object.values(poolRef.current)) {
      for (const a of audios) {
        a.pause();
        a.currentTime = 0;
      }
    }
  }, []);

  return { unlock, playCue, stopCue };
}
