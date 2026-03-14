import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VocabularyEntry } from "../backend.d";
import { useActor } from "./useActor";

/** Returns today's date string in IST (UTC+5:30) as YYYY-MM-DD */
function getTodayIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().slice(0, 10);
}

export function useWordOfTheDay() {
  const { actor, isFetching } = useActor();
  const today = getTodayIST();
  return useQuery<VocabularyEntry>({
    queryKey: ["wordOfTheDay", today],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getWordOfTheDay();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useTotalWordCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalWordCount"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getTotalWordCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWordByIndex(index: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<VocabularyEntry | null>({
    queryKey: ["word", index?.toString()],
    queryFn: async () => {
      if (!actor || index === null) return null;
      return actor.getWordByIndex(index);
    },
    enabled: !!actor && !isFetching && index !== null,
  });
}

export function useWordsByLevel(level: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<VocabularyEntry[]>({
    queryKey: ["wordsByLevel", level],
    queryFn: async () => {
      if (!actor || level === null) return [];
      return (actor as any).getWordsByLevel(level) as Promise<
        VocabularyEntry[]
      >;
    },
    enabled: !!actor && !isFetching && level !== null,
  });
}

export function useDailyWordsByLevel(level: string | null) {
  const { actor, isFetching } = useActor();
  const today = getTodayIST();
  return useQuery<VocabularyEntry[]>({
    queryKey: ["dailyWordsByLevel", level, today],
    queryFn: async () => {
      if (!actor || level === null) return [];
      return (actor as any).getDailyWordsByLevel(level) as Promise<
        VocabularyEntry[]
      >;
    },
    enabled: !!actor && !isFetching && level !== null,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useWordCountByLevel(level: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["wordCountByLevel", level],
    queryFn: async () => {
      if (!actor || level === null) return 0n;
      return (actor as any).getWordCountByLevel(level) as Promise<bigint>;
    },
    enabled: !!actor && !isFetching && level !== null,
  });
}

export function useBookmarkedWords() {
  const { actor, isFetching } = useActor();
  return useQuery<VocabularyEntry[]>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookmarkedWords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDailyWords() {
  const { actor, isFetching } = useActor();
  const today = getTodayIST();
  return useQuery<VocabularyEntry[]>({
    queryKey: ["dailyWords", today],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getDailyWords() as Promise<VocabularyEntry[]>;
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useBookmarkWord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.bookmarkWord(index);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });
}

export function useRemoveBookmark() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.removeBookmark(index);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });
}
