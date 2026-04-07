import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Watch, Heart, Activity, ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useJournal, type BodyMetrics } from '@/hooks/useJournal';
import { g } from '@/lib/genderedText';
import { toast } from 'sonner';

const Smartwatch: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useOnboarding();
  const { addEntry } = useJournal();
  const gender = profile.gender || 'male';

  const [heartRate, setHeartRate] = useState('');
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleSaveMetrics = () => {
    if (!heartRate && !stressLevel) return;
    const metrics: BodyMetrics = {
      heartRate: heartRate ? Math.min(220, Math.max(30, parseInt(heartRate))) : undefined,
      stressLevel: stressLevel ?? undefined,
    };
    addEntry(5, '', undefined, metrics);
    setSaved(true);
    setHeartRate('');
    setStressLevel(null);
    setTimeout(() => {
      setSaved(false);
      toast.success('המדדים נשמרו ביומן 💛');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir="rtl">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground text-sm mb-4 hover:text-foreground transition-colors"
          aria-label="חזרה"
        >
          <ArrowRight size={18} />
          <span>חזרה</span>
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Watch size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">שעון חכם</h1>
            <p className="text-muted-foreground text-sm">מעקב מדדי גוף</p>
          </div>
        </div>
      </div>

      {/* Status card */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30 animate-pulse" />
            <span className="text-foreground font-medium text-sm">לא מחובר</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {g(gender,
              'בקרוב תוכלי לחבר את השעון החכם שלך ולעקוב אחרי דופק, רמת מתח ואיכות שינה — ישירות מהאפליקציה.',
              'בקרוב תוכל לחבר את השעון החכם שלך ולעקוב אחרי דופק, רמת מתח ואיכות שינה — ישירות מהאפליקציה.')}
          </p>
        </div>
      </div>

      {/* What we'll track */}
      <div className="px-6 mb-6">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center justify-between w-full text-foreground font-medium text-sm mb-3"
          aria-expanded={showInfo}
        >
          <span>מה נעקוב?</span>
          {showInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {showInfo && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            {[
              { icon: <Heart size={18} className="text-red-400" />, title: 'דופק', desc: 'מעקב אחרי קצב הלב במנוחה ובזמן תרגול' },
              { icon: <Activity size={18} className="text-orange-400" />, title: 'רמת מתח', desc: 'זיהוי רגעי לחץ וחרדה על פי מדדי גוף' },
              { icon: <Watch size={18} className="text-primary" />, title: 'שינה', desc: 'הבנה טובה יותר של איכות השינה שלך' },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-2xl p-4 border border-border/50 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-background flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">{item.title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supported devices (coming soon) */}
      <div className="px-6 mb-6">
        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
          <p className="text-foreground text-sm font-medium mb-2">שעונים נתמכים (בקרוב)</p>
          <div className="flex flex-wrap gap-2">
            {['Apple Watch', 'Samsung Galaxy Watch', 'Garmin', 'Fitbit', 'Xiaomi Mi Band'].map((device) => (
              <span key={device} className="bg-background/80 text-muted-foreground text-xs px-3 py-1.5 rounded-xl border border-border/30">
                {device}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Manual entry toggle */}
      <div className="px-6 mb-4">
        <button
          onClick={() => setShowManual(!showManual)}
          className="w-full bg-card rounded-2xl p-4 border border-border/50 flex items-center justify-between hover:border-primary/20 transition-colors"
          aria-expanded={showManual}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart size={18} className="text-primary" />
            </div>
            <div className="text-right">
              <p className="text-foreground text-sm font-medium">הזנה ידנית</p>
              <p className="text-muted-foreground text-xs">
                {g(gender, 'הזיני מדדים בעצמך', 'הזן מדדים בעצמך')}
              </p>
            </div>
          </div>
          {showManual ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </button>
      </div>

      {/* Manual input form */}
      {showManual && (
        <div className="px-6 mb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Heart rate */}
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} className="text-red-400" />
              <span className="text-foreground text-sm font-medium">דופק</span>
              <span className="text-muted-foreground/60 text-xs">(פעימות לדקה)</span>
            </div>
            <input
              type="number"
              inputMode="numeric"
              min={30}
              max={220}
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="לדוגמה: 72"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-base placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="דופק בפעימות לדקה"
            />
          </div>

          {/* Stress level */}
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-orange-400" />
              <span className="text-foreground text-sm font-medium">רמת מתח</span>
              <span className="text-muted-foreground/60 text-xs">(1-10)</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <button
                  key={level}
                  onClick={() => setStressLevel(stressLevel === level ? null : level)}
                  aria-label={`רמת מתח ${level}`}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                    stressLevel === level
                      ? level <= 3
                        ? 'bg-green-500/20 border-2 border-green-500 text-green-700'
                        : level <= 6
                        ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-700'
                        : 'bg-red-500/20 border-2 border-red-500 text-red-700'
                      : 'bg-background border-2 border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-2 px-1">
              <span className="text-xs text-muted-foreground/50">נמוך</span>
              <span className="text-xs text-muted-foreground/50">בינוני</span>
              <span className="text-xs text-muted-foreground/50">גבוה</span>
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSaveMetrics}
            disabled={!heartRate && !stressLevel}
            className={`w-full py-4 rounded-2xl text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-30 ${
              saved
                ? 'bg-primary/20 text-primary'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                נשמר 💛
              </>
            ) : (
              'שמירה ביומן'
            )}
          </button>
        </div>
      )}

      {/* Privacy note */}
      <div className="px-6 mb-6">
        <p className="text-muted-foreground/60 text-xs text-center leading-relaxed">
          כל המידע נשמר רק במכשיר שלך ולא משותף עם אף גורם חיצוני.
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Smartwatch;
