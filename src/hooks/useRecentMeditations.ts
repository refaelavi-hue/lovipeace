import { useCallback, useEffect, useState } from 'react';

const KEY = 'recent-meditations';
const MAX = 4;

export function useRecentMeditations() {
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  // Sync across tabs / navigation within same tab
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === KEY) {
        try {
          setRecent(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const record = useCallback((id: string) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
  }, []);

  return { recent, record, clear };
}
