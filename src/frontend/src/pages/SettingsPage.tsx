import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Info, TestTube } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useNotifications } from "../hooks/useNotifications";

export default function SettingsPage() {
  const { enabled, permission, toggle, testNotification } = useNotifications();

  const handleToggle = async (value: boolean) => {
    const success = await toggle(value);
    if (!success && value) {
      toast.error(
        "Notification permission denied. Please enable it in your browser settings.",
      );
    } else if (success && value) {
      toast.success("Daily reminders enabled! You will be notified at 9 AM.");
    } else {
      toast("Daily reminders disabled.");
    }
  };

  const handleTest = () => {
    if (permission !== "granted") {
      toast.error("Please enable notifications first.");
      return;
    }
    testNotification();
    toast.success("Test notification sent!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pt-10 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-2xl font-bold text-foreground mb-6">
            Settings
          </h1>

          <section className="mb-6">
            <h2 className="text-xs font-body font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">
              Notifications
            </h2>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
                    {enabled ? (
                      <Bell className="w-4 h-4 text-primary" />
                    ) : (
                      <BellOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="notification-switch"
                      className="font-body font-semibold text-foreground cursor-pointer"
                    >
                      Daily Word Reminder
                    </Label>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">
                      Get notified at 9 AM to learn your word of the day
                    </p>
                  </div>
                </div>
                <Switch
                  id="notification-switch"
                  data-ocid="settings.notification.switch"
                  checked={enabled}
                  onCheckedChange={handleToggle}
                />
              </div>

              {permission === "denied" && (
                <div className="mx-4 mb-4 flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2">
                  <Info className="w-3.5 h-3.5 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-destructive font-body">
                    Notifications are blocked. Please update your browser
                    permissions.
                  </p>
                </div>
              )}

              {enabled && permission === "granted" && (
                <div className="border-t border-border px-4 pb-4 pt-3">
                  <button
                    type="button"
                    onClick={handleTest}
                    className="flex items-center gap-2 text-xs font-body font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <TestTube className="w-3.5 h-3.5" />
                    Send test notification
                  </button>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-body font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">
              About
            </h2>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Daily Vocabulary helps you expand your lexical repertoire one
                word at a time. Each day brings a new word across three
                difficulty levels.
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground font-body">
                  {"\u00a9 "}
                  {new Date().getFullYear()}
                  {". "}
                  <a
                    href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Built with caffeine.ai
                  </a>
                </span>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
