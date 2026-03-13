import type { FC } from "react";

interface LevelBadgeProps {
  level: string;
  size?: "sm" | "md";
}

export const LevelBadge: FC<LevelBadgeProps> = ({ level, size = "md" }) => {
  const normalized = level.toLowerCase();
  const cls =
    normalized === "easy"
      ? "level-easy"
      : normalized === "medium"
        ? "level-medium"
        : "level-hard";
  const label = level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
  const sizeClass =
    size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";
  return (
    <span
      className={`${cls} ${sizeClass} inline-flex items-center rounded-full border font-body font-semibold tracking-wide uppercase`}
    >
      {label}
    </span>
  );
};
