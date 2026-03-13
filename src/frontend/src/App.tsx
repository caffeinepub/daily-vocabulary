import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BottomNav } from "./components/BottomNav";
import BookmarksPage from "./pages/BookmarksPage";
import BrowsePage from "./pages/BrowsePage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";

export type Page = "home" | "browse" | "bookmarks" | "settings";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        {page === "home" && <HomePage onNavigate={setPage} />}
        {page === "browse" && <BrowsePage />}
        {page === "bookmarks" && <BookmarksPage />}
        {page === "settings" && <SettingsPage />}
        <BottomNav current={page} onChange={setPage} />
      </div>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
