"use client";

import { useState } from "react";
import {
  Sparkles,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, truncate } from "@/lib/utils";

import { useI18n } from "@/lib/i18n/context";
import type { Signal } from "@/types/database";

const SOURCE_COLORS: Record<string, string> = {
  facebook: "bg-blue-600 text-white",
  tiktok: "bg-black text-white",
  instagram: "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
  youtube: "bg-red-600 text-white",
  twitter: "bg-sky-500 text-white",
  google: "bg-blue-500 text-white",
  amazon: "bg-amber-500 text-white",
  aliexpress: "bg-orange-500 text-white",
  manual: "bg-gray-500 text-white",
  other: "bg-gray-400 text-white",
};

const TYPE_COLORS: Record<string, string> = {
  pain_point: "destructive",
  buying_motive: "default",
  trend: "secondary",
  competitor: "outline",
  opportunity: "default",
} as const;

interface SignalCardProps {
  signal: Signal;
  onAnalyze: (signal: Signal) => void;
  onEdit: (signal: Signal) => void;
  onDelete: (signal: Signal) => void;
  onClick?: (signal: Signal) => void;
}

export function SignalCard({
  signal,
  onAnalyze,
  onEdit,
  onDelete,
  onClick,
}: SignalCardProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const sourceLabel =
    t.signals.signalSources[signal.source] ?? signal.source;
  const typeLabel =
    t.signals.signalTypes[signal.signal_type] ?? signal.signal_type;
  const nicheLabel =
    t.niches[signal.niche] ?? signal.niche;
  const sourceColor = SOURCE_COLORS[signal.source] ?? "bg-gray-400 text-white";
  const typeColor =
    TYPE_COLORS[signal.signal_type as keyof typeof TYPE_COLORS] ?? "secondary";

  const isLongText = signal.raw_text.length > 150;
  const displayText =
    expanded || !isLongText
      ? signal.raw_text
      : truncate(signal.raw_text, 150);

  return (
    <Card
      className="card-hover cursor-pointer animate-stagger"
      onClick={() => onClick?.(signal)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={sourceColor}>{sourceLabel}</Badge>
            <Badge variant={typeColor as "default"}>{typeLabel}</Badge>
            <Badge variant="outline">{nicheLabel}</Badge>
          </div>
          <div className="flex items-center gap-1">
            {signal.is_analyzed ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="h-3.5 w-3.5" />
                {t.signals.analyzed}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5" />
                {t.signals.notAnalyzed}
              </span>
            )}
          </div>
        </div>
        <CardDescription className="mt-1 text-xs">
          {formatDate(signal.created_at)}
          {signal.engagement_estimate != null &&
            signal.engagement_estimate > 0 &&
            ` · ${signal.engagement_estimate.toLocaleString("ar-DZ")} ${t.signals.engagementCount}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap" dir="auto">
          {displayText}
        </p>
        {isLongText && (
          <button
            type="button"
            className="mt-1 text-xs text-primary hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? t.signals.showLess : t.signals.showMore}
          </button>
        )}

        {signal.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {signal.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <Button
          size="sm"
          variant="default"
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze(signal);
          }}
        >
          <Sparkles className="h-3.5 w-3.5 ml-1" />
          {t.signals.analyze}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(signal);
          }}
        >
          <Edit className="h-3.5 w-3.5 ml-1" />
          {t.common.edit}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(signal);
          }}
        >
          <Trash2 className="h-3.5 w-3.5 ml-1" />
          {t.common.delete}
        </Button>
        {signal.source_link && (
          <Button
            size="sm"
            variant="ghost"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={signal.source_link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
