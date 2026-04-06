import { useRef, useCallback } from 'react';

const CUE_FILES: Record<string, string[]> = {
  inhale: ['/audio/inhale.mp3'],
  exhale: ['/audio/exhale1.mp3', '/audio/exhale2.mp3'],
  'deep-breath': ['/audio/deep-breath.mp3'],
  'thank-you': ['/audio/thank-you.mp3'],
};

export function useVoiceCues() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const exhaleIndexRef = useRef(0);

  const playCue = useCallback((cue: 'inhale' | 'exhale' | 'deep-breath' | 'thank-you', volume = 0.9) => {
    // Stop any current cue
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const files = CUE_FILES[cue];
    if (!files) return;

    let file: string;
    if (cue === 'exhale') {
      file = files[exhaleIndexRef.current % files.length];
      exhaleIndexRef.current += 1;
    } else {
      file = files[0];
    }

    try {
      const audio = new Audio(file);
      audio.volume = Math.min(Math.max(volume, 0), 1);
      audio.play().catch(e => console.warn('Voice cue failed:', e));
      audioRef.current = audio;
    } catch (e) {
      console.warn('Voice cue init failed:', e);
    }
  }, []);

  const stopCue = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  return { playCue, stopCue };
}
