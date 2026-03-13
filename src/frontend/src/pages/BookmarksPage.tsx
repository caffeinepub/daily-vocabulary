import { Bookmark, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { LevelBadge } from "../components/LevelBadge";
import { useBookmarkedWords, useRemoveBookmark } from "../hooks/useQueries";

export default function BookmarksPage() {
  const { data: bookmarks = [], isLoading } = useBookmarkedWords();
  const removeBookmark = useRemoveBookmark();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pt-10 pb-28">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Saved Words
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {bookmarks.length} word{bookmarks.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {isLoading && (
          <div data-ocid="bookmark.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="h-4 w-24 rounded bg-muted animate-shimmer mb-2" />
                <div className="h-3 w-full rounded bg-muted animate-shimmer" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && bookmarks.length === 0 && (
          <div
            data-ocid="bookmark.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No saved words yet
            </h3>
            <p className="text-sm text-muted-foreground font-body max-w-xs">
              Bookmark words while browsing to build your personal vocabulary
              collection.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {bookmarks.map((entry, i) => (
            <motion.div
              key={entry.word}
              data-ocid={`bookmark.item.${i + 1}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card p-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-display text-xl font-bold text-foreground truncate">
                      {entry.word}
                    </h3>
                    <LevelBadge level={entry.level || "medium"} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground font-body italic mb-1">
                    {entry.partOfSpeech}
                  </p>
                  <p className="text-sm text-foreground/80 font-body line-clamp-2">
                    {entry.definition}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`bookmark.delete_button.${i + 1}`}
                  onClick={() => removeBookmark.mutate(BigInt(i))}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
