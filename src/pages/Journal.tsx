import React, { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { useJournal, type MoodLabel, type BodyMetrics } from '@/hooks/useJournal';
import { Check, Trash2, Heart, Activity } from 'lucide-react';
import { AppIcon } from '@/components/AppIcon';

const MOOD_LABELS: { id: MoodLabel; emoji: string }[] = [
  { id: 'רגוע', emoji: '😌' },
  { id: 'לחוץ', emoji: '😟' },
  { id: 'מוצף', emoji: '😰' },
  { id: 'עייף', emoji: '😴' },
  { id: 'לא בטוח', emoji: '🤷' },
];

const STRESS_LABELS = ['נמוך', '', '', '', '', 'בינוני', '', '', '', '', 'גבוה'];

const Journal: React.FC = () => {
  const { addEntry, deleteEntry, entries } = useJournal();
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [heartRate, setHeartRate] = useState('');
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const moodToNumber = (label: MoodLabel): number => {
    switch (label) {
      case 'רגוע': return 8;
      case 'לחוץ': return 4;
      case 'מוצף': return 2;
      case 'עייף': return 5;
      case 'לא בטוח': return 5;
    }
  };

  const handleSave = () => {
    if (!selectedMood) return;
    const metrics: BodyMetrics | undefined =
      (heartRate || stressLevel)
        ? {
            heartRate: heartRate ? Math.min(220, Math.max(30, parseInt(heartRate))) : undefined,
            stressLevel: stressLevel ?? undefined,
          }
        : undefined;
    addEntry(moodToNumber(selectedMood), note.trim(), selectedMood, metrics);
    setSaved(true);
    setNote('');
    setSelectedMood(null);
    setHeartRate('');
    setStressLevel(null);
    setShowMetrics(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short', weekday: 'short' });
  };

  const formatTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  };

  const getMoodEmoji = (entry: { moodLabel?: MoodLabel }) => {
    const found = MOOD_LABELS.find(m => m.id === entry.moodLabel);
    return found?.emoji || '📝';
  };

  return (
    <div className="min-h-screen bg-background pb-24" dir="rtl">
      {/* Header */}
      <div className="px-6 pt-12 pb-2">
        <h1 className="text-2xl font-semibold text-foreground">יומן</h1>
        <p className="text-muted-foreground text-sm mt-1">מקום שקט לכתוב</p>
      </div>

      {/* Mood selector */}
      <div className="px-6 py-4">
        <p className="text-foreground text-base mb-3">איך את/ה עכשיו?</p>
        <div className="flex gap-2 flex-wrap">
          {MOOD_LABELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id)}
              aria-label={m.id}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                selectedMood === m.id
                  ? 'bg-primary/20 border-2 border-primary text-foreground'
                  : 'bg-card border-2 border-transparent text-muted-foreground hover:border-primary/20'
              }`}
            >
              <span className="text-lg">{m.emoji}</span>
              <span>{m.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body metrics toggle */}
      <div className="px-6 mb-2">
        <button
          onClick={() => setShowMetrics(!showMetrics)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-expanded={showMetrics}
          aria-label="הוסף מדדי גוף"
        >
          <Activity size={16} />
          <span>מדדי גוף (לא חובה)</span>
          <span className="text-xs">{showMetrics ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Body metrics inputs */}
      {showMetrics && (
        <div className="px-6 mb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Heart rate */}
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={18} className="text-red-400" />
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
              <Activity size={18} className="text-orange-400" />
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
              <span className="text-xs text-muted-foreground/50">{STRESS_LABELS[1]}</span>
              <span className="text-xs text-muted-foreground/50">{STRESS_LABELS[5]}</span>
              <span className="text-xs text-muted-foreground/50">{STRESS_LABELS[10]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Text area */}
      <div className="px-6 mb-4">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="מה עובר עליך? (לא חובה)"
          rows={4}
          className="w-full bg-card border border-border rounded-2xl p-4 text-foreground text-base leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>

      {/* Save */}
      <div className="px-6 mb-8">
        <button
          onClick={handleSave}
          disabled={!selectedMood}
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
            'שמירה'
          )}
        </button>
      </div>

      {/* Entries history */}
      <div className="px-6">
        <h2 className="text-foreground font-semibold text-base mb-4">רשומות קודמות</h2>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <BookOpen size={28} className="text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">עוד אין רשומות.</p>
            <p className="text-muted-foreground/60 text-xs mt-1">הרשומה הראשונה שלך מחכה 💛</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-card rounded-2xl p-4 border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getMoodEmoji(entry)}</span>
                    <div>
                      <span className="text-foreground text-sm font-medium">
                        {entry.moodLabel || 'רשומה'}
                      </span>
                      <p className="text-muted-foreground/60 text-xs">
                        {formatDate(entry.date)} · {formatTime(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
                    aria-label="מחק רשומה"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Body metrics display */}
                {entry.bodyMetrics && (entry.bodyMetrics.heartRate || entry.bodyMetrics.stressLevel) && (
                  <div className="flex gap-3 mb-2 pr-8">
                    {entry.bodyMetrics.heartRate && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Heart size={12} className="text-red-400" />
                        <span>{entry.bodyMetrics.heartRate} bpm</span>
                      </div>
                    )}
                    {entry.bodyMetrics.stressLevel && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Activity size={12} className="text-orange-400" />
                        <span>מתח: {entry.bodyMetrics.stressLevel}/10</span>
                      </div>
                    )}
                  </div>
                )}

                {entry.note && (
                  <p className="text-foreground/80 text-sm leading-relaxed pr-8">
                    {entry.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Journal;
