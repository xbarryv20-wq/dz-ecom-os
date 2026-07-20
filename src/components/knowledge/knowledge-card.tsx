"use client";

import { useState } from "react";
import { Edit, Trash2, Pin, PinOff } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KNOWLEDGE_CATEGORIES, NICHE_OPTIONS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  niche: string;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
}

interface KnowledgeCardProps {
  entry: KnowledgeEntry;
  onEdit: (entry: KnowledgeEntry) => void;
  onDelete: (entry: KnowledgeEntry) => void;
  onTogglePin: (entry: KnowledgeEntry) => void;
}

const PREVIEW_LENGTH = 150;

export function KnowledgeCard({
  entry,
  onEdit,
  onDelete,
  onTogglePin,
}: KnowledgeCardProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const categoryLabel =
    KNOWLEDGE_CATEGORIES.find((c) => c.key === entry.category)?.label ??
    entry.category;
  const nicheLabel =
    NICHE_OPTIONS.find((n) => n.key === entry.niche)?.label ?? entry.niche;

  const shouldTruncate = entry.content.length > PREVIEW_LENGTH;
  const displayContent =
    expanded || !shouldTruncate
      ? entry.content
      : entry.content.slice(0, PREVIEW_LENGTH) + "...";

  return (
    <Card className="relative group">
      {entry.is_pinned && (
        <div className="absolute left-3 top-3">
          <Pin className="h-4 w-4 text-primary fill-primary" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-snug pr-6">
            {entry.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onTogglePin(entry)}
              title={entry.is_pinned ? t.knowledge.unpin : t.knowledge.pinned}
            >
              {entry.is_pinned ? (
                <PinOff className="h-3.5 w-3.5" />
              ) : (
                <Pin className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(entry)}
              title={t.common.edit}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(entry)}
              title={t.common.delete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-1">
          <Badge variant="secondary" className="text-xs">
            {categoryLabel}
          </Badge>
          {entry.niche && (
            <Badge variant="outline" className="text-xs">
              {nicheLabel}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary hover:underline mt-1"
          >
            {expanded ? t.signals.showLess : t.signals.showMore}
          </button>
        )}

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-[11px] text-muted-foreground mt-3">
          {new Date(entry.created_at).toLocaleDateString("ar-DZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
