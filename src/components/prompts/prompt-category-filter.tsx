"use client";

import { PROMPT_CATEGORIES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";

interface PromptCategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function PromptCategoryFilter({
  value,
  onChange,
}: PromptCategoryFilterProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          value === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        {t.common.all}
      </button>
      {PROMPT_CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          type="button"
          onClick={() => onChange(cat.key)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === cat.key
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {t.prompts.categories[cat.key]}
        </button>
      ))}
    </div>
  );
}
