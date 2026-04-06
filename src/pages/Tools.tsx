import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { WEEKS_DATA, CATEGORY_INFO, Exercise } from '@/data/weeksData';
import { GUIDED_MEDITATIONS } from '@/data/guidedMeditations';

type Category = keyof typeof CATEGORY_INFO;

const CATEGORY_ICONS: Record<Category, string> = {
  breathing: '🌬️',
  movement: '🏃',
  mind: '🧘',
  creation: '✍️',
};

const Tools: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>('breathing');

  // Collect all unique exercises per category across all weeks
  const exercisesByCategory: Record<Category, { exercise: Exercise; weekNumber: number }[]> = {
    breathing: [],
    movement: [],
    mind: [],
    creation: [],
  };

  WEEKS_DATA.forEach((week) => {
    week.exercises.forEach((ex) => {
      exercisesByCategory[ex.category].push({ exercise: ex, weekNumber: week.weekNumber });
    });
  });

  const categories: Category[] = ['breathing', 'movement', 'mind', 'creation'];

  // Get guided meditations for current category
  const guidedForCategory = GUIDED_MEDITATIONS.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pb-24" dir="rtl">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-foreground">ארגז כלים</h1>
        <p className="text-sm text-muted-foreground mt-1">כל התרגילים מהתוכנית, במקום אחד</p>
      </div>

      {/* Category Tabs */}
      <div className="px-5 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat) => {
          const info = CATEGORY_INFO[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-card text-muted-foreground border border-border hover:border-primary/30'
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span>{info.label}</span>
            </button>
          );
        })}
      </div>

      {/* Guided Meditations Section */}
      {guidedForCategory.length > 0 && (
        <div className="px-5 mt-2 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <span>🎧</span>
            תרגולים מונחים
          </h2>
          <div className="space-y-3">
            {guidedForCategory.map((med) => (
              <button
                key={med.id}
                onClick={() => navigate(`/exercise/${med.id}`)}
                className="w-full bg-primary/5 rounded-2xl p-4 border border-primary/15 text-right transition-all duration-200 hover:bg-primary/10 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-2xl shrink-0">
                    {med.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm">{med.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{med.subtitle}</p>
                  </div>
                  <span className="text-xs text-primary font-medium shrink-0">{med.totalDuration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Exercises from Program */}
      <div className="px-5 mt-2">
        <h2 className="text-base font-semibold text-foreground mb-3">
          מהתוכנית השבועית
        </h2>
        <div className="space-y-3">
          {exercisesByCategory[activeCategory].map((item, index) => (
            <button
              key={`${item.weekNumber}-${index}`}
              onClick={() => navigate(`/weeks/${item.weekNumber}`)}
              className="w-full bg-card rounded-2xl p-4 border border-border text-right transition-all duration-200 hover:shadow-md hover:border-primary/20 active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      שבוע {item.weekNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.exercise.duration}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{item.exercise.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {item.exercise.description}
                  </p>
                </div>
                <div className="text-2xl mt-1">{item.exercise.icon}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Tools;
