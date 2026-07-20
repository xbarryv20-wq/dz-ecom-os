"use client";

import { useState } from "react";
import { Copy, Edit, CheckCircle, CopyCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PROMPT_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
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

interface PromptDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  onEdit: (prompt: Prompt) => void;
  onCopy: (prompt: Prompt) => void;
}

export function PromptDetailDialog({
  open,
  onOpenChange,
  prompt,
  onEdit,
  onCopy,
}: PromptDetailDialogProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  const currentPrompt = prompt;

  const categoryLabel =
    t.prompts.categories[currentPrompt.category] ?? currentPrompt.category;
  const categoryColor =
    CATEGORY_COLORS[currentPrompt.category] ?? CATEGORY_COLORS.other;

  function handleCopy() {
    onCopy(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-lg leading-tight">
              {currentPrompt.title}
            </DialogTitle>
            <Badge
              variant="secondary"
              className={`shrink-0 text-xs ${categoryColor}`}
            >
              {categoryLabel}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{formatDate(currentPrompt.created_at)}</span>
          <span>{currentPrompt.usage_count} {t.prompts.usageCount}</span>
        </div>

        <ScrollArea className="max-h-[400px] rounded-md border p-4">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono" dir="auto">
            {currentPrompt.content}
          </pre>
        </ScrollArea>

        <div className="flex items-center gap-2 pt-2">
          <Button variant={copied ? "default" : "outline"} onClick={handleCopy}>
            {copied ? (
              <CheckCircle className="h-4 w-4 ml-1" />
            ) : (
              <Copy className="h-4 w-4 ml-1" />
            )}
            {copied ? t.common.copied : t.common.copy}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onEdit(currentPrompt);
            }}
          >
            <Edit className="h-4 w-4 ml-1" />
            {t.common.edit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
