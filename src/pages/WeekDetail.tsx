import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Check, Play, Heart } from 'lucide-react';
import { WEEKS_DATA, CATEGORY_INFO } from '@/data/weeksData';
import { useAdmin } from '@/hooks/useAdmin';
import { useProgress } from '@/hooks/useProgress';
import { GUIDED_MEDITATIONS } from '@/data/guidedMeditations';
import LongExhaleExercise from '@/components/LongExhaleExercise';
import Grounding54321Exercise from '@/components/Grounding54321Exercise';
import BrainDumpExercise from '@/components/BrainDumpExercise';
import MindfulWalkExercise from '@/components/MindfulWalkExercise';
import SafetyBehaviorExercise from '@/components/SafetyBehaviorExercise';

const WeekDetail: React.FC = () => {
  const { weekNumber } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const { isExerciseComplete, toggleExerciseComplete, getWeekProgress, getUnlockedWeek } = useProgress();
  const weekNum = Number(weekNumber);
  const week = WEEKS_DATA.find((w) => w.weekNumber === weekNum);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [bypassConfirmed, setBypassConfirmed] = useState(false);
  const [longExhaleOpen, setLongExhaleOpen] = useState(false);
  const [groundingOpen, setGroundingOpen] = useState(false);
  const [brainDumpOpen, setBrainDumpOpen] = useState(false);
  const [mindfulWalkOpen, setMindfulWalkOpen] = useState(false);
  const [safetyBehaviorOpen, setSafetyBehaviorOpen] = useState(false);


  const currentWeek = getUnlockedWeek();

  if (!week) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">שבוע לא נמצא</p>
      </div>
    );
  }

  const isAhead = !isAdmin && weekNum > currentWeek;
  const isLocked = isAhead && !bypassConfirmed;
  const weekProgress = getWeekProgress(weekNum, week.exercises.length);

  const toggleExercise = (category: string) => {
    setExpandedExercise(prev => prev === category ? null : category);
  };

  const handleComplete = (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    toggleExerciseComplete(weekNum, category);
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
              weekProgress.ratio === 1
                ? 'bg-primary/20 text-primary'
                : weekNum === currentWeek
                ? 'bg-primary text-primary-foreground'
                : isAdmin
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {weekProgress.ratio === 1 ? '✓' : weekNum}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">שלב {week.phase}</p>
            <h1 className="text-xl font-semibold text-foreground">{week.title}</h1>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-1">{week.subtitle}</p>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">הדרך שלך</span>
            <span className="text-xs text-muted-foreground">{weekProgress.completed} מתוך {weekProgress.total}</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/60 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${weekProgress.ratio * 100}%` }}
            />
          </div>
          {weekProgress.completed > 0 && weekProgress.ratio < 1 && (
            <p className="text-xs text-muted-foreground/70 mt-2">גם מעט הוא משמעותי.</p>
          )}
        </div>
      </div>

      {isLocked ? (
        <div className="px-5">
          <div className="bg-card rounded-3xl p-8 flex flex-col items-center text-center border border-border/50">
            <Heart className="w-10 h-10 text-primary/40 mb-3" />
            <h3 className="text-foreground font-semibold mb-2">עוד לא הגעת לכאן</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-1">
              מומלץ לסיים קודם את השבוע הקודם, בקצב שלך.
            </p>
            <p className="text-muted-foreground/60 text-xs mb-5">
              אפשר גם להמשיך בעדינות אם זה מרגיש נכון.
            </p>
            <button
              onClick={() => setBypassConfirmed(true)}
              className="bg-primary/10 text-primary px-6 py-3 rounded-2xl text-sm font-medium hover:bg-primary/20 transition-all duration-200"
            >
              בכל זאת, אני רוצה להיכנס 💛
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Week 1 Intention */}
          {weekNum === 1 && (
            <div className="px-5 mb-6">
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🌿</span>
                  <h3 className="font-semibold text-primary text-base">הכוונה לשבוע</h3>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">
                  אין צורך להעלים את החרדה. השבוע נלמד לעצור לרגע, להרגיש את הגוף ולבחור צעד קטן שמחזיר אותנו להווה.
                </p>
              </div>
            </div>
          )}

          {/* Week 2 Intention */}
          {weekNum === 2 && (
            <div className="px-5 mb-6">
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🪞</span>
                  <h3 className="font-semibold text-primary text-base">הכוונה לשבוע</h3>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">
                  השבוע לא ננסה להילחם בחרדה. נלמד לזהות בעדינות מה אנחנו עושים כדי להרגיש בטוחים, ולבחור אם יש מקום להרפות מעט.
                </p>
              </div>
            </div>
          )}

          {/* Exercises */}
          <div className="px-5 space-y-3 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">תרגילים יומיים</h2>
            {week.exercises.map((exercise) => {
              const catInfo = CATEGORY_INFO[exercise.category];
              const isExpanded = expandedExercise === exercise.category;
              const completed = isExerciseComplete(weekNum, exercise.category);
              return (
                <div
                  key={exercise.category}
                  className={`w-full text-right rounded-2xl border transition-all duration-300 ${catInfo.color} ${
                    isExpanded ? 'shadow-md' : ''
                  } ${completed ? 'opacity-75' : ''}`}
                >
                  {/* Header - always visible */}
                  <button
                    onClick={() => {
                      if (weekNum === 1 && exercise.category === 'breathing') {
                        setLongExhaleOpen(true);
                      } else if (weekNum === 1 && exercise.category === 'mind') {
                        setGroundingOpen(true);
                      } else if (weekNum === 1 && exercise.category === 'creation') {
                        setBrainDumpOpen(true);
                      } else if (weekNum === 1 && exercise.category === 'movement') {
                        setMindfulWalkOpen(true);
                      } else if (weekNum === 2 && exercise.category === 'mind') {
                        setSafetyBehaviorOpen(true);
                      } else {
                        toggleExercise(exercise.category);
                      }
                    }}
                    className="w-full text-right p-4 flex items-center gap-3"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${catInfo.iconBg}`}>
                      {exercise.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium opacity-60 mb-0.5">{catInfo.label}</p>
                      <h3 className={`font-semibold text-base ${completed ? 'line-through opacity-60' : ''}`}>{exercise.title}</h3>
                      <p className="text-sm opacity-70 mt-0.5">{exercise.duration}</p>
                    </div>
                    {(weekNum === 1 && (exercise.category === 'breathing' || exercise.category === 'mind' || exercise.category === 'creation' || exercise.category === 'movement')) ||
                    (weekNum === 2 && exercise.category === 'mind') ? (
                      <Play className="w-5 h-5 opacity-60 shrink-0" />
                    ) : (
                      <ChevronDown
                        className={`w-5 h-5 opacity-40 shrink-0 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>


                  {/* Expanded content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 pb-5 pt-1">
                      <div className="border-t border-current/10 pt-4">
                        <p className="text-base leading-relaxed opacity-85 mb-4">
                          {exercise.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={(e) => handleComplete(e, exercise.category)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                              completed
                                ? 'bg-primary/20 text-primary'
                                : 'bg-primary text-primary-foreground hover:opacity-90'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            {completed ? 'הושלם ✓' : 'סימון כהושלם'}
                          </button>
                          {exercise.category === 'breathing' && (() => {
                            const match = GUIDED_MEDITATIONS.find(m => m.category === 'breathing');
                            return match ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/exercise/${match.id}`);
                                }}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-accent/20 text-accent-foreground hover:bg-accent/30 transition-all duration-200"
                              >
                                <Play className="w-4 h-4" />
                                תרגול מונחה
                              </button>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly Exposure */}
          <div className="px-5 mb-6">
            {weekNum === 1 || weekNum === 2 ? (
              <div className="bg-muted/40 rounded-2xl p-5 border border-border/40">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{weekNum === 1 ? '🌱' : '🍃'}</span>
                  <h3 className="font-medium text-foreground text-base">הערה עדינה לשבוע</h3>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">{week.exposure}</p>
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-5 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🎯</span>
                  <h3 className="font-semibold text-foreground text-base">חשיפה שבועית</h3>
                </div>
                <p className="text-muted-foreground text-base leading-relaxed">{week.exposure}</p>
              </div>
            )}
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

          {/* Completion message */}
          {weekProgress.ratio === 1 && (
            <div className="px-5 mb-6">
              <div className="bg-primary/5 rounded-2xl p-5 border border-primary/15 text-center">
                <span className="text-2xl mb-2 block">💛</span>
                <h3 className="font-medium text-foreground text-base">עברת את כל מה שהשבוע הזה הציע</h3>
                <p className="text-muted-foreground text-sm mt-1">זה צעד יפה.</p>
                {weekNum < 10 && (
                  <button
                    onClick={() => navigate(`/weeks/${weekNum + 1}`)}
                    className="mt-3 bg-primary/10 text-primary px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/20 transition-all"
                  >
                    להמשיך לשבוע {weekNum + 1} →
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {longExhaleOpen && (
        <LongExhaleExercise
          onClose={() => setLongExhaleOpen(false)}
          onComplete={() => {
            if (!isExerciseComplete(weekNum, 'breathing')) {
              toggleExerciseComplete(weekNum, 'breathing');
            }
          }}
        />
      )}

      {groundingOpen && (
        <Grounding54321Exercise
          onClose={() => setGroundingOpen(false)}
          onComplete={() => {
            if (!isExerciseComplete(weekNum, 'mind')) {
              toggleExerciseComplete(weekNum, 'mind');
            }
          }}
        />
      )}

      {brainDumpOpen && (
        <BrainDumpExercise
          onClose={() => setBrainDumpOpen(false)}
          onComplete={() => {
            if (!isExerciseComplete(weekNum, 'creation')) {
              toggleExerciseComplete(weekNum, 'creation');
            }
          }}
        />
      )}

      {mindfulWalkOpen && (
        <MindfulWalkExercise
          onClose={() => setMindfulWalkOpen(false)}
          onComplete={() => {
            if (!isExerciseComplete(weekNum, 'movement')) {
              toggleExerciseComplete(weekNum, 'movement');
            }
          }}
        />
      )}

      {safetyBehaviorOpen && (
        <SafetyBehaviorExercise
          onClose={() => setSafetyBehaviorOpen(false)}
          onComplete={() => {
            if (!isExerciseComplete(weekNum, 'mind')) {
              toggleExerciseComplete(weekNum, 'mind');
            }
          }}
        />
      )}
    </div>
  );
};


export default WeekDetail;
