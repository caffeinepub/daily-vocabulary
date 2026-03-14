import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { SAMPLE_WORDS } from "./BrowsePage";

type QuizWord = (typeof SAMPLE_WORDS)[0];

interface Question {
  word: QuizWord;
  options: string[];
  correctIndex: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(words: QuizWord[]): Question[] {
  const pool = shuffle(words).slice(0, 10);
  return pool.map((word) => {
    const distractors = shuffle(
      words.filter((w) => w.word !== word.word),
    ).slice(0, 3);
    const allOptions = shuffle([word, ...distractors]);
    const correctIndex = allOptions.indexOf(word);
    return {
      word,
      options: allOptions.map((o) => o.word),
      correctIndex,
    };
  });
}

function getScoreMessage(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return "Perfect score! You're a word wizard! 🧙‍♂️";
  if (pct >= 0.8) return "Great job! Your vocabulary is impressive! 🌟";
  if (pct >= 0.6) return "Not bad! Keep learning and you'll get there! 📚";
  if (pct >= 0.4) return "Good effort! Practice makes perfect! 💪";
  return "Keep exploring words — you'll improve fast! 🌱";
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>(() =>
    buildQuestions(SAMPLE_WORDS),
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [key, setKey] = useState(0);

  const total = questions.length;
  const question = questions[currentQ];
  const isAnswered = selected !== null;

  const handleSelect = useCallback(
    (idx: number) => {
      if (isAnswered) return;
      setSelected(idx);
      if (idx === question.correctIndex) {
        setScore((s) => s + 1);
      }
    },
    [isAnswered, question],
  );

  const handleNext = useCallback(() => {
    if (currentQ + 1 >= total) {
      setFinished(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
    }
  }, [currentQ, total]);

  const handleRestart = useCallback(() => {
    setQuestions(buildQuestions(SAMPLE_WORDS));
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setKey((k) => k + 1);
  }, []);

  // keyboard shortcut: Enter to proceed
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (finished) handleRestart();
        else if (isAnswered) handleNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [finished, isAnswered, handleNext, handleRestart]);

  const optionClass = (idx: number) => {
    const base =
      "w-full text-left px-4 py-3 rounded-xl border text-sm font-body font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
    if (!isAnswered) {
      return `${base} border-border bg-background/60 hover:bg-secondary hover:border-primary cursor-pointer`;
    }
    if (idx === question.correctIndex) {
      return `${base} border-green-500 bg-green-500/15 text-green-700 dark:text-green-300`;
    }
    if (idx === selected) {
      return `${base} border-red-500 bg-red-500/15 text-red-700 dark:text-red-300`;
    }
    return `${base} border-border bg-background/40 opacity-50`;
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
        <div className="max-w-md mx-auto px-4 pt-10 pb-28">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground mb-1">
              Vocabulary Quiz
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              Match the definition to the correct word
            </p>
          </div>

          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.93, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: -20 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                data-ocid="quiz.score.panel"
                className="rounded-2xl border border-border bg-card/90 backdrop-blur-sm p-8 text-center shadow-lg"
              >
                <div className="text-6xl mb-4">
                  {score === total ? "🏆" : score >= total * 0.7 ? "🌟" : "📚"}
                </div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                  {score} / {total}
                </h2>
                <p className="text-sm font-body text-muted-foreground mb-2">
                  {Math.round((score / total) * 100)}% correct
                </p>
                <p className="font-body text-foreground mb-8 text-base leading-relaxed">
                  {getScoreMessage(score, total)}
                </p>
                <button
                  type="button"
                  data-ocid="quiz.restart.button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Play Again
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`question-${key}-${currentQ}`}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Progress */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-body text-muted-foreground">
                      Question {currentQ + 1} of {total}
                    </span>
                    <span className="text-xs font-body text-muted-foreground">
                      Score: {score}
                    </span>
                  </div>
                  <Progress
                    value={((currentQ + (isAnswered ? 1 : 0)) / total) * 100}
                    className="h-1.5"
                  />
                </div>

                {/* Question card */}
                <div
                  data-ocid="quiz.question.card"
                  className="rounded-2xl border border-border bg-card/90 backdrop-blur-sm p-6 mb-4 shadow-md"
                >
                  <p className="text-[10px] uppercase tracking-widest font-body text-muted-foreground mb-2">
                    What word matches this definition?
                  </p>
                  <p className="font-body text-foreground text-base leading-relaxed">
                    {question.word.definition}
                  </p>
                  {isAnswered && selected !== question.correctIndex && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs font-body text-muted-foreground">
                        The correct answer was:{" "}
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {question.options[question.correctIndex]}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Options */}
                <div className="flex flex-col gap-3 mb-6">
                  {question.options.map((opt, idx) => (
                    <button
                      key={opt}
                      type="button"
                      data-ocid={`quiz.option.button.${idx + 1}`}
                      onClick={() => handleSelect(idx)}
                      disabled={isAnswered}
                      className={optionClass(idx)}
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[11px] font-bold shrink-0 opacity-60">
                          {["A", "B", "C", "D"][idx]}
                        </span>
                        {opt}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Next button */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-end"
                  >
                    <button
                      type="button"
                      data-ocid="quiz.next.button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      {currentQ + 1 >= total ? "See Results" : "Next →"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
