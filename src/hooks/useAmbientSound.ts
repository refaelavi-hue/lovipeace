import { useRef, useCallback, useState } from 'react';

type SoundType = 'ocean' | 'rain' | 'bowl' | 'wind' | 'silence';

export function useAmbientSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const getContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContext();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const stop = useCallback(() => {
    nodesRef.current.forEach(node => {
      try { node.disconnect(); } catch {}
    });
    nodesRef.current = [];
    if (gainRef.current) {
      try { gainRef.current.disconnect(); } catch {}
      gainRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const createNoise = useCallback((ctx: AudioContext, type: 'white' | 'pink' | 'brown') => {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'white') {
        data[i] = white * 0.1;
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.015;
        b6 = white * 0.115926;
      } else { // brown
        data[i] = (b0 = (b0 + (0.02 * white)) / 1.02) * 1.5;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }, []);

  const play = useCallback((type: SoundType, volume = 0.3) => {
    if (type === 'silence') {
      setIsPlaying(true);
      return;
    }

    stop();
    const ctx = getContext();
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);
    gainRef.current = gain;

    if (type === 'ocean') {
      // Brown noise + LFO filter for wave-like sound
      const noise = createNoise(ctx, 'brown');
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.08;
      lfoGain.gain.value = 300;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      noise.connect(filter);
      filter.connect(gain);
      noise.start();
      nodesRef.current = [noise, filter, lfo, lfoGain];
    } else if (type === 'rain') {
      // Pink noise filtered
      const noise = createNoise(ctx, 'pink');
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;

      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.value = 8000;

      noise.connect(filter);
      filter.connect(filter2);
      filter2.connect(gain);
      noise.start();
      nodesRef.current = [noise, filter, filter2];
    } else if (type === 'bowl') {
      // Singing bowl — layered sine tones
      const freqs = [261.6, 392, 523.2]; // C4, G4, C5
      const nodes: AudioNode[] = [];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.12 / (i + 1);
        // Gentle amplitude modulation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.2 + i * 0.1;
        lfoGain.gain.value = 0.04 / (i + 1);
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);
        lfo.start();
        osc.connect(oscGain);
        oscGain.connect(gain);
        osc.start();
        nodes.push(osc, oscGain, lfo, lfoGain);
      });
      nodesRef.current = nodes;
    } else if (type === 'wind') {
      // White noise heavily filtered
      const noise = createNoise(ctx, 'white');
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 0.5;

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05;
      lfoGain.gain.value = 400;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      noise.connect(filter);
      filter.connect(gain);
      noise.start();
      nodesRef.current = [noise, filter, lfo, lfoGain];
    }

    setIsPlaying(true);
  }, [stop, getContext, createNoise]);

  const setVolume = useCallback((vol: number) => {
    if (gainRef.current) {
      gainRef.current.gain.value = vol;
    }
  }, []);

  return { play, stop, isPlaying, setVolume };
}
