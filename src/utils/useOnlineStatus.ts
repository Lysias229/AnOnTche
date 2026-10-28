import { useState, useEffect } from 'react';

export interface OnlineStatusState {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  effectiveOnline: boolean;
  toggleSimulatedOffline: () => void;
  setSimulatedOffline: (val: boolean) => void;
}

export function useOnlineStatus(): OnlineStatusState {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && 'navigator' in window) {
      return navigator.onLine;
    }
    return true;
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('anontche_simulated_offline') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      sessionStorage.setItem('anontche_simulated_offline', next ? 'true' : 'false');
      return next;
    });
  };

  const setSimulatedOffline = (val: boolean) => {
    setIsSimulatedOffline(val);
    sessionStorage.setItem('anontche_simulated_offline', val ? 'true' : 'false');
  };

  const effectiveOnline = isOnline && !isSimulatedOffline;

  return {
    isOnline,
    isSimulatedOffline,
    effectiveOnline,
    toggleSimulatedOffline,
    setSimulatedOffline,
  };
}
