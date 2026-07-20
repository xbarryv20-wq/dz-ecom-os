"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SIGNAL_SOURCES, SIGNAL_TYPES, NICHE_OPTIONS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";

interface SignalFiltersProps {
  source: string;
  type: string;
  niche: string;
  onSourceChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onNicheChange: (value: string) => void;
  onClear: () => void;
}

export function SignalFilters({
  source,
  type,
  niche,
  onSourceChange,
  onTypeChange,
  onNicheChange,
  onClear,
}: SignalFiltersProps) {
  const { t } = useI18n();
  const hasFilters = source !== "all" || type !== "all" || niche !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>{t.common.filter}</span>
      </div>

      <Select value={source} onValueChange={onSourceChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t.signals.source} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.common.all} {t.signals.source}</SelectItem>
          {SIGNAL_SOURCES.map((s) => (
            <SelectItem key={s.key} value={s.key}>
              {t.signals.signalSources[s.key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t.signals.signalType} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.common.all} {t.signals.signalType}</SelectItem>
          {SIGNAL_TYPES.map((st) => (
            <SelectItem key={st.key} value={st.key}>
              {t.signals.signalTypes[st.key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={niche} onValueChange={onNicheChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t.signals.niche} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.common.all} {t.signals.niche}</SelectItem>
          {NICHE_OPTIONS.map((n) => (
            <SelectItem key={n.key} value={n.key}>
              {t.niches[n.key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4 ml-1" />
          {t.common.clear}
        </Button>
      )}
    </div>
  );
}
