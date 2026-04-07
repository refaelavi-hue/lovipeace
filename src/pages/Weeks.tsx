import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { WEEKS_DATA, PHASES } from '@/data/weeksData';
import { useAdmin } from '@/hooks/useAdmin';
import { useProgress } from '@/hooks/useProgress';
import { Shield, ShieldOff, Check } from 'lucide-react';

const Weeks: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, login, logout } = useAdmin();
  const { getWeekProgress, getUnlockedWeek } = useProgress();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const currentWeek = getUnlockedWeek();

  const handleLogin = () => {
    if (login(password)) {
      setShowPasswordInput(false);
      setPassword('');
      setError('');
    } else {
      setError('סיסמה שגויה');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir="rtl">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground animate-fade-up">תוכנית 10 שבועות</h1>
            <p className="text-muted-foreground mt-1 animate-fade-up-delay-1">מסע של שינוי מדורג</p>
          </div>
          <button
            onClick={() => {
              if (isAdmin) {
                logout();
              } else {
                setShowPasswordInput(!showPasswordInput);
              }
            }}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isAdmin
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground/40 hover:text-muted-foreground'
            }`}
          >
            {isAdmin ? <ShieldOff size={20} /> : <Shield size={20} />}
          </button>
        </div>

        {showPasswordInput && !isAdmin && (
          <div className="mt-3 bg-card rounded-2xl p-4 border border-border animate-fade-up">
            <p className="text-sm text-foreground font-medium mb-2">כניסת מנהל</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="סיסמה"
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={handleLogin}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
              >
                כניסה
              </button>
            </div>
            {error && <p className="text-destructive text-xs mt-2">{error}</p>}
          </div>
        )}

        {isAdmin && (
          <div className="mt-2 bg-primary/5 rounded-xl px-3 py-1.5 inline-flex items-center gap-1.5 animate-fade-up">
            <Shield size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">מצב מנהל — כל השבועות פתוחים</span>
          </div>
        )}
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
          const isLocked = !isAdmin && week.weekNumber > currentWeek;
          const wp = getWeekProgress(week.weekNumber, week.exercises.length);
          const isCompleted = wp.ratio === 1;

          return (
            <button
              key={week.weekNumber}
              onClick={() => navigate(`/weeks/${week.weekNumber}`)}
              className={`w-full text-right ${isLocked ? 'opacity-60' : ''}`}
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
                      isCompleted
                        ? 'bg-primary/20 text-primary'
                        : isActive
                        ? 'bg-primary text-primary-foreground'
                        : isLocked
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {isCompleted ? <Check size={18} /> : isLocked ? week.weekNumber : week.weekNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-semibold text-base mb-1">{week.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{week.subtitle}</p>
                    
                    {/* Soft progress indicator */}
                    {!isLocked && wp.completed > 0 && !isCompleted && (
                      <div className="mt-2.5">
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/50 rounded-full transition-all duration-500"
                            style={{ width: `${wp.ratio * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground/70 mt-1.5">
                          {wp.completed > 0 && wp.ratio < 1 ? 'גם מעט הוא משמעותי 💛' : `${wp.completed} מתוך ${wp.total}`}
                        </p>
                      </div>
                    )}

                    {isActive && wp.completed === 0 && (
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
