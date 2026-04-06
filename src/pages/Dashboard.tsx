import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
import WeekCard from '@/components/WeekCard';
import BottomNav from '@/components/BottomNav';
import { Heart, Wind, Sparkles } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { WEEKS_DATA } from '@/data/weeksData';

const Dashboard: React.FC = () => {
  const { profile } = useOnboarding();
  const navigate = useNavigate();
  const { getUnlockedWeek, getWeekProgress } = useProgress();
  const currentWeek = Math.min(getUnlockedWeek(), 10);
  const weekProgress = getWeekProgress(currentWeek, WEEKS_DATA[currentWeek - 1]?.exercises.length || 4);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'בוקר טוב';
    if (hour < 17) return 'צהריים טובים';
    return 'ערב טוב';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <p className="text-muted-foreground text-sm animate-fade-up">{greeting()}</p>
        <h1 className="text-2xl font-semibold text-foreground mt-1 animate-fade-up-delay-1">
          {profile.name} 💛
        </h1>
        <p className="text-muted-foreground mt-2 animate-fade-up-delay-2">
          מה בא לך לחקור היום?
        </p>
      </div>

      {/* Daily Practice Card */}
      <div className="px-6 mb-6 animate-fade-up-delay-2">
        <button
          className="w-full rounded-3xl bg-primary/15 border border-primary/20 p-6 text-right transition-all duration-300 hover:bg-primary/20 active:scale-[0.98]"
          onClick={() => navigate(`/weeks/${currentWeek}`)}
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={20} className="text-primary" />
            <span className="text-primary font-medium">התרגול היומי שלך</span>
          </div>
          <p className="text-foreground text-lg font-semibold">נשימה + קרקוע</p>
          <p className="text-muted-foreground text-sm mt-1">15 דקות · בוקר</p>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8 animate-fade-up-delay-3">
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/sos')}
            className="flex-1 rounded-2xl bg-accent/15 border border-accent/20 p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:bg-accent/25 active:scale-[0.98]"
          >
            <Heart size={24} className="text-accent" />
            <span className="text-accent font-medium text-sm">SOS</span>
          </button>
          <button
            onClick={() => navigate('/exercise/breathing-calm')}
            className="flex-1 rounded-2xl bg-card border border-border p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:bg-muted active:scale-[0.98]"
          >
            <Wind size={24} className="text-primary" />
            <span className="text-foreground font-medium text-sm">נשימה מהירה</span>
          </button>
        </div>
      </div>

      {/* Current Week */}
      <div className="px-6">
        <h2 className="text-muted-foreground text-sm font-medium mb-4">השבוע שלך</h2>
        <WeekCard
          weekNumber={currentWeek}
          title={WEEKS_DATA[currentWeek - 1].title}
          description={WEEKS_DATA[currentWeek - 1].subtitle}
          isActive={true}
        />
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
