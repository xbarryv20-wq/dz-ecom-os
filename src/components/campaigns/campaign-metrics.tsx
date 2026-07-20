"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

export interface CampaignMetrics {
  spend: number;
  messages: number;
  confirmed_orders: number;
  delivered_orders: number;
  cancellations: number;
}

export function calculateMetrics(c: CampaignMetrics) {
  const cost_per_message =
    c.messages > 0 ? c.spend / c.messages : null;
  const cost_per_order =
    c.confirmed_orders > 0 ? c.spend / c.confirmed_orders : null;
  const cancellation_rate =
    c.confirmed_orders > 0
      ? (c.cancellations / c.confirmed_orders) * 100
      : null;
  const delivery_rate =
    c.confirmed_orders > 0
      ? (c.delivered_orders / c.confirmed_orders) * 100
      : null;
  return { cost_per_message, cost_per_order, cancellation_rate, delivery_rate };
}

interface CampaignMetricsDisplayProps {
  metrics: CampaignMetrics;
  className?: string;
}

function MetricRow({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", color)} dir="auto">
        {value}
        {sub && (
          <span className="text-xs text-muted-foreground ms-1">{sub}</span>
        )}
      </span>
    </div>
  );
}

function RateBar({
  label,
  value,
  rate,
  color,
}: {
  label: string;
  value: string;
  rate: number;
  color: string;
}) {
  const clamped = Math.min(Math.max(rate, 0), 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium" dir="auto">
          {value}
        </span>
      </div>
      <Progress
        value={clamped}
        className={cn("h-2 [&>div]:transition-all", color)}
      />
    </div>
  );
}

export function CampaignMetricsDisplay({
  metrics: m,
  className,
}: CampaignMetricsDisplayProps) {
  const { t } = useI18n();
  const derived = calculateMetrics(m);

  return (
    <div className={cn("space-y-1", className)}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
        <MetricRow
          label={t.campaigns.costPerMessage}
          value={
            derived.cost_per_message !== null
              ? `${derived.cost_per_message.toFixed(2)} د.ج`
              : "—"
          }
          color={
            derived.cost_per_message !== null && derived.cost_per_message > 500
              ? "text-red-600"
              : derived.cost_per_message !== null
                ? "text-green-600"
                : ""
          }
        />
        <MetricRow
          label={t.campaigns.costPerOrder}
          value={
            derived.cost_per_order !== null
              ? `${derived.cost_per_order.toFixed(2)} د.ج`
              : "—"
          }
          color={
            derived.cost_per_order !== null && derived.cost_per_order > 2000
              ? "text-red-600"
              : derived.cost_per_order !== null
                ? "text-green-600"
                : ""
          }
        />
      </div>

      <div className="pt-2 space-y-3">
        <RateBar
          label={t.campaigns.deliveryRate}
          value={
            derived.delivery_rate !== null
              ? `${derived.delivery_rate.toFixed(1)}%`
              : "—"
          }
          rate={derived.delivery_rate ?? 0}
          color={
            (derived.delivery_rate ?? 0) >= 70
              ? "[&>div]:bg-green-500"
              : (derived.delivery_rate ?? 0) >= 40
                ? "[&>div]:bg-amber-500"
                : "[&>div]:bg-red-500"
          }
        />
        <RateBar
          label={t.campaigns.cancellationRate}
          value={
            derived.cancellation_rate !== null
              ? `${derived.cancellation_rate.toFixed(1)}%`
              : "—"
          }
          rate={derived.cancellation_rate ?? 0}
          color={
            (derived.cancellation_rate ?? 0) <= 15
              ? "[&>div]:bg-green-500"
              : (derived.cancellation_rate ?? 0) <= 30
                ? "[&>div]:bg-amber-500"
                : "[&>div]:bg-red-500"
          }
        />
      </div>
    </div>
  );
}
