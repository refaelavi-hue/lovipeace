import { useState, useEffect, useCallback } from 'react';

export interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

const STORAGE_KEY = 'reminder-settings';

const DEFAULT: ReminderSettings = { enabled: false, hour: 9, minute: 0 };

function load(): ReminderSettings {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT;
}

export function useReminders() {
  const [settings, setSettings] = useState<ReminderSettings>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const updateSettings = useCallback((updates: Partial<ReminderSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const sendTestNotification = useCallback(() => {
    if (Notification.permission === 'granted') {
      new Notification('תזכורת לתרגול 🧘', {
        body: 'הגיע הזמן לתרגול היומי שלך. קחו כמה דקות לעצמכם.',
        icon: '/favicon.ico',
      });
    }
  }, []);

  // Schedule daily check (simplified — real scheduling needs service worker)
  useEffect(() => {
    if (!settings.enabled || Notification.permission !== 'granted') return;

    const check = () => {
      const now = new Date();
      if (now.getHours() === settings.hour && now.getMinutes() === settings.minute) {
        new Notification('תזכורת לתרגול 🧘', {
          body: 'הגיע הזמן לתרגול היומי שלך. קחו כמה דקות לעצמכם.',
          icon: '/favicon.ico',
        });
      }
    };

    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [settings]);

  return { settings, updateSettings, requestPermission, sendTestNotification };
}
