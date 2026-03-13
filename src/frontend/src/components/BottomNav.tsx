import { BookOpen, Bookmark, Home, Settings } from "lucide-react";
import type { FC } from "react";
import type { Page } from "../App";

interface BottomNavProps {
  current: Page;
  onChange: (page: Page) => void;
}

const items: Array<{
  page: Page;
  label: string;
  icon: FC<{ className?: string }>;
  ocid: string;
}> = [
  { page: "home", label: "Home", icon: Home, ocid: "nav.home.link" },
  { page: "browse", label: "Browse", icon: BookOpen, ocid: "nav.browse.link" },
  {
    page: "bookmarks",
    label: "Saved",
    icon: Bookmark,
    ocid: "nav.bookmarks.link",
  },
  {
    page: "settings",
    label: "Settings",
    icon: Settings,
    ocid: "nav.settings.link",
  },
];

export const BottomNav: FC<BottomNavProps> = ({ current, onChange }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-md mx-auto flex items-stretch">
        {items.map(({ page, label, icon: Icon, ocid }) => {
          const active = current === page;
          return (
            <button
              type="button"
              key={page}
              data-ocid={ocid}
              onClick={() => onChange(page)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`}
              />
              <span
                className={`text-[10px] font-body font-medium tracking-wide ${active ? "text-primary" : ""}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
