import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { VocabularyEntry } from "../backend.d";
import { useActor } from "./useActor";

export function useWordOfTheDay() {
  const { actor, isFetching } = useActor();
  return useQuery<VocabularyEntry>({
    queryKey: ["wordOfTheDay"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getWordOfTheDay();
    },
    enabled: !!actor && !isFetching,
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
      // Cast to any since backend.ts may not yet reflect the latest generated interface
      return (actor as any).getWordsByLevel(level) as Promise<
        VocabularyEntry[]
      >;
    },
    enabled: !!actor && !isFetching && level !== null,
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
