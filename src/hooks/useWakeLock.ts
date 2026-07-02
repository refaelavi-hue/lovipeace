import { useEffect, useRef } from 'react';

/**
 * Keeps the screen awake while `active` is true, using the Screen Wake Lock API.
 * Silently no-ops on unsupported browsers (e.g. iOS Safari < 16.4).
 * Re-acquires the lock if the tab becomes visible again after being hidden.
 */
export function useWakeLock(active: boolean) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active) return;
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;

    let cancelled = false;

    const request = async () => {
      try {
        const sentinel = await (navigator as Navigator & {
          wakeLock: { request: (type: 'screen') => Promise<WakeLockSentinel> };
        }).wakeLock.request('screen');
        if (cancelled) {
          sentinel.release().catch(() => {});
          return;
        }
        sentinelRef.current = sentinel;
        sentinel.addEventListener('release', () => {
          if (sentinelRef.current === sentinel) sentinelRef.current = null;
        });
      } catch {
        // User denied / battery saver / not allowed — ignore.
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !sentinelRef.current) {
        request();
      }
    };

    request();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {});
        sentinelRef.current = null;
      }
    };
  }, [active]);
}
