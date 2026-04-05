import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { WEEKS_DATA, PHASES } from '@/data/weeksData';

const currentWeek = 1; // Will be dynamic later

const Weeks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-semibold text-foreground animate-fade-up">תוכנית 10 שבועות</h1>
        <p className="text-muted-foreground mt-1 animate-fade-up-delay-1">מסע של שינוי מדורג</p>
      </div>

      {/* Phase Overview */}
      <div className="px-6 mb-6 animate-fade-up-delay-1">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PHASES.map((phase) => (
            <div
              key={phase.name}
              className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-medium ${phase.color}`}
            >
              <span>שלב {phase.name}</span>
              <span className="text-xs opacity-70 mr-1">({phase.weeks})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Week List */}
      <div className="px-6 space-y-3 animate-fade-up-delay-2">
        {WEEKS_DATA.map((week) => {
          const isActive = week.weekNumber === currentWeek;
          const isLocked = week.weekNumber > currentWeek;

          return (
            <button
              key={week.weekNumber}
              onClick={() => navigate(`/weeks/${week.weekNumber}`)}
              className={`w-full text-right ${isLocked ? 'opacity-40' : ''}`}
            >
              <div
                className={`rounded-3xl p-5 transition-all duration-300 ${
                  isActive
                    ? 'bg-card border-2 border-primary/30 shadow-lg shadow-primary/5'
                    : 'bg-card border-2 border-transparent'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : week.weekNumber < currentWeek
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {week.weekNumber < currentWeek ? '✓' : week.weekNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-semibold text-base mb-1">{week.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{week.subtitle}</p>
                    {isActive && (
                      <span className="inline-block mt-3 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-xl">
                        להתחיל את השבוע →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default Weeks;
