"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, TrendingUp, Lightbulb, BarChart3 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { Product } from "@/components/products/product-card";

interface AuditResult {
  scores: Record<string, number>;
  overall: number;
  letter_grade: string;
  recommendations: string[];
  benchmark_percentile: number;
}

interface CROAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const DIMENSION_LABELS: Record<string, string> = {
  headline: "Headline",
  clarity: "Clarity",
  urgency: "Urgency",
  trust: "Trust",
  cta: "Call to Action",
  mobile: "Mobile",
  speed: "Speed",
  design: "Design",
};

export function CROAuditDialog({ open, onOpenChange, product }: CROAuditDialogProps) {
  const { t } = useI18n();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    if (!product) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/cro-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          productDescription: product.description,
          price: product.sellPrice,
        }),
      });
      const data = await res.json();
      if (data.scores) setResult(data);
    } catch (e) {
      console.error("CRO audit failed:", e);
    }
    setLoading(false);
  };

  function getGradeColor(grade: string) {
    const g = grade?.charAt(0) || "F";
    if (g === "A") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (g === "B") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (g === "C") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            {t.cro.title} — {product?.name}
          </DialogTitle>
          <DialogDescription>{t.cro.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!result && !loading && (
            <Button onClick={handleAudit} className="w-full">
              <Search className="h-4 w-4 ml-1" />
              {t.cro.runAudit}
            </Button>
          )}

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {result && (
            <>
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{result.overall.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">{t.cro.overallScore}</p>
                </div>
                {result.letter_grade && (
                  <div className="text-center">
                    <Badge className={`text-lg px-3 py-1 ${getGradeColor(result.letter_grade)}`}>
                      {result.letter_grade}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{t.cro.letterGrade}</p>
                  </div>
                )}
                {result.benchmark_percentile != null && (
                  <div className="text-center">
                    <div className="text-xl font-semibold">{result.benchmark_percentile}%</div>
                    <p className="text-xs text-muted-foreground">{t.cro.benchmark}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t.cro.dimensionScores}
                </p>
                {Object.entries(result.scores).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span>{DIMENSION_LABELS[key] || key}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${val * 10}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-6 text-right">{val}/10</span>
                    </div>
                  </div>
                ))}
              </div>

              {result.recommendations?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    {t.cro.recommendations}
                  </p>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
