import { Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "motion/react";
import type { FC } from "react";
import type { VocabularyEntry } from "../backend.d";
import { LevelBadge } from "./LevelBadge";

interface WordCardDisplayProps {
  word: VocabularyEntry;
  index?: bigint;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  animate?: boolean;
  className?: string;
}

export const WordCardDisplay: FC<WordCardDisplayProps> = ({
  word,
  isBookmarked = false,
  onBookmarkToggle,
  animate = true,
  className = "",
}) => {
  const accentClass =
    word.level?.toLowerCase() === "easy"
      ? "from-transparent via-[oklch(0.72_0.16_142)] to-transparent"
      : word.level?.toLowerCase() === "medium"
        ? "from-transparent via-[oklch(0.78_0.16_85)] to-transparent"
        : "from-transparent via-[oklch(0.62_0.22_25)] to-transparent";

  const inner = (
    <div
      data-ocid="word.card"
      className={`relative rounded-2xl border border-border bg-card overflow-hidden ${className}`}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${accentClass}`} />
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <LevelBadge level={word.level || "medium"} />
              <span className="text-xs text-muted-foreground font-body italic">
                {word.partOfSpeech}
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
              {word.word}
            </h2>
          </div>
          {onBookmarkToggle && (
            <button
              type="button"
              data-ocid="word.bookmark.toggle"
              onClick={onBookmarkToggle}
              className="mt-1 p-2.5 rounded-xl border border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-primary" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        <p className="text-foreground/90 font-body text-base md:text-lg leading-relaxed mb-5">
          {word.definition}
        </p>
        {word.exampleSentence && (
          <div className="mb-4 pl-4 border-l-2 border-primary/40">
            <p className="text-muted-foreground font-body text-sm italic leading-relaxed">
              &ldquo;{word.exampleSentence}&rdquo;
            </p>
          </div>
        )}
        {word.etymology && (
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest mr-2">
              Origin
            </span>
            <span className="text-sm font-body text-muted-foreground">
              {word.etymology}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (!animate) return inner;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {inner}
    </motion.div>
  );
};
