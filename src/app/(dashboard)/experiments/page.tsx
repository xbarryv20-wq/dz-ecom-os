"use client";

import { useState, useMemo, useCallback } from "react";
import { FlaskConical, Plus, Search, TrendingUp, Award, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/context";
import {
  useSupabaseQuery,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";
import type { Experiment } from "@/types/database";

const MOCK_EXPERIMENTS: Experiment[] = [
  {
    id: "1", created_at: "2026-07-15T10:00:00Z", updated_at: "2026-07-15T10:00:00Z",
    user_id: "user-1", name: "Headline A/B Test - Summer Campaign",
    hypothesis: "A benefit-driven headline will outperform a feature-driven headline",
    variable: "headline", metric: "ctr", platform: "facebook",
    campaign_id: null, status: "concluded",
    winner_id: "v2", confidence: 95.2, lift: 12.5,
    started_at: "2026-07-01T00:00:00Z", concluded_at: "2026-07-15T00:00:00Z",
  },
  {
    id: "2", created_at: "2026-07-18T10:00:00Z", updated_at: "2026-07-18T10:00:00Z",
    user_id: "user-1", name: "CTA Button Color Test",
    hypothesis: "A red CTA button will convert better than blue",
    variable: "cta", metric: "conversion_rate", platform: "facebook",
    campaign_id: null, status: "running",
    winner_id: null, confidence: null, lift: null,
    started_at: "2026-07-18T00:00:00Z", concluded_at: null,
  },
  {
    id: "3", created_at: "2026-07-10T10:00:00Z", updated_at: "2026-07-10T10:00:00Z",
    user_id: "user-1", name: "Ad Format: Video vs Image",
    hypothesis: "Video ads will get higher engagement than static images",
    variable: "format", metric: "engagement", platform: "tiktok",
    campaign_id: null, status: "concluded",
    winner_id: "v1", confidence: 98.7, lift: 23.4,
    started_at: "2026-06-20T00:00:00Z", concluded_at: "2026-07-10T00:00:00Z",
  },
];

const MOCK_VARIANTS: Record<string, { id: string; name: string; impressions: number; conversions: number; is_control: boolean }[]> = {
  "1": [
    { id: "v1", name: "A - Feature Focus", impressions: 2500, conversions: 58, is_control: true },
    { id: "v2", name: "B - Benefit Focus", impressions: 2480, conversions: 73, is_control: false },
  ],
  "3": [
    { id: "v3", name: "A - Static Image", impressions: 5200, conversions: 124, is_control: true },
    { id: "v4", name: "B - Video 15s", impressions: 5100, conversions: 178, is_control: false },
  ],
};

export default function ExperimentsPage() {
  const { t } = useI18n();
  const isDemo = !isSupabaseConfigured();

  const { data: dbExperiments, isLoading } = useSupabaseQuery<Experiment>({
    table: "experiments",
    orderBy: { column: "created_at", ascending: false },
    enabled: !isDemo,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const allExperiments = isDemo || !dbExperiments?.length ? MOCK_EXPERIMENTS : dbExperiments;

  const filteredExperiments = useMemo(() => {
    if (!searchQuery) return allExperiments;
    const q = searchQuery.toLowerCase();
    return allExperiments.filter((e) =>
      e.name.toLowerCase().includes(q) || e.hypothesis.toLowerCase().includes(q)
    );
  }, [allExperiments, searchQuery]);

  const statusColors: Record<string, string> = {
    running: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    concluded: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FlaskConical className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.experiments.title}</h1>
            <p className="text-sm text-muted-foreground">{t.experiments.description}</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t.experiments.searchPlaceholder}
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
      ) : filteredExperiments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <FlaskConical className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">{t.experiments.emptyTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">{t.experiments.emptyDesc}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExperiments.map((exp) => {
            const variants = MOCK_VARIANTS[exp.id] || [];
            const winner = exp.winner_id ? variants.find((v) => v.id === exp.winner_id) : null;

            return (
              <Card key={exp.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-semibold leading-tight">{exp.name}</CardTitle>
                      <Badge className={`text-[10px] ${statusColors[exp.status] || ""}`}>
                        {t.experiments.statuses[exp.status as keyof typeof t.experiments.statuses] || exp.status}
                      </Badge>
                    </div>
                    {exp.confidence != null && (
                      <div className="flex items-center gap-1 text-sm font-medium text-primary">
                        <Award className="h-4 w-4" />
                        <span>{exp.confidence}%</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-2">{exp.hypothesis}</p>

                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="bg-muted px-1.5 py-0.5 rounded">
                      {t.experiments.variable}: {t.experiments.variables[exp.variable as keyof typeof t.experiments.variables] || exp.variable}
                    </span>
                    <span className="bg-muted px-1.5 py-0.5 rounded">
                      {t.experiments.metric}: {t.experiments.metrics[exp.metric as keyof typeof t.experiments.metrics] || exp.metric}
                    </span>
                    {exp.lift != null && (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded font-medium">
                        +{exp.lift}% {t.experiments.lift}
                      </span>
                    )}
                  </div>

                  {variants.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        {t.experiments.variants}
                      </p>
                      {variants.map((v) => (
                        <div key={v.id} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1">
                            {v.name}
                            {v.is_control && (
                              <Badge variant="outline" className="text-[9px] px-1 py-0">{t.experiments.control}</Badge>
                            )}
                            {exp.winner_id === v.id && (
                              <Award className="h-3 w-3 text-yellow-500" />
                            )}
                          </span>
                          <span className="text-muted-foreground">
                            {v.conversions}/{v.impressions} ({(v.conversions / v.impressions * 100).toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {exp.status === "running" && (
                    <div className="flex items-center gap-2 pt-1">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground">{t.experiments.statuses.running}</span>
                    </div>
                  )}

                  {winner && exp.status === "concluded" && (
                    <div className="rounded-md bg-primary/5 p-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">{t.experiments.winner}: {winner.name}</span>
                    </div>
                  )}

                  {exp.status === "concluded" && !winner && (
                    <p className="text-xs text-muted-foreground">{t.experiments.noWinner}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
