"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KNOWLEDGE_CATEGORIES, NICHE_OPTIONS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";

interface KnowledgeSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterCategory: string;
  onCategoryChange: (value: string) => void;
  filterNiche: string;
  onNicheChange: (value: string) => void;
  onClear: () => void;
}

export function KnowledgeSearch({
  searchQuery,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  filterNiche,
  onNicheChange,
  onClear,
}: KnowledgeSearchProps) {
  const { t } = useI18n();
  const hasActiveFilters =
    filterCategory !== "all" || filterNiche !== "all" || searchQuery !== "";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t.common.search}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-9"
        />
      </div>

      <Select value={filterCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder={t.prompts.category} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.common.all} {t.prompts.category}</SelectItem>
          {KNOWLEDGE_CATEGORIES.map((cat) => (
            <SelectItem key={cat.key} value={cat.key}>
              {t.knowledge.categories[cat.key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filterNiche} onValueChange={onNicheChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder={t.signals.niche} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.common.all} {t.signals.niche}</SelectItem>
          {NICHE_OPTIONS.map((niche) => (
            <SelectItem key={niche.key} value={niche.key}>
              {t.niches[niche.key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4 ml-1" />
          {t.common.clear}
        </Button>
      )}
    </div>
  );
}
