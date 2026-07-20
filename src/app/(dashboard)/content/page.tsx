"use client";

import { useState, useMemo, useCallback } from "react";
import { FileText, Plus, Search, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";
import type { ContentPiece } from "@/types/database";
import { generateId } from "@/lib/utils";

const MOCK_CONTENT: ContentPiece[] = [
  {
    id: "1", created_at: "2026-07-20T10:00:00Z", updated_at: "2026-07-20T10:00:00Z",
    user_id: "user-1", title: "Summer Sale Ad", content_type: "ad_copy",
    content: "🔥 تخفيضات الصيف وصلت! خصم يصل إلى 40% على أقوى المنتجات. عرض محدود لفترة الصيف فقط. اطلب الآن واستمتع بالتوصيل المجاني.",
    source_product_id: null, source_campaign_id: null,
    overall_score: 8.2, scores: { clarity: 9, persuasion: 8, relevance: 8, uniqueness: 7, actionability: 9 },
    feedback: { clarity: "Very clear offer", persuasion: "Good urgency", relevance: "Targeted well", uniqueness: "Use stronger differentiator", actionability: "Strong CTA" },
    optimized_version: "☀️ الصيف فاتكش! خصم 40% على أقوى المنتجات. لفترة محدودة - أول 100 عميل فقط. اطلب الآن والتوصيل مجاني!", status: "scored",
  },
  {
    id: "2", created_at: "2026-07-19T14:00:00Z", updated_at: "2026-07-19T14:00:00Z",
    user_id: "user-1", title: "Product Launch Hook", content_type: "hook",
    content: "هل تعاني من فوضى الأسلاك في منزلك؟",
    source_product_id: null, source_campaign_id: null,
    overall_score: 7.5, scores: { clarity: 8, persuasion: 7, relevance: 9, uniqueness: 8, actionability: 5 },
    feedback: { clarity: "Clear pain point", persuasion: "Good emotional trigger", relevance: "Very relevant", uniqueness: "Unique angle", actionability: "Missing CTA" },
    optimized_version: "تعبان من فوضى الأسلاك؟ جهازنا يخلصك منها في 5 دقائق فقط. اطلب الآن!", status: "scored",
  },
];

export default function ContentPage() {
  const { t } = useI18n();
  const isDemo = !isSupabaseConfigured();

  const { data: dbContent, isLoading, refetch } = useSupabaseQuery<ContentPiece>({
    table: "content_pieces",
    orderBy: { column: "created_at", ascending: false },
    enabled: !isDemo,
  });

  const { insert } = useSupabaseInsert<ContentPiece>("content_pieces");
  const { update } = useSupabaseUpdate<ContentPiece>("content_pieces");
  const { remove } = useSupabaseDelete("content_pieces");

  const [demoContent, setDemoContent] = useState<ContentPiece[]>(MOCK_CONTENT);
  const [searchQuery, setSearchQuery] = useState("");
  const [scoringId, setScoringId] = useState<string | null>(null);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const allContent = isDemo || !dbContent?.length ? demoContent : dbContent;

  const filteredContent = useMemo(() => {
    if (!searchQuery) return allContent;
    const q = searchQuery.toLowerCase();
    return allContent.filter((c) =>
      c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q)
    );
  }, [allContent, searchQuery]);

  const handleScore = useCallback(async (item: ContentPiece) => {
    setScoringId(item.id);
    try {
      const res = await fetch("/api/ai/score-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: item.content,
          contentType: item.content_type,
          productName: item.title,
        }),
      });
      const data = await res.json();
      if (data.scores) {
        if (isDemo) {
          setDemoContent((prev) =>
            prev.map((c) =>
              c.id === item.id
                ? { ...c, scores: data.scores, overall_score: data.overall, feedback: data.feedback, optimized_version: data.optimized_version, status: "scored" }
                : c
            )
          );
        } else {
          await update(item.id, {
            scores: data.scores,
            overall_score: data.overall,
            feedback: data.feedback,
            optimized_version: data.optimized_version,
            status: "scored",
          });
          refetch();
        }
      }
    } catch (e) {
      console.error("Score failed:", e);
    }
    setScoringId(null);
  }, [isDemo, update, refetch]);

  const handleDelete = useCallback(async (item: ContentPiece) => {
    if (!confirm(t.content.deleteConfirm)) return;
    if (isDemo) {
      setDemoContent((prev) => prev.filter((c) => c.id !== item.id));
    } else {
      await remove(item.id);
      refetch();
    }
  }, [isDemo, t.content.deleteConfirm, remove, refetch]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.content.title}</h1>
            <p className="text-sm text-muted-foreground">{t.content.description}</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t.content.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">{t.content.emptyTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">{t.content.emptyDesc}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((item) => (
            <Card key={item.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-semibold leading-tight">{item.title}</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">
                      {t.content.contentTypes[item.content_type as keyof typeof t.content.contentTypes] || item.content_type}
                    </Badge>
                  </div>
                  {item.overall_score != null && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">{item.overall_score}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
                {item.scores && Object.keys(item.scores).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(item.scores).map(([key, val]) => (
                      <span key={key} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                        {key}: {val}/10
                      </span>
                    ))}
                  </div>
                )}
                {item.optimized_version && (
                  <div className="rounded-md bg-green-50 dark:bg-green-950/30 p-2">
                    <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">{t.content.optimizedVersion}</p>
                    <p className="text-xs text-green-600 dark:text-green-300 line-clamp-2">{item.optimized_version}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  {(!item.scores || Object.keys(item.scores).length === 0) && (
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleScore(item)} disabled={scoringId === item.id}>
                      {scoringId === item.id ? (
                        <><RefreshCw className="h-3 w-3 ml-1 animate-spin" />{t.content.scoring}</>
                      ) : (
                        <><Sparkles className="h-3 w-3 ml-1" />{t.content.score}</>
                      )}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive" onClick={() => handleDelete(item)}>
                    {t.common.delete}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
