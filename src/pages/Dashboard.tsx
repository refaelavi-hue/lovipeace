import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
import BottomNav from '@/components/BottomNav';
import { Heart, Sparkles, Calendar, Wind, Volume2 } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { useRecentMeditations } from '@/hooks/useRecentMeditations';
import { WEEKS_DATA } from '@/data/weeksData';
import { GUIDED_MEDITATIONS } from '@/data/guidedMeditations';
import { getIllustration } from '@/data/meditationIllustrations';
import { g } from '@/lib/genderedText';

const Dashboard: React.FC = () => {
  const { profile } = useOnboarding();
  const navigate = useNavigate();
  const { getUnlockedWeek } = useProgress();
  const { recent } = useRecentMeditations();
  const currentWeek = Math.min(getUnlockedWeek(), 10);

  const recentMeditations = recent
    .map((id) => GUIDED_MEDITATIONS.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'בוקר טוב';
    if (hour < 17) return 'צהריים טובים';
    return 'ערב טוב';
  };

  const gender = profile.gender || 'female';
  const question = g(gender, 'מה את צריכה עכשיו?', 'מה אתה צריך עכשיו?');

  const actions = [
    {
      label: 'מדיטציית שקט 16 דק׳',
      subtitle: 'צליל קערה טיבטית בהתחלה ובסוף — ובאמצע, שקט',
      icon: Volume2,
      path: '/exercise/silent-16',
      accent: true,
    },
    {
      label: 'הרגעה מהירה',
      subtitle: g(gender, 'עזרה מיידית ברגע של חרדה', 'עזרה מיידית ברגע של חרדה'),
      icon: Wind,
      path: '/quick',
      accent: false,
    },
    {
      label: 'SOS',
      subtitle: g(gender, 'אני צריכה עזרה עכשיו', 'אני צריך עזרה עכשיו'),
      icon: Heart,
      path: '/sos',
      accent: false,
    },
    {
      label: 'תרגול יומי',
      subtitle: WEEKS_DATA[currentWeek - 1]?.title || 'נשימה + קרקוע',
      icon: Sparkles,
      path: `/weeks/${currentWeek}`,
      accent: false,
    },
    {
      label: 'השבוע שלי',
      subtitle: `שבוע ${currentWeek}`,
      icon: Calendar,
      path: '/weeks',
      accent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-28" dir="rtl">
      {/* Greeting */}
      <div className="px-8 pt-14 pb-4">
        <p className="text-muted-foreground text-sm">{greeting()}</p>
        <h1 className="text-2xl font-semibold text-foreground mt-1">
          {profile.name} 💛
        </h1>
      </div>

      {/* Central question */}
      <div className="px-8 pt-4 pb-8">
        <p className="text-foreground/80 text-lg font-medium">{question}</p>
      </div>

      {/* 3 Action Cards */}
      <div className="px-8 flex flex-col gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`w-full rounded-3xl p-6 text-right transition-all duration-300 active:scale-[0.97] ${
                action.accent
                  ? 'bg-accent/15 border border-accent/25 hover:bg-accent/20'
                  : 'bg-card border border-border hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-2xl p-3 ${
                    action.accent ? 'bg-accent/20' : 'bg-primary/10'
                  }`}
                >
                  <Icon
                    size={24}
                    className={action.accent ? 'text-accent' : 'text-primary'}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-foreground text-lg font-semibold">
                    {action.label}
                  </span>
                  <span className="text-muted-foreground text-sm mt-0.5">
                    {action.subtitle}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recently Played */}
      {recentMeditations.length > 0 && (
        <div className="mt-10">
          <div className="px-8 mb-3 flex items-center gap-2">
            <div className="h-0.5 w-8 bg-primary rounded-full" />
            <h2 className="text-foreground text-sm font-semibold tracking-wide">
              נוגנו לאחרונה
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-8 pb-2 scrollbar-none">
            {recentMeditations.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/exercise/${m.id}`)}
                className="shrink-0 w-36 rounded-2xl bg-card border border-border p-4 text-right hover:bg-muted transition-colors active:scale-[0.97]"
              >
                <span className="text-3xl block mb-3">{m.icon}</span>
                <span className="text-foreground text-sm font-semibold block leading-tight">
                  {m.title}
                </span>
                <span className="text-muted-foreground text-xs mt-1 block">
                  {m.totalDuration}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Safety note */}
      <p className="text-muted-foreground text-xs text-center px-8 mt-6 mb-4">
        האפליקציה היא כלי עזר ואינה מחליפה טיפול מקצועי.
      </p>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
