import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';
import { WEEKS_DATA, CATEGORY_INFO } from '@/data/weeksData';

const currentWeek = 1; // Will be dynamic later

const WeekDetail: React.FC = () => {
  const { weekNumber } = useParams();
  const navigate = useNavigate();
  const weekNum = Number(weekNumber);
  const week = WEEKS_DATA.find((w) => w.weekNumber === weekNum);

  if (!week) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">שבוע לא נמצא</p>
      </div>
    );
  }

  const isLocked = weekNum > currentWeek;
  const isCompleted = weekNum < currentWeek;

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button
          onClick={() => navigate('/weeks')}
          className="flex items-center gap-1 text-primary text-sm font-medium mb-4 hover:opacity-80 transition-opacity"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לשבועות
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold ${
              isCompleted
                ? 'bg-primary/20 text-primary'
                : weekNum === currentWeek
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {isCompleted ? '✓' : weekNum}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">שלב {week.phase}</p>
            <h1 className="text-xl font-semibold text-foreground">{week.title}</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-1">{week.subtitle}</p>
      </div>

      {isLocked ? (
        <div className="px-6">
          <div className="bg-card rounded-3xl p-8 flex flex-col items-center text-center border border-border/50">
            <Lock className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <h3 className="text-foreground font-semibold mb-1">השבוע נעול</h3>
            <p className="text-muted-foreground text-sm">
              סיימו את שבוע {currentWeek} כדי לפתוח את השבוע הזה
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Exercises */}
          <div className="px-6 space-y-3 mb-6">
            <h2 className="text-base font-semibold text-foreground mb-1">תרגילים יומיים</h2>
            {week.exercises.map((exercise) => {
              const catInfo = CATEGORY_INFO[exercise.category];
              return (
                <div
                  key={exercise.category}
                  className={`rounded-2xl p-4 border ${catInfo.color} transition-all duration-200`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${catInfo.iconBg}`}>
                      {exercise.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium opacity-70">{catInfo.label}</span>
                          <h3 className="font-semibold text-sm">{exercise.title}</h3>
                        </div>
                        <span className="text-xs font-medium opacity-70 shrink-0">{exercise.duration}</span>
                      </div>
                      <p className="text-xs leading-relaxed opacity-80">{exercise.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly Exposure */}
          <div className="px-6 mb-6">
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🎯</span>
                <h3 className="font-semibold text-foreground text-sm">חשיפה שבועית</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{week.exposure}</p>
            </div>
          </div>

          {/* Tip */}
          {week.tip && (
            <div className="px-6 mb-6">
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">💡</span>
                  <h3 className="font-semibold text-primary text-sm">טיפ</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{week.tip}</p>
              </div>
            </div>
          )}

          {/* Start button */}
          {weekNum === currentWeek && (
            <div className="px-6">
              <button className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-2xl text-base hover:opacity-90 transition-opacity">
                להתחיל את התרגול היומי
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeekDetail;
