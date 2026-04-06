import React, { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { useJournal } from '@/hooks/useJournal';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

const MOOD_EMOJIS = ['😰', '😟', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩', '✨', '🌟'];
const MOOD_COLORS = [
  'bg-destructive/10 border-destructive/20',
  'bg-destructive/5 border-destructive/15',
  'bg-accent/10 border-accent/20',
  'bg-accent/5 border-accent/15',
  'bg-secondary border-border',
  'bg-secondary border-border',
  'bg-primary/5 border-primary/10',
  'bg-primary/10 border-primary/15',
  'bg-primary/15 border-primary/20',
  'bg-primary/20 border-primary/25',
  'bg-primary/25 border-primary/30',
];

const Journal: React.FC = () => {
  const { addEntry, getTodayEntry, getLast7Days, entries } = useJournal();
  const todayEntry = getTodayEntry();
  const [mood, setMood] = useState<number>(todayEntry?.mood ?? 5);
  const [note, setNote] = useState(todayEntry?.note ?? '');
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const last7Days = getLast7Days();

  const handleSave = () => {
    addEntry(mood, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir="rtl">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-semibold text-foreground animate-fade-up">יומן</h1>
        <p className="text-muted-foreground mt-1 animate-fade-up-delay-1">
          איך את/ה מרגיש/ה היום?
        </p>
      </div>

      {/* Mood Selector */}
      <div className="px-6 mb-6 animate-fade-up-delay-1">
        <div className="bg-card rounded-3xl p-6 border border-border/50">
          {/* Emoji display */}
          <div className="text-center mb-6">
            <span className="text-6xl block mb-2">{MOOD_EMOJIS[mood]}</span>
            <span className="text-foreground font-semibold text-lg">{mood}/10</span>
          </div>

          {/* Slider */}
          <div className="relative mb-2">
            <input
              type="range"
              min="0"
              max="10"
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              style={{
                background: `linear-gradient(to left, hsl(var(--primary)) ${mood * 10}%, hsl(var(--muted)) ${mood * 10}%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>קשה</span>
            <span>מצוין</span>
          </div>
        </div>
      </div>

      {/* Free Text */}
      <div className="px-6 mb-6 animate-fade-up-delay-2">
        <div className="bg-card rounded-3xl p-5 border border-border/50">
          <h3 className="text-foreground font-semibold text-base mb-3">מה עובר עליך?</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="כתבו מה שבא לכם... (לא חובה)"
            rows={4}
            className="w-full bg-background border border-border rounded-2xl p-4 text-foreground text-base leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="px-6 mb-8 animate-fade-up-delay-3">
        <button
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl text-base font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            saved
              ? 'bg-primary/20 text-primary'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" />
              נשמר!
            </>
          ) : (
            todayEntry ? 'עדכון הרשומה' : 'שמירה'
          )}
        </button>
      </div>

      {/* Weekly Chart */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-3xl p-5 border border-border/50">
          <h3 className="text-foreground font-semibold text-base mb-4">7 הימים האחרונים</h3>
          
          {/* Bar chart */}
          <div className="flex items-end justify-between gap-2 h-36 mb-3">
            {last7Days.map((day) => {
              const hasMood = day.entry !== undefined;
              const barHeight = hasMood ? Math.max((day.entry!.mood / 10) * 100, 8) : 0;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  {hasMood && (
                    <span className="text-xs text-muted-foreground">{day.entry!.mood}</span>
                  )}
                  <div className="w-full flex items-end" style={{ height: '100%' }}>
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        hasMood ? 'bg-primary/70' : 'bg-muted/50'
                      }`}
                      style={{ height: hasMood ? `${barHeight}%` : '4px', minHeight: hasMood ? '8px' : '4px' }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${
                    day.date === new Date().toISOString().split('T')[0]
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}>
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* History */}
      {entries.length > 0 && (
        <div className="px-6 mb-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-primary text-sm font-medium mb-3 hover:opacity-80 transition-opacity"
          >
            {showHistory ? 'הסתר היסטוריה' : 'הצג היסטוריה'}
            <ChevronLeft className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-90' : '-rotate-90'}`} />
          </button>

          {showHistory && (
            <div className="space-y-2">
              {entries.slice(0, 14).map((entry) => (
                <div
                  key={entry.id}
                  className={`rounded-2xl p-4 border ${MOOD_COLORS[entry.mood]}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{formatDate(entry.date)}</span>
                    <span className="text-lg">{MOOD_EMOJIS[entry.mood]} {entry.mood}/10</span>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">{entry.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Journal;
