import React from 'react';

interface OnboardingStepProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  step: number;
  totalSteps: number;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  subtitle,
  children,
  step,
  totalSteps,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-12 animate-fade-up">
      {/* Step indicator */}
      <div className="flex gap-2 mb-12">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i <= step
                ? 'w-8 bg-primary'
                : 'w-4 bg-muted'
            }`}
          />
        ))}
      </div>

      <h1 className="text-3xl font-semibold text-foreground text-center mb-3 leading-relaxed">
        {title}
      </h1>

      {subtitle && (
        <p className="text-muted-foreground text-center text-lg mb-10 max-w-sm leading-relaxed">
          {subtitle}
        </p>
      )}

      <div className="w-full max-w-sm animate-fade-up-delay-1">
        {children}
      </div>
    </div>
  );
};

export default OnboardingStep;
