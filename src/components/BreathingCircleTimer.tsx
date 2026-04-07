import React from 'react';

interface BreathingCircleTimerProps {
  type: 'inhale' | 'exhale' | 'hold' | 'pause' | 'text';
  duration: number;
  timeLeft: number;
  label?: string;
  shape?: 'circle' | 'square';
}

const BreathingCircleTimer: React.FC<BreathingCircleTimerProps> = ({ type, duration, timeLeft, label, shape = 'circle' }) => {
  const isBreathing = type === 'inhale' || type === 'exhale' || type === 'hold';
  const progress = duration > 0 ? Math.min(1, Math.max(0, (duration - timeLeft) / duration)) : 0;

  const getScale = () => {
    if (!isBreathing) return 1;
    if (type === 'inhale') return 1 + progress * 0.35;
    if (type === 'exhale') return 1.35 - progress * 0.35;
    if (type === 'hold') return 1.35;
    return 1;
  };

  const scale = getScale();
  const shapeClass = shape === 'square' ? 'rounded-3xl' : 'rounded-full';

  if (!isBreathing) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-36 h-36 ${shapeClass} bg-primary/15 border-2 border-primary/30 flex items-center justify-center`}
        >
          <span className="text-primary/60 text-3xl font-light">{timeLeft}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`w-36 h-36 ${shapeClass} bg-primary/15 border-2 border-primary/30 flex items-center justify-center transition-transform`}
        style={{
          transform: `scale(${scale})`,
          transitionDuration: '1s',
        }}
      >
        <span className="text-primary/60 text-3xl font-light">{timeLeft}</span>
      </div>
    </div>
  );
};

export default BreathingCircleTimer;
