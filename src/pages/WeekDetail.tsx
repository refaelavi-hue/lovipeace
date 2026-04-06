import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, ChevronDown } from 'lucide-react';
import { WEEKS_DATA, CATEGORY_INFO } from '@/data/weeksData';
import { useAdmin } from '@/hooks/useAdmin';

const currentWeek = 1;

const WeekDetail: React.FC = () => {
  const { weekNumber } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const weekNum = Number(weekNumber);
  const week = WEEKS_DATA.find((w) => w.weekNumber === weekNum);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  if (!week) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">שבוע לא נמצא</p>
      </div>
    );
  }

  const isLocked = !isAdmin && weekNum > currentWeek;
  const isCompleted = weekNum < currentWeek;

  const toggleExercise = (category: string) => {
    setExpandedExercise(prev => prev === category ? null : category);
  };

  return (
    <div className="min-h-screen bg-background pb-12" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
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
                : isAdmin
                ? 'bg-primary/10 text-primary'
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
        <div className="px-5">
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
          <div className="px-5 space-y-3 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">תרגילים יומיים</h2>
            {week.exercises.map((exercise) => {
              const catInfo = CATEGORY_INFO[exercise.category];
              const isExpanded = expandedExercise === exercise.category;
              return (
                <button
                  key={exercise.category}
                  onClick={() => toggleExercise(exercise.category)}
                  className={`w-full text-right rounded-2xl border transition-all duration-300 ${catInfo.color} ${
                    isExpanded ? 'shadow-md' : ''
                  }`}
                >
                  {/* Header - always visible */}
                  <div className="p-4 flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${catInfo.iconBg}`}>
                      {exercise.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium opacity-60 mb-0.5">{catInfo.label}</p>
                      <h3 className="font-semibold text-base">{exercise.title}</h3>
                      <p className="text-sm opacity-70 mt-0.5">{exercise.duration}</p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 opacity-40 shrink-0 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {/* Expanded content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 pb-5 pt-1">
                      <div className="border-t border-current/10 pt-4">
                        <p className="text-base leading-relaxed opacity-85">
                          {exercise.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Weekly Exposure */}
          <div className="px-5 mb-6">
            <div className="bg-card rounded-2xl p-5 border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎯</span>
                <h3 className="font-semibold text-foreground text-base">חשיפה שבועית</h3>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed">{week.exposure}</p>
            </div>
          </div>

          {/* Tip */}
          {week.tip && (
            <div className="px-5 mb-6">
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">💡</span>
                  <h3 className="font-semibold text-primary text-base">טיפ</h3>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">{week.tip}</p>
              </div>
            </div>
          )}

          {/* Start button */}
          {(weekNum === currentWeek || isAdmin) && (
            <div className="px-5">
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
