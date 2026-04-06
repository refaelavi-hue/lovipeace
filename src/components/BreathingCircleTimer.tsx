import React, { useEffect, useState, useRef } from 'react';

interface BreathingCircleTimerProps {
  type: 'inhale' | 'exhale' | 'hold' | 'pause' | 'text';
  duration: number; // seconds
  timeLeft: number;
  label?: string;
}

const TYPE_LABELS: Record<string, string> = {
  inhale: 'שאיפה',
  exhale: 'נשיפה',
  hold: 'עצירה',
  pause: 'הפסקה',
  text: '',
};

const BreathingCircleTimer: React.FC<BreathingCircleTimerProps> = ({ type, duration, timeLeft, label }) => {
  const isBreathing = type === 'inhale' || type === 'exhale' || type === 'hold';
  const progress = duration > 0 ? (duration - timeLeft) / duration : 0;

  // Circle SVG params
  const size = 200;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  // Breathing scale
  const getScale = () => {
    if (!isBreathing) return 1;
    if (type === 'inhale') return 1 + progress * 0.6; // grow from 1 to 1.6
    if (type === 'exhale') return 1.6 - progress * 0.6; // shrink from 1.6 to 1
    if (type === 'hold') return 1.6; // stay big
    return 1;
  };

  const getColor = () => {
    if (type === 'inhale') return 'hsl(var(--primary))';
    if (type === 'exhale') return 'hsl(var(--accent))';
    if (type === 'hold') return 'hsl(var(--primary))';
    return 'hsl(var(--muted-foreground))';
  };

  const scale = getScale();
  const color = getColor();

  if (!isBreathing) {
    // Simple timer for text/pause steps
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg width={96} height={96} className="rotate-[-90deg]">
            <circle
              cx={48} cy={48} r={42}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={3}
            />
            <circle
              cx={48} cy={48} r={42}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - progress)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute text-2xl font-bold text-foreground">{timeLeft}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Progress ring */}
        <svg width={size} height={size} className="absolute rotate-[-90deg]">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        {/* Breathing circle */}
        <div
          className="rounded-full flex items-center justify-center flex-col transition-transform ease-in-out"
          style={{
            width: 100,
            height: 100,
            transform: `scale(${scale})`,
            transitionDuration: '1000ms',
            background: `radial-gradient(circle, ${color}33, ${color}11)`,
            border: `2px solid ${color}55`,
          }}
        >
          <span className="text-sm font-semibold" style={{ color }}>
            {label || TYPE_LABELS[type]}
          </span>
          <span className="text-xl font-bold text-foreground mt-1">{timeLeft}</span>
        </div>
      </div>
    </div>
  );
};

export default BreathingCircleTimer;
