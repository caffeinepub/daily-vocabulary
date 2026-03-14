import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Page } from "../App";
import { WordCardDisplay } from "../components/WordCardDisplay";
import { WordCardSkeleton } from "../components/WordCardSkeleton";
import {
  useBookmarkWord,
  useBookmarkedWords,
  useRemoveBookmark,
  useWordOfTheDay,
} from "../hooks/useQueries";

const SAMPLE_WORD = {
  word: "Ephemeral",
  partOfSpeech: "adjective",
  definition:
    "Lasting for a very short time; transitory and fleeting, like a morning mist or a shooting star.",
  exampleSentence:
    "The ephemeral beauty of cherry blossoms makes their brief bloom all the more precious.",
  etymology: "Greek ephemeros — lasting only a day (epi- on + hemera day)",
  level: "medium",
};

/** Returns today's date string in IST (UTC+5:30) as YYYY-MM-DD */
function getTodayIST(): string {
  const now = new Date();
  // Offset to IST: UTC+5:30 = 330 minutes
  const istOffset = 330 * 60 * 1000;
  const istDate = new Date(
    now.getTime() + istOffset - now.getTimezoneOffset() * 60 * 1000,
  );
  return istDate.toISOString().split("T")[0];
}

/** Returns the ISO week key (e.g. "2026-W10") for a given YYYY-MM-DD string */
function getISOWeekKey(isoDate: string): string {
  const d = new Date(isoDate);
  const day = d.getUTCDay() || 7;
  const thursday = new Date(d);
  thursday.setUTCDate(d.getUTCDate() + (4 - day));
  const year = thursday.getUTCFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(
    ((thursday.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7,
  );
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function useWeeklyStreak() {
  const [daysThisWeek, setDaysThisWeek] = useState(0);

  useEffect(() => {
    const today = getTodayIST();
    const currentWeek = getISOWeekKey(today);

    const savedWeek = localStorage.getItem("weekly_streak_week");
    let days: string[] = [];

    if (savedWeek === currentWeek) {
      try {
        days = JSON.parse(localStorage.getItem("weekly_streak_days") ?? "[]");
      } catch {
        days = [];
      }
    }

    if (!days.includes(today)) {
      days = [...days, today];
    }

    localStorage.setItem("weekly_streak_week", currentWeek);
    localStorage.setItem("weekly_streak_days", JSON.stringify(days));
    setDaysThisWeek(days.length);
  }, []);

  return daysThisWeek;
}

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: word, isLoading } = useWordOfTheDay();
  const { data: bookmarks = [] } = useBookmarkedWords();
  const bookmark = useBookmarkWord();
  const removeBookmark = useRemoveBookmark();
  const daysThisWeek = useWeeklyStreak();

  const displayWord = word ?? SAMPLE_WORD;
  const isBookmarked = bookmarks.some((b) => b.word === displayWord.word);
  const weekPercent = Math.round((daysThisWeek / 7) * 100);

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmark.mutate(0n);
    } else {
      bookmark.mutate(0n);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/assets/generated/vocab-bg.dim_800x600.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="min-h-screen bg-background/85 backdrop-blur-[2px]">
        <div className="max-w-md mx-auto px-4 pt-8 pb-28">
          {/* Weekly progress bar */}
          {daysThisWeek > 0 && (
            <motion.div
              data-ocid="streak.panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-5 px-4 py-3 rounded-2xl bg-green-50/80 border border-green-200/70 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-body font-semibold text-green-700 tracking-wide">
                  This week
                </span>
                <span className="text-xs font-body font-medium text-green-600">
                  {daysThisWeek}/7 days
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-green-200/60 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-green-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${weekPercent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                Word of the Day
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Kolkata",
              })}
            </h1>
          </motion.div>

          {isLoading && <WordCardSkeleton />}

          {!isLoading && (
            <WordCardDisplay
              word={displayWord}
              isBookmarked={isBookmarked}
              onBookmarkToggle={handleBookmarkToggle}
              animate={true}
            />
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => onNavigate("browse")}
            className="mt-6 w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15 transition-colors"
          >
            <span className="font-body font-semibold text-sm">
              Browse more words
            </span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
