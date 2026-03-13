import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useCallback, useRef, useState } from "react";
import { WordCardDisplay } from "../components/WordCardDisplay";
import { WordCardSkeleton } from "../components/WordCardSkeleton";
import {
  useBookmarkWord,
  useBookmarkedWords,
  useRemoveBookmark,
  useTotalWordCount,
  useWordByIndex,
  useWordsByLevel,
} from "../hooks/useQueries";

type Level = "all" | "easy" | "medium" | "hard";

const SAMPLE_WORDS = [
  {
    word: "Serendipity",
    partOfSpeech: "noun",
    definition:
      "The occurrence of fortunate events by chance in a happy or beneficial way.",
    exampleSentence: "Finding that rare first edition was pure serendipity.",
    etymology: "Coined by Horace Walpole in 1754 from a Persian fairy tale.",
    level: "easy",
  },
  {
    word: "Loquacious",
    partOfSpeech: "adjective",
    definition:
      "Tending to talk a great deal; garrulous and verbose in speech or writing.",
    exampleSentence:
      "The loquacious professor could turn a five-minute topic into a two-hour lecture.",
    etymology: "Latin loquax — talkative (loqui to speak)",
    level: "medium",
  },
  {
    word: "Perspicacious",
    partOfSpeech: "adjective",
    definition:
      "Having a ready insight into things; shrewdly perceptive with keen discernment.",
    exampleSentence:
      "Her perspicacious analysis revealed flaws no one else had noticed.",
    etymology: "Latin perspicax — of sharp sight (perspicere to see through)",
    level: "hard",
  },
  {
    word: "Melancholy",
    partOfSpeech: "noun",
    definition:
      "A feeling of pensive sadness, typically with no obvious cause; deep thoughtfulness.",
    exampleSentence:
      "A profound melancholy settled over him as the last leaves fell.",
    etymology: "Greek melankholia — black bile (melas black + khole bile)",
    level: "easy",
  },
  {
    word: "Sycophant",
    partOfSpeech: "noun",
    definition:
      "A person who acts obsequiously toward someone important in order to gain advantage or favour.",
    exampleSentence:
      "The CEO surrounded himself with sycophants who never challenged his decisions.",
    etymology: "Greek sykophantes — informer, slanderer",
    level: "medium",
  },
  {
    word: "Sesquipedalian",
    partOfSpeech: "adjective",
    definition:
      "Given to using long, obscure words; characterized by long words and elaborate expression.",
    exampleSentence:
      "His sesquipedalian speeches left audiences more confused than enlightened.",
    etymology: "Latin sesquipedalis — a foot and a half long",
    level: "hard",
  },
  {
    word: "Ephemeral",
    partOfSpeech: "adjective",
    definition:
      "Lasting for a very short time; transitory and fleeting in nature.",
    exampleSentence:
      "The ephemeral beauty of cherry blossoms makes their brief bloom precious.",
    etymology: "Greek ephemeros — lasting only a day",
    level: "easy",
  },
  {
    word: "Obfuscate",
    partOfSpeech: "verb",
    definition:
      "To render obscure, unclear, or unintelligible; to deliberately make something confusing.",
    exampleSentence:
      "The politician's vague answers only served to obfuscate the real issue.",
    etymology: "Latin obfuscare — to darken (ob- over + fuscus dark)",
    level: "medium",
  },
  {
    word: "Defenestration",
    partOfSpeech: "noun",
    definition:
      "The action of throwing someone or something out of a window; dismissal from a position.",
    exampleSentence:
      "The defenestration of Prague in 1618 sparked the Thirty Years War.",
    etymology: "Latin fenestra — window",
    level: "hard",
  },
];

const LEVEL_DOTS = ["d0", "d1", "d2", "d3", "d4"];

export default function BrowsePage() {
  const [level, setLevel] = useState<Level>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");

  // "all" mode: fetch by global index
  const { data: totalCount } = useTotalWordCount();
  const { data: currentWord, isLoading: isLoadingAll } = useWordByIndex(
    level === "all" ? BigInt(currentIndex) : null,
  );

  // filtered mode: fetch all words for the level, index locally
  const { data: levelWords, isLoading: isLoadingLevel } = useWordsByLevel(
    level !== "all" ? level : null,
  );

  const { data: bookmarks = [] } = useBookmarkedWords();
  const bookmark = useBookmarkWord();
  const removeBookmark = useRemoveBookmark();

  const samplesByLevel =
    level === "all"
      ? SAMPLE_WORDS
      : SAMPLE_WORDS.filter((w) => w.level === level);

  // Determine the active word list and current display word
  let displayWord: (typeof SAMPLE_WORDS)[0] | null | undefined;
  let maxIndex: number;
  let total: number;
  const isLoading = level === "all" ? isLoadingAll : isLoadingLevel;

  if (level === "all") {
    total = Number(totalCount ?? samplesByLevel.length);
    maxIndex = total - 1;
    displayWord =
      currentWord ??
      samplesByLevel[currentIndex % Math.max(samplesByLevel.length, 1)];
  } else {
    // Use backend level words if available, else fall back to filtered samples
    const activeList =
      levelWords && levelWords.length > 0 ? levelWords : samplesByLevel;
    total = activeList.length;
    maxIndex = total - 1;
    displayWord = activeList[currentIndex % Math.max(activeList.length, 1)];
  }

  const isBookmarked = bookmarks.some((b) => b.word === displayWord?.word);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    setDirection("left");
    setCurrentIndex((i) => i + 1);
  }, [canGoNext]);

  const goPrev = useCallback(() => {
    if (!canGoPrev) return;
    setDirection("right");
    setCurrentIndex((i) => i - 1);
  }, [canGoPrev]);

  const handleBookmarkToggle = () => {
    if (isBookmarked) removeBookmark.mutate(BigInt(currentIndex));
    else bookmark.mutate(BigInt(currentIndex));
  };

  const dragX = useMotionValue(0);
  const cardRotate = useTransform(dragX, [-200, 200], [-8, 8]);
  const cardOpacity = useTransform(
    dragX,
    [-200, -80, 0, 80, 200],
    [0.4, 1, 1, 1, 0.4],
  );
  const constraintsRef = useRef<HTMLDivElement>(null);
  const wheelCooldownRef = useRef(false);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (wheelCooldownRef.current) return;
      wheelCooldownRef.current = true;
      setTimeout(() => {
        wheelCooldownRef.current = false;
      }, 400);
      if (e.deltaY > 0) goNext();
      else if (e.deltaY < 0) goPrev();
    },
    [goNext, goPrev],
  );

  const handleDragEnd = useCallback(
    (
      _e: MouseEvent | TouchEvent | PointerEvent,
      info: { offset: { x: number } },
    ) => {
      if (info.offset.x < -50) goNext();
      else if (info.offset.x > 50) goPrev();
      dragX.set(0);
    },
    [goNext, goPrev, dragX],
  );

  const variants = {
    enter: (dir: "left" | "right") => ({
      x: dir === "left" ? 220 : -220,
      opacity: 0,
      scale: 0.92,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: "left" | "right") => ({
      x: dir === "left" ? -220 : 220,
      opacity: 0,
      scale: 0.92,
    }),
  };

  const dotCount = Math.min(5, Math.max(total, samplesByLevel.length));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pt-10 pb-28">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            Browse Words
          </h1>
          <div className="flex gap-2 flex-wrap">
            {(["all", "easy", "medium", "hard"] as Level[]).map((l) => (
              <button
                type="button"
                key={l}
                data-ocid={l !== "all" ? `level.${l}.tab` : undefined}
                onClick={() => {
                  setLevel(l);
                  setCurrentIndex(0);
                  setDirection("left");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-wide uppercase border transition-all ${
                  level === l
                    ? l === "easy"
                      ? "level-easy border"
                      : l === "medium"
                        ? "level-medium border"
                        : l === "hard"
                          ? "level-hard border"
                          : "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {l === "all" ? "All" : l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground font-body">
            Word {currentIndex + 1} of{" "}
            {total > 0 ? total : samplesByLevel.length}
          </span>
          <span className="text-xs text-muted-foreground font-body">
            Swipe or use arrows
          </span>
        </div>

        <div
          ref={constraintsRef}
          className="relative overflow-visible"
          onWheel={handleWheel}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${currentIndex}-${level}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 280, damping: 30 },
                opacity: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
                scale: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
              }}
              style={{ rotate: cardRotate, opacity: cardOpacity, x: dragX }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="swipe-card cursor-grab active:cursor-grabbing"
            >
              {isLoading ? (
                <WordCardSkeleton />
              ) : displayWord ? (
                <WordCardDisplay
                  word={displayWord}
                  index={BigInt(currentIndex)}
                  isBookmarked={isBookmarked}
                  onBookmarkToggle={handleBookmarkToggle}
                  animate={false}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-5">
          <button
            type="button"
            data-ocid="word.prev.button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-body font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex gap-1.5">
            {LEVEL_DOTS.slice(0, dotCount).map((dotId, i) => (
              <div
                key={dotId}
                className={`rounded-full transition-all ${
                  i === currentIndex % 5
                    ? "w-4 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-muted"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            data-ocid="word.next.button"
            onClick={goNext}
            disabled={!canGoNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-body font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
