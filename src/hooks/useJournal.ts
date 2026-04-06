import { useState, useEffect, useCallback } from 'react';

export interface JournalEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  mood: number; // 0-10
  note: string;
  createdAt: string;
}

const STORAGE_KEY = 'journal-entries';

function loadEntries(): JournalEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = useCallback((mood: number, note: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = entries.findIndex(e => e.date === today);
    
    if (existing >= 0) {
      // Update today's entry
      setEntries(prev => prev.map((e, i) => 
        i === existing ? { ...e, mood, note, createdAt: new Date().toISOString() } : e
      ));
    } else {
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        date: today,
        mood,
        note,
        createdAt: new Date().toISOString(),
      };
      setEntries(prev => [entry, ...prev]);
    }
  }, [entries]);

  const getTodayEntry = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(e => e.date === today);
  }, [entries]);

  const getWeekEntries = useCallback((weeksAgo = 0) => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - start.getDay() - (weeksAgo * 7));
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    
    return entries.filter(e => {
      const d = new Date(e.date);
      return d >= start && d < end;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  const getLast7Days = useCallback(() => {
    const days: { date: string; label: string; entry?: JournalEntry }[] = [];
    const dayLabels = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        label: dayLabels[d.getDay()],
        entry: entries.find(e => e.date === dateStr),
      });
    }
    return days;
  }, [entries]);

  return { entries, addEntry, getTodayEntry, getWeekEntries, getLast7Days };
}
