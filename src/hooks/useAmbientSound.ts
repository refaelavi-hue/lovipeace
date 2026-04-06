import { useRef, useCallback, useState } from 'react';

type SoundType = 'ocean' | 'rain' | 'bowl' | 'wind' | 'silence';

export function useAmbientSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback((type: SoundType, volume = 0.6) => {
    if (type === 'silence') {
      stop();
      setIsPlaying(true);
      return;
    }

    stop();

    try {
      const audio = new Audio('/audio/zen-echoes.mp3');
      audio.loop = true;
      audio.volume = Math.min(Math.max(volume, 0), 1);
      audio.play().catch((e) => {
        console.warn('Audio playback failed:', e);
      });
      audioRef.current = audio;
      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio init failed:', e);
      setIsPlaying(true);
    }
  }, [stop]);

  const setVolume = useCallback((vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(Math.max(vol, 0), 1);
    }
  }, []);

  return { play, stop, isPlaying, setVolume };
}
