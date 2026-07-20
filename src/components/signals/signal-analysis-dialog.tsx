"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";
import type { SignalAiAnalysis } from "@/types/database";

interface SignalAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: SignalAiAnalysis | null;
  isLoading: boolean;
  error: string | null;
  signalText: string;
  onSave: (analysis: SignalAiAnalysis) => void;
}

function getScoreColor(score: number): string {
  if (score <= 3) return "text-red-500";
  if (score <= 6) return "text-amber-500";
  return "text-green-500";
}

function getScoreLabel(score: number, t: ReturnType<typeof useI18n>["t"]): string {
  if (score <= 3) return t.signals.scoreLow;
  if (score <= 6) return t.signals.scoreMedium;
  return t.signals.scoreHigh;
}

function getProgressColor(score: number): string {
  if (score <= 3) return "[&>div]:bg-red-500";
  if (score <= 6) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-green-500";
}

export function SignalAnalysisDialog({
  open,
  onOpenChange,
  analysis,
  isLoading,
  error,
  signalText,
  onSave,
}: SignalAnalysisDialogProps) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.signals.title}</DialogTitle>
          <DialogDescription className="line-clamp-2">
            {signalText}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-20 w-full" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {t.signals.analyzing}...
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && analysis && (
          <div className="space-y-5 py-2">
            <section className="space-y-1.5">
              <h4 className="text-sm font-semibold text-muted-foreground">
                {t.signals.painPoint}
              </h4>
              <p className="text-sm leading-relaxed" dir="auto">
                {analysis.pain_point}
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="text-sm font-semibold text-muted-foreground">
                {t.signals.buyingMotive}
              </h4>
              <p className="text-sm leading-relaxed" dir="auto">
                {analysis.buying_motive}
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="text-sm font-semibold text-muted-foreground">
                {t.signals.targetPersona}
              </h4>
              <p className="text-sm leading-relaxed" dir="auto">
                {analysis.target_persona}
              </p>
            </section>

            <section className="space-y-1.5">
              <h4 className="text-sm font-semibold text-muted-foreground">
                {t.signals.suggestedProducts}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {analysis.suggested_products.map((product, i) => (
                  <Badge key={i} variant="secondary">
                    {product}
                  </Badge>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  {t.signals.opportunityScore}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-lg font-bold ${getScoreColor(analysis.opportunity_score)}`}
                  >
                    {analysis.opportunity_score}/10
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {getScoreLabel(analysis.opportunity_score, t)}
                  </Badge>
                </div>
              </div>
              <Progress
                value={analysis.opportunity_score * 10}
                className={`h-3 ${getProgressColor(analysis.opportunity_score)}`}
              />
            </section>

            <section className="space-y-1.5">
              <h4 className="text-sm font-semibold text-muted-foreground">
                {t.signals.explanation}
              </h4>
              <p className="text-sm leading-relaxed" dir="auto">
                {analysis.explanation}
              </p>
            </section>
          </div>
        )}

        {!isLoading && !error && !analysis && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">{t.signals.noResultsYet}</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.signals.close}
          </Button>
          {analysis && (
            <Button onClick={() => onSave(analysis)}>
              <CheckCircle className="h-4 w-4 ml-1" />
              {t.signals.saveAnalysis}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
