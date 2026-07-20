"use client";

import { useState, useMemo, useCallback } from "react";
import { Radar, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SignalFilters } from "@/components/signals/signal-filters";
import { SignalCard } from "@/components/signals/signal-card";
import { SignalForm } from "@/components/signals/signal-form";
import { SignalAnalysisDialog } from "@/components/signals/signal-analysis-dialog";
import { generateId } from "@/lib/utils";
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
  getCurrentUserId,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";
import type { Signal, SignalAiAnalysis } from "@/types/database";
import type { SignalInput } from "@/lib/validators";
import { useI18n } from "@/lib/i18n/context";

const MOCK_SIGNALS: Signal[] = [
  {
    id: "1",
    created_at: "2026-07-18T10:00:00Z",
    updated_at: "2026-07-18T10:00:00Z",
    user_id: "user-1",
    source: "tiktok",
    raw_text:
      "-girls asking in comments: وين نلقاو هاد الكريمة ف الجزائر؟ كاين لي جربها و قالت خايبة ولا لا؟ وين أحسن مكان باش نشريوها؟",
    source_link: "https://tiktok.com/@example/video/123",
    signal_type: "pain_point",
    niche: "beauty",
    engagement_estimate: 12500,
    tags: ["ccream", "skincare", "algeria"],
    is_analyzed: true,
  },
  {
    id: "2",
    created_at: "2026-07-17T14:30:00Z",
    updated_at: "2026-07-17T14:30:00Z",
    user_id: "user-1",
    source: "facebook",
    raw_text:
      "عندك بطن منفوخة بعد الولادة؟ هاد المنتج غيّر ليا حياتي! في 3 أسابيع شفت النتيجة. كاين يوصل للجزائر؟",
    source_link: null,
    signal_type: "buying_motive",
    niche: "health",
    engagement_estimate: 8200,
    tags: ["postpartum", "belly", "slimming"],
    is_analyzed: false,
  },
  {
    id: "3",
    created_at: "2026-07-16T09:15:00Z",
    updated_at: "2026-07-16T09:15:00Z",
    user_id: "user-1",
    source: "instagram",
    raw_text:
      "Trending product alert: LED face mask going viral in North Africa. Multiple Algerian influencers posting about it. Low competition on local marketplaces.",
    source_link: "https://instagram.com/p/example",
    signal_type: "trend",
    niche: "beauty",
    engagement_estimate: 34000,
    tags: ["LED", "face mask", "viral", "North Africa"],
    is_analyzed: true,
  },
  {
    id: "4",
    created_at: "2026-07-15T16:45:00Z",
    updated_at: "2026-07-15T16:45:00Z",
    user_id: "user-1",
    source: "amazon",
    raw_text:
      "Pet grooming vacuum - 4.8 stars, 12k reviews. Not available in Algeria yet. High search volume in Arabic pet groups. Price point $35-50.",
    source_link: "https://amazon.com/dp/example",
    signal_type: "opportunity",
    niche: "pets",
    engagement_estimate: 5600,
    tags: ["pet", "grooming", "vacuum", "high demand"],
    is_analyzed: false,
  },
  {
    id: "5",
    created_at: "2026-07-14T11:00:00Z",
    updated_at: "2026-07-14T11:00:00Z",
    user_id: "user-1",
    source: "youtube",
    raw_text:
      "Revew comparatif: les 5 meilleures crepières électriques 2026. La marque X est en rupture de stock partout en Algérie. Les commentateurs demandent où les acheter.",
    source_link: "https://youtube.com/watch?v=example",
    signal_type: "competitor",
    niche: "home",
    engagement_estimate: 21000,
    tags: ["crepiere", "electric", "kitchen", "stock shortage"],
    is_analyzed: true,
  },
];

export default function SignalsPage() {
  const { t } = useI18n();
  const isDemo = !isSupabaseConfigured();

  const { data: dbSignals, isLoading, refetch } = useSupabaseQuery<
    Record<string, unknown>
  >({
    table: "signals",
    orderBy: { column: "created_at", ascending: false },
    enabled: !isDemo,
  });

  const [demoSignals, setDemoSignals] = useState<Signal[]>(MOCK_SIGNALS);

  const signals: Signal[] = isDemo || !(dbSignals as unknown[])?.length
    ? demoSignals
    : (dbSignals as unknown as Signal[]);

  const { insert } = useSupabaseInsert<Record<string, unknown>>("signals");
  const { update } = useSupabaseUpdate<Record<string, unknown>>("signals");
  const { remove } = useSupabaseDelete("signals");

  const [searchQuery, setSearchQuery] = useState("");

  const [filterSource, setFilterSource] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterNiche, setFilterNiche] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null);

  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analyzingSignal, setAnalyzingSignal] = useState<Signal | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<SignalAiAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      const matchSource = filterSource === "all" || s.source === filterSource;
      const matchType = filterType === "all" || s.signal_type === filterType;
      const matchNiche = filterNiche === "all" || s.niche === filterNiche;
      const matchSearch =
        searchQuery === "" ||
        s.raw_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchSource && matchType && matchNiche && matchSearch;
    });
  }, [signals, filterSource, filterType, filterNiche, searchQuery]);

  const handleClearFilters = useCallback(() => {
    setFilterSource("all");
    setFilterType("all");
    setFilterNiche("all");
    setSearchQuery("");
  }, []);

  const handleAddSignal = useCallback(async (data: SignalInput) => {
    if (isDemo) {
      const newSignal: Signal = {
        id: generateId(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "user-1",
        source: data.source,
        raw_text: data.rawText,
        source_link: data.sourceLink || null,
        signal_type: data.signalType,
        niche: data.niche,
        engagement_estimate: data.engagementEstimate ?? null,
        tags: data.tags ?? [],
        is_analyzed: false,
      };
      setDemoSignals((prev) => [newSignal, ...prev]);
      return;
    }

    const userId = await getCurrentUserId();
    if (!userId) return;

    const { error } = await insert({
      user_id: userId,
      source: data.source,
      raw_text: data.rawText,
      source_link: data.sourceLink || null,
      signal_type: data.signalType,
      niche: data.niche,
      engagement_estimate: data.engagementEstimate ?? null,
      tags: data.tags ?? [],
      is_analyzed: false,
    });

    if (!error) refetch();
  }, [isDemo, insert, refetch]);

  const handleEditSignal = useCallback(
    async (data: SignalInput) => {
      if (!editingSignal) return;

      if (isDemo) {
        setDemoSignals((prev) =>
          prev.map((s) =>
            s.id === editingSignal.id
              ? {
                  ...s,
                  source: data.source,
                  raw_text: data.rawText,
                  source_link: data.sourceLink || null,
                  signal_type: data.signalType,
                  niche: data.niche,
                  engagement_estimate: data.engagementEstimate ?? null,
                  tags: data.tags ?? [],
                  updated_at: new Date().toISOString(),
                }
              : s
          )
        );
        setEditingSignal(null);
        return;
      }

      const { error } = await update(editingSignal.id, {
        source: data.source,
        raw_text: data.rawText,
        source_link: data.sourceLink || null,
        signal_type: data.signalType,
        niche: data.niche,
        engagement_estimate: data.engagementEstimate ?? null,
        tags: data.tags ?? [],
      });

      if (!error) {
        refetch();
        setEditingSignal(null);
      }
    },
    [editingSignal, isDemo, update, refetch]
  );

  const handleDeleteSignal = useCallback(
    async (signal: Signal) => {
      if (!confirm(t.signals.deleteConfirm)) return;

      if (isDemo) {
        setDemoSignals((prev) => prev.filter((s) => s.id !== signal.id));
        return;
      }

      const { error } = await remove(signal.id);
      if (!error) refetch();
    },
    [isDemo, remove, refetch, t.signals.deleteConfirm]
  );

  const handleAnalyze = useCallback(async (signal: Signal) => {
    setAnalyzingSignal(signal);
    setAnalysisResult(null);
    setAnalysisError(null);
    setAnalysisLoading(true);
    setAnalysisOpen(true);

    try {
      const res = await fetch("/api/ai/analyze-signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signal: signal.raw_text }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? t.signals.failureMessage);
      }

      const { data } = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      setAnalysisError(
        err instanceof Error ? err.message : t.signals.unexpectedError
      );
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  const handleSaveAnalysis = useCallback(
    (analysis: SignalAiAnalysis) => {
      if (!analyzingSignal) return;
      if (!isDemo) {
        refetch();
      } else {
        setDemoSignals((prev) =>
          prev.map((s) =>
            s.id === analyzingSignal.id ? { ...s, is_analyzed: true } : s
          )
        );
      }
      setAnalysisOpen(false);
      setAnalyzingSignal(null);
      setAnalysisResult(null);
    },
    [analyzingSignal, isDemo, refetch]
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Radar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t.signals.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t.signals.description}
            </p>
          </div>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 ml-1" />
          {t.signals.addSignal}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.signals.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
            />
          </div>
        </div>

        <SignalFilters
          source={filterSource}
          type={filterType}
          niche={filterNiche}
          onSourceChange={setFilterSource}
          onTypeChange={setFilterType}
          onNicheChange={setFilterNiche}
          onClear={handleClearFilters}
        />
      </div>

      {isLoading && !isDemo ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-6 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-14" />
              </div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredSignals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Radar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t.signals.emptyTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {signals.length === 0
              ? t.signals.emptyDesc
              : t.signals.emptyDescFiltered}
          </p>
          {signals.length === 0 && (
            <Button className="mt-4" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 ml-1" />
              {t.signals.addFirstSignal}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onAnalyze={handleAnalyze}
              onEdit={(s) => {
                setEditingSignal(s);
              }}
              onDelete={handleDeleteSignal}
              onClick={(s) => handleAnalyze(s)}
            />
          ))}
        </div>
      )}

      <SignalForm
        open={formOpen || editingSignal !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
            setEditingSignal(null);
          }
        }}
        onSubmit={editingSignal ? handleEditSignal : handleAddSignal}
        initialData={
          editingSignal
            ? {
                source: editingSignal.source,
                rawText: editingSignal.raw_text,
                sourceLink: editingSignal.source_link ?? "",
                signalType: editingSignal.signal_type,
                niche: editingSignal.niche,
                engagementEstimate: editingSignal.engagement_estimate ?? 0,
                tags: editingSignal.tags,
              }
            : undefined
        }
        isEditing={editingSignal !== null}
      />

      <SignalAnalysisDialog
        open={analysisOpen}
        onOpenChange={setAnalysisOpen}
        analysis={analysisResult}
        isLoading={analysisLoading}
        error={analysisError}
        signalText={analyzingSignal?.raw_text ?? ""}
        onSave={handleSaveAnalysis}
      />
    </div>
  );
}
