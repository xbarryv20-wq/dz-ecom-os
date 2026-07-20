"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  iconColor = "text-blue-600",
}: MetricCardProps) {
  const isPositiveTrend = trend && trend.value > 0;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            iconColor === "text-blue-600" && "bg-blue-50 text-blue-600",
            iconColor === "text-green-600" && "bg-green-50 text-green-600",
            iconColor === "text-purple-600" && "bg-purple-50 text-purple-600",
            iconColor === "text-orange-600" && "bg-orange-50 text-orange-600"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositiveTrend ? "text-green-600" : "text-red-600"
              )}
            >
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {trend?.label && (
            <p className="text-sm text-muted-foreground">{trend.label}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
