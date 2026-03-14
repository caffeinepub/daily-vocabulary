import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { WordCardDisplay } from "../components/WordCardDisplay";
import { WordCardSkeleton } from "../components/WordCardSkeleton";
import {
  useBookmarkWord,
  useBookmarkedWords,
  useDailyWords,
  useDailyWordsByLevel,
  useRemoveBookmark,
  useTotalWordCount,
  useWordByIndex,
} from "../hooks/useQueries";

type Level = "daily" | "all" | "easy" | "medium" | "hard";

export const SAMPLE_WORDS = [
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
  {
    word: "Ebullient",
    partOfSpeech: "adjective",
    definition: "Cheerful and full of energy; enthusiastically exuberant.",
    exampleSentence:
      "Her ebullient personality made every gathering come alive.",
    etymology: "Latin ebullire — to boil up (e- out + bullire to boil)",
    level: "medium",
  },
  {
    word: "Petrichor",
    partOfSpeech: "noun",
    definition:
      "A pleasant smell that frequently accompanies the first rain after a long period of warm, dry weather.",
    exampleSentence: "The petrichor after the summer storm was intoxicating.",
    etymology: "Greek petra — rock + ichor, the fluid in the veins of the gods",
    level: "medium",
  },
  {
    word: "Sonder",
    partOfSpeech: "noun",
    definition:
      "The realization that each passerby has a life as vivid and complex as one's own.",
    exampleSentence:
      "Standing in the crowd, she was overcome with a deep sense of sonder.",
    etymology: "Coined by John Koenig in the Dictionary of Obscure Sorrows",
    level: "easy",
  },
  {
    word: "Ineffable",
    partOfSpeech: "adjective",
    definition: "Too great or extreme to be expressed or described in words.",
    exampleSentence:
      "The view from the summit produced an ineffable sense of awe.",
    etymology:
      "Latin ineffabilis — unutterable (in- not + effari to speak out)",
    level: "medium",
  },
  {
    word: "Verisimilitude",
    partOfSpeech: "noun",
    definition:
      "The appearance of being true or real; convincing resemblance to reality.",
    exampleSentence:
      "The novel's verisimilitude made readers forget it was fiction.",
    etymology: "Latin verisimilis — probable (verus true + similis like)",
    level: "hard",
  },
  {
    word: "Luminous",
    partOfSpeech: "adjective",
    definition: "Bright and shining, especially in the dark; full of light.",
    exampleSentence: "The luminous moon lit the entire valley below.",
    etymology: "Latin luminosus — full of light (lumen light)",
    level: "easy",
  },
  {
    word: "Crepuscular",
    partOfSpeech: "adjective",
    definition:
      "Relating to or resembling twilight; appearing or active in the twilight hours.",
    exampleSentence:
      "Deer are crepuscular animals, most active at dusk and dawn.",
    etymology: "Latin crepusculum — twilight",
    level: "hard",
  },
  {
    word: "Halcyon",
    partOfSpeech: "adjective",
    definition:
      "Denoting a period of time in the past that was idyllically happy and peaceful.",
    exampleSentence:
      "She looked back with fondness on those halcyon days of childhood.",
    etymology: "Greek alkyon — kingfisher, believed to calm the sea",
    level: "medium",
  },
  {
    word: "Numinous",
    partOfSpeech: "adjective",
    definition:
      "Having a strong religious or spiritual quality; indicating or suggesting the presence of a divinity.",
    exampleSentence:
      "The ancient cathedral had a numinous atmosphere that silenced all visitors.",
    etymology: "Latin numen — divine will or power",
    level: "hard",
  },
  {
    word: "Apricity",
    partOfSpeech: "noun",
    definition: "The warmth of the sun in winter.",
    exampleSentence:
      "She sat on the bench enjoying the apricity of the January afternoon.",
    etymology: "Latin apricus — warmed by the sun",
    level: "easy",
  },
  {
    word: "Palimpsest",
    partOfSpeech: "noun",
    definition:
      "Something altered or overwritten but still bearing visible traces of an earlier form.",
    exampleSentence:
      "The old city was a palimpsest of centuries of architecture layered one upon another.",
    etymology:
      "Greek palimpsestos — scraped again (palin again + psen to scrape)",
    level: "hard",
  },
];

const SAMPLE_WORDS_BY_LEVEL = {
  easy: SAMPLE_WORDS.filter((w) => w.level === "easy"),
  medium: SAMPLE_WORDS.filter((w) => w.level === "medium"),
  hard: SAMPLE_WORDS.filter((w) => w.level === "hard"),
};

const LEVEL_DOTS = ["d0", "d1", "d2", "d3", "d4"];

const TAB_CLASSES: Record<Level, { active: string; inactive: string }> = {
  daily: {
    active: "level-daily border font-bold ring-1 ring-current",
    inactive: "level-daily-inactive border",
  },
  all: {
    active: "level-all border font-bold ring-1 ring-current",
    inactive: "level-all-inactive border",
  },
  easy: {
    active: "level-easy border font-bold ring-1 ring-current",
    inactive: "level-easy-inactive border",
  },
  medium: {
    active: "level-medium border font-bold ring-1 ring-current",
    inactive: "level-medium-inactive border",
  },
  hard: {
    active: "level-hard border font-bold ring-1 ring-current",
    inactive: "level-hard-inactive border",
  },
};

export default function BrowsePage() {
  const [level, setLevel] = useState<Level>("daily");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("left");

  const touchStartX = useRef<number | null>(null);

  const { data: totalCount } = useTotalWordCount();
  const { data: currentWord, isLoading: isLoadingAll } = useWordByIndex(
    level === "all" ? BigInt(currentIndex) : null,
  );
  const { data: dailyLevelWords, isLoading: isLoadingDailyLevel } =
    useDailyWordsByLevel(level !== "all" && level !== "daily" ? level : null);
  const { data: dailyWords, isLoading: isLoadingDaily } = useDailyWords();

  const { data: bookmarks = [] } = useBookmarkedWords();
  const bookmark = useBookmarkWord();
  const removeBookmark = useRemoveBookmark();

  const samplesByLevel =
    level === "all" || level === "daily"
      ? SAMPLE_WORDS
      : SAMPLE_WORDS_BY_LEVEL[level as "easy" | "medium" | "hard"];

  let displayWord: (typeof SAMPLE_WORDS)[0] | null | undefined;
  let maxIndex: number;
  let total: number;
  const isLoading =
    level === "all"
      ? isLoadingAll
      : level === "daily"
        ? isLoadingDaily
        : isLoadingDailyLevel;

  if (level === "all") {
    total = Number(totalCount ?? samplesByLevel.length);
    maxIndex = total - 1;
    displayWord =
      currentWord ??
      samplesByLevel[currentIndex % Math.max(samplesByLevel.length, 1)];
  } else if (level === "daily") {
    const activeList =
      dailyWords && dailyWords.length > 0 ? dailyWords : SAMPLE_WORDS;
    total = activeList.length;
    maxIndex = total - 1;
    displayWord = activeList[currentIndex % Math.max(activeList.length, 1)];
  } else {
    const activeList =
      dailyLevelWords && dailyLevelWords.length > 0
        ? dailyLevelWords
        : samplesByLevel;
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta < -50) goNext();
    else if (delta > 50) goPrev();
  };

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
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/assets/generated/vocab-bg.dim_800x600.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="min-h-screen bg-background/85 backdrop-blur-[2px]">
        <div className="max-w-md mx-auto px-4 pt-10 pb-28">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              Browse Words
            </h1>
            <div className="flex gap-2 flex-wrap">
              {(["daily", "all", "easy", "medium", "hard"] as Level[]).map(
                (l) => (
                  <button
                    type="button"
                    key={l}
                    data-ocid={`level.${l}.tab`}
                    onClick={() => {
                      setLevel(l);
                      setCurrentIndex(0);
                      setDirection("left");
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-body tracking-wide uppercase border transition-all ${
                      level === l
                        ? TAB_CLASSES[l].active
                        : TAB_CLASSES[l].inactive
                    }`}
                  >
                    {l === "all"
                      ? "All"
                      : l === "daily"
                        ? "✦ Daily"
                        : l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ),
              )}
            </div>
            {level === "daily" && (
              <p className="mt-2 text-xs text-muted-foreground font-body">
                Today&apos;s 20 words · refreshes daily
              </p>
            )}
            {(level === "easy" || level === "medium" || level === "hard") && (
              <p className="mt-2 text-xs text-muted-foreground font-body">
                20 {level} words · refreshes daily
              </p>
            )}
          </div>

          <div className="flex items-center justify-end mb-4">
            <span className="text-xs text-muted-foreground font-body">
              Swipe or use arrows to navigate
            </span>
          </div>

          <div
            className="relative overflow-visible"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
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
    </div>
  );
}
