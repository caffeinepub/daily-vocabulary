import { useCallback, useEffect, useState } from "react";

const KEY_ENABLED = "vocab_notifications_enabled";
const KEY_LAST = "vocab_last_notified";

export function useNotifications() {
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem(KEY_ENABLED) === "true",
  );
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default",
  );

  const scheduleDaily = useCallback(() => {
    if (
      typeof Notification === "undefined" ||
      Notification.permission !== "granted"
    )
      return;
    const today = new Date().toDateString();
    if (localStorage.getItem(KEY_LAST) === today) return;
    const now = new Date();
    const next = new Date(now);
    next.setHours(9, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const ms = next.getTime() - now.getTime();
    const timer = setTimeout(() => {
      new Notification("Your Daily Word Awaits!", {
        body: "Open Vocabulary to discover today's new word.",
        icon: "/favicon.ico",
        tag: "daily-vocab",
      });
      localStorage.setItem(KEY_LAST, new Date().toDateString());
    }, ms);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cleanup = scheduleDaily();
    return cleanup;
  }, [enabled, scheduleDaily]);

  const toggle = useCallback(async (value: boolean) => {
    if (
      value &&
      typeof Notification !== "undefined" &&
      Notification.permission === "default"
    ) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return false;
    }
    localStorage.setItem(KEY_ENABLED, String(value));
    setEnabled(value);
    return true;
  }, []);

  const testNotification = useCallback(() => {
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      new Notification("Test: Your Daily Word Awaits!", {
        body: "Open Vocabulary to discover today's new word.",
        icon: "/favicon.ico",
        tag: "daily-vocab-test",
      });
    }
  }, []);

  return { enabled, permission, toggle, testNotification };
}
