import { useState, useEffect, useCallback } from 'react';

export interface ProgressData {
  completedExercises: Record<string, string[]>; // weekNumber -> completed category[]
}

const STORAGE_KEY = 'exercise-progress';
const UNLOCK_THRESHOLD = 0.75;

function loadProgress(): ProgressData {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { completedExercises: {} };
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const toggleExerciseComplete = useCallback((weekNumber: number, category: string) => {
    setProgress(prev => {
      const key = String(weekNumber);
      const current = prev.completedExercises[key] || [];
      const updated = current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category];
      return {
        ...prev,
        completedExercises: { ...prev.completedExercises, [key]: updated },
      };
    });
  }, []);

  const isExerciseComplete = useCallback((weekNumber: number, category: string) => {
    return (progress.completedExercises[String(weekNumber)] || []).includes(category);
  }, [progress]);

  const getWeekProgress = useCallback((weekNumber: number, totalExercises: number) => {
    const completed = (progress.completedExercises[String(weekNumber)] || []).length;
    return { completed, total: totalExercises, ratio: totalExercises > 0 ? completed / totalExercises : 0 };
  }, [progress]);

  const getUnlockedWeek = useCallback(() => {
    // Find the highest week where progress >= threshold, then unlock next
    for (let w = 10; w >= 1; w--) {
      const completed = (progress.completedExercises[String(w)] || []).length;
      if (completed >= 4 * UNLOCK_THRESHOLD) {
        return w + 1; // unlock up to this week + 1
      }
    }
    return 1;
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress({ completedExercises: {} });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { progress, toggleExerciseComplete, isExerciseComplete, getWeekProgress, getUnlockedWeek, resetProgress };
}
