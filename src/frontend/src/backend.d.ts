import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VocabularyEntry {
    exampleSentence: string;
    word: string;
    level: string;
    etymology: string;
    definition: string;
    partOfSpeech: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookmarkWord(index: bigint): Promise<void>;
    getBookmarkedWords(): Promise<Array<VocabularyEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTotalWordCount(): Promise<bigint>;
    getWordCountByLevel(level: string): Promise<bigint>;
    getWordsByLevel(level: string): Promise<Array<VocabularyEntry>>;
    getDailyWordsByLevel(level: string): Promise<Array<VocabularyEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWordByIndex(index: bigint): Promise<VocabularyEntry | null>;
    getWordOfTheDay(): Promise<VocabularyEntry>;
    getDailyWords(): Promise<Array<VocabularyEntry>>;
    isCallerAdmin(): Promise<boolean>;
    removeBookmark(index: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
