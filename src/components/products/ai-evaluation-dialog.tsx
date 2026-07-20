"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  TrendingUp,
  ShoppingCart,
  Compass,
  AlertCircle,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export interface AIEvaluation {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  marketFitScore: number;
  upsellIdeas: string[];
  angleIdeas: string[];
  operationalComplexity: "منخفض" | "متوسط" | "عالي";
  finalRecommendation: string;
}

interface AIEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  evaluation: AIEvaluation | null;
  loading: boolean;
  error: string | null;
}

function ScoreGauge({ score, t }: { score: number; t: ReturnType<typeof useI18n>["t"] }) {
  const getColor = (s: number) => {
    if (s >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (s >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (s >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getLabel = (s: number) => {
    if (s >= 80) return t.products.scoreExcellent;
    if (s >= 60) return t.products.scoreGood;
    if (s >= 40) return t.products.scoreAcceptable;
    return t.products.scoreWeak;
  };

  return (
    <div className={`flex flex-col items-center p-4 rounded-xl border-2 ${getColor(score)}`}>
      <span className="text-4xl font-bold">{score}</span>
      <span className="text-sm font-medium mt-1">{getLabel(score)}</span>
      <span className="text-xs text-muted-foreground mt-0.5">{t.products.marketFitLabel}</span>
    </div>
  );
}

function LoadingState({ t }: { t: ReturnType<typeof useI18n>["t"] }) {
  return (
    <div className="space-y-4 py-6">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Sparkles className="h-5 w-5 animate-pulse text-purple-500" />
        <span>{t.products.analyzingProduct}</span>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <AlertCircle className="h-10 w-10 text-red-500" />
      <p className="text-red-600 text-sm">{error}</p>
    </div>
  );
}

export function AIEvaluationDialog({
  open,
  onOpenChange,
  productName,
  evaluation,
  loading,
  error,
}: AIEvaluationDialogProps) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            {t.products.productEvaluation} — {productName}
          </DialogTitle>
        </DialogHeader>

        {loading && <LoadingState t={t} />}
        {error && <ErrorState error={error} />}

        {evaluation && (
          <div className="space-y-5">
            <div className="flex justify-center">
              <ScoreGauge score={evaluation.marketFitScore} t={t} />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    {t.products.strengths}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {evaluation.strengths.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    {t.products.weaknesses}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {evaluation.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-600">
                  <Lightbulb className="h-4 w-4" />
                  {t.products.recommendations}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {evaluation.recommendations.map((r, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-orange-600">
                    <ShoppingCart className="h-4 w-4" />
                    {t.products.upsellIdeas}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {evaluation.upsellIdeas.map((u, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        {u}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-purple-600">
                    <Compass className="h-4 w-4" />
                    {t.products.angleIdeas}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {evaluation.angleIdeas.map((a, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t.products.complexity}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant="secondary"
                  className={
                    evaluation.operationalComplexity === "منخفض"
                      ? "bg-green-100 text-green-700"
                      : evaluation.operationalComplexity === "متوسط"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }
                >
                  {evaluation.operationalComplexity}
                </Badge>
              </CardContent>
            </Card>

            <Separator />

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t.products.finalRecommendation}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {evaluation.finalRecommendation}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
