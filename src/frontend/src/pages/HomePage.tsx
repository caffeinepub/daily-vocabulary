import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
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

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: word, isLoading, isError } = useWordOfTheDay();
  const { data: bookmarks = [] } = useBookmarkedWords();
  const bookmark = useBookmarkWord();
  const removeBookmark = useRemoveBookmark();

  const displayWord = word ?? SAMPLE_WORD;
  const isBookmarked = bookmarks.some((b) => b.word === displayWord.word);

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
        <div className="max-w-md mx-auto px-4 pt-12 pb-28">
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
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h1>
          </motion.div>

          {isLoading && <WordCardSkeleton />}

          {isError && (
            <div
              data-ocid="word.error_state"
              className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center mb-4"
            >
              <p className="text-destructive font-body text-sm">
                Unable to load today's word — showing a sample.
              </p>
            </div>
          )}

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
