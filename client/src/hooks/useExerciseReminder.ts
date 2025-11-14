import { useState, useEffect, useRef, useCallback } from 'react';

interface UseExerciseReminderOptions {
  intervalMinutes: number;
  enabled: boolean;
  onReminder: () => void;
}

interface ReminderState {
  nextReminderTime: number | null;
  isActive: boolean;
  isSnoozed: boolean;
  showBanner: boolean;
}

const SNOOZE_MINUTES = 5;

export function useExerciseReminder({ intervalMinutes, enabled, onReminder }: UseExerciseReminderOptions) {
  const [state, setState] = useState<ReminderState>({
    nextReminderTime: null,
    isActive: false,
    isSnoozed: false,
    showBanner: false,
  });
  
  const timerRef = useRef<number | null>(null);
  const notificationPermission = useRef<NotificationPermission>('default');

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        notificationPermission.current = permission;
        return permission === 'granted';
      } catch (error) {
        console.error('Failed to request notification permission:', error);
        return false;
      }
    }
    return Notification.permission === 'granted';
  }, []);

  // Show browser notification or fallback to banner
  const showReminder = useCallback(async () => {
    onReminder();
    
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification('Time for Deskercise! 🎴', {
          body: 'Take a break and do a quick desk exercise',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'deskercise-reminder',
          requireInteraction: false,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
          setState(prev => ({ ...prev, showBanner: false }));
        };
        
        // Also show banner for snooze option
        setState(prev => ({ ...prev, showBanner: true }));
      } catch (error) {
        console.error('Failed to show notification:', error);
        // Fallback to banner
        setState(prev => ({ ...prev, showBanner: true }));
      }
    } else {
      // Show in-app banner if notifications not available/granted
      setState(prev => ({ ...prev, showBanner: true }));
    }
  }, [onReminder]);

  // Schedule next reminder
  const scheduleReminder = useCallback((delayMinutes: number, isSnoozed = false) => {
    // Clear any existing timer
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    const delayMs = delayMinutes * 60 * 1000;
    const nextTime = Date.now() + delayMs;

    setState(prev => ({
      ...prev,
      nextReminderTime: nextTime,
      isActive: true,
      isSnoozed,
    }));

    timerRef.current = window.setTimeout(() => {
      showReminder();
      // After showing reminder, schedule the next one at regular interval (not snoozed)
      if (enabled) {
        scheduleReminder(intervalMinutes, false);
      }
    }, delayMs);

    // Persist to localStorage
    localStorage.setItem('deskercise-reminder', JSON.stringify({
      nextReminderTime: nextTime,
      intervalMinutes,
      isSnoozed,
    }));
  }, [intervalMinutes, enabled, showReminder]);

  // Start the reminder timer
  const start = useCallback(async () => {
    if (!enabled) return;

    // Sync notification permission state
    if ('Notification' in window) {
      notificationPermission.current = Notification.permission;
    }

    // Request permission if not already granted
    await requestNotificationPermission();
    
    // Check if there's a scheduled reminder in localStorage
    const stored = localStorage.getItem('deskercise-reminder');
    if (stored) {
      try {
        const { nextReminderTime, intervalMinutes: storedInterval, isSnoozed } = JSON.parse(stored);
        const remainingMs = nextReminderTime - Date.now();
        
        // Only resume if interval hasn't changed and timer is still valid
        if (remainingMs > 0 && storedInterval === intervalMinutes) {
          // Resume existing timer
          scheduleReminder(remainingMs / (60 * 1000), isSnoozed);
          return;
        }
      } catch (error) {
        console.error('Failed to parse stored reminder:', error);
      }
    }

    // Start fresh timer with current interval
    scheduleReminder(intervalMinutes, false);
  }, [enabled, intervalMinutes, scheduleReminder, requestNotificationPermission]);

  // Stop the reminder timer
  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setState({
      nextReminderTime: null,
      isActive: false,
      isSnoozed: false,
      showBanner: false,
    });

    localStorage.removeItem('deskercise-reminder');
  }, []);

  // Snooze for 5 minutes
  const snooze = useCallback(() => {
    setState(prev => ({ ...prev, showBanner: false }));
    scheduleReminder(SNOOZE_MINUTES, true);
  }, [scheduleReminder]);

  // Dismiss/acknowledge the reminder
  const dismiss = useCallback(() => {
    setState(prev => ({ ...prev, showBanner: false }));
  }, []);

  // Reset timer (e.g., when exercise is completed)
  const reset = useCallback(() => {
    // Dismiss banner first
    setState(prev => ({ ...prev, showBanner: false }));
    
    // Reschedule with full interval if enabled
    if (enabled) {
      scheduleReminder(intervalMinutes, false);
    }
  }, [enabled, intervalMinutes, scheduleReminder]);

  // Initialize or restart when enabled/interval changes
  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  // NOTE: Intentionally omitting `start` and `stop` from dependencies to avoid infinite loop.
  // Including them would cause circular dependency: effect -> start -> scheduleReminder -> enabled/interval -> effect
  // We only want to re-run when enabled or intervalMinutes actually change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, intervalMinutes]);

  return {
    ...state,
    start,
    stop,
    snooze,
    dismiss,
    reset,
    hasNotificationPermission: notificationPermission.current === 'granted',
  };
}
