import React, { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { useJournal, type MoodLabel } from '@/hooks/useJournal';
import { Check, Trash2, BookOpen } from 'lucide-react';

const MOOD_LABELS: { id: MoodLabel; emoji: string }[] = [
  { id: 'רגוע', emoji: '😌' },
  { id: 'לחוץ', emoji: '😟' },
  { id: 'מוצף', emoji: '😰' },
  { id: 'עייף', emoji: '😴' },
  { id: 'לא בטוח', emoji: '🤷' },
];

const Journal: React.FC = () => {
  const { addEntry, deleteEntry, entries } = useJournal();
  const [selectedMood, setSelectedMood] = useState<MoodLabel | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

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
    addEntry(moodToNumber(selectedMood), note.trim(), selectedMood);
    setSaved(true);
    setNote('');
    setSelectedMood(null);
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
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
