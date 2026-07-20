"use client";

import { useState } from "react";
import {
  Star,
  Copy,
  Edit,
  Trash2,
  Archive,
  CheckCircle,
  CopyCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PROMPT_CATEGORIES } from "@/lib/constants";
import { formatDate, truncate } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import type { Prompt } from "@/types/database";

const CATEGORY_COLORS: Record<string, string> = {
  product_research: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  ad_copy: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  script: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  analysis: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  customer_service: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (prompt: Prompt) => void;
  onCopy: (prompt: Prompt) => void;
  onToggleFavorite: (prompt: Prompt) => void;
  onArchive: (prompt: Prompt) => void;
  onClick?: (prompt: Prompt) => void;
}

export function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onCopy,
  onToggleFavorite,
  onArchive,
  onClick,
}: PromptCardProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoryLabel =
    PROMPT_CATEGORIES.find((c) => c.key === prompt.category)?.label ??
    prompt.category;
  const categoryColor =
    CATEGORY_COLORS[prompt.category] ?? CATEGORY_COLORS.other;

  const isLongContent = prompt.content.length > 150;
  const displayContent =
    expanded || !isLongContent
      ? prompt.content
      : truncate(prompt.content, 150);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    onCopy(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onClick?.(prompt)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight line-clamp-2">
            {prompt.title}
          </CardTitle>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt);
            }}
            className="shrink-0 mt-0.5"
          >
            <Star
              className={`h-4 w-4 transition-colors ${
                prompt.is_favorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground hover:text-yellow-400"
              }`}
            />
          </button>
        </div>
        <Badge variant="secondary" className={`w-fit text-xs ${categoryColor}`}>
          {categoryLabel}
        </Badge>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap" dir="auto">
          {displayContent}
        </p>
        {isLongContent && (
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
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(prompt.created_at)}</span>
          <span className="flex items-center gap-1">
            <CopyCheck className="h-3 w-3" />
            {prompt.usage_count} {t.prompts.usageCount}
          </span>
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <Button
          size="sm"
          variant={copied ? "default" : "outline"}
          onClick={handleCopy}
        >
          {copied ? (
            <CheckCircle className="h-3.5 w-3.5 ml-1" />
          ) : (
            <Copy className="h-3.5 w-3.5 ml-1" />
          )}
          {copied ? t.common.copied : t.common.copy}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(prompt);
          }}
        >
          <Edit className="h-3.5 w-3.5 ml-1" />
          {t.common.edit}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onArchive(prompt);
          }}
        >
          <Archive className="h-3.5 w-3.5 ml-1" />
          {t.prompts.archive}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(prompt);
          }}
        >
          <Trash2 className="h-3.5 w-3.5 ml-1" />
          {t.common.delete}
        </Button>
      </CardFooter>
    </Card>
  );
}
