"use client";

import { TrendingUp, DollarSign } from "lucide-react";

interface PriceCalculatorProps {
  costPrice: number;
  sellPrice: number;
  deliveryCost: number;
  confirmationCost: number;
  adSpendEstimate: number;
}

export function PriceCalculator({
  costPrice,
  sellPrice,
  deliveryCost,
  confirmationCost,
  adSpendEstimate,
}: PriceCalculatorProps) {
  const totalCost = costPrice + deliveryCost + confirmationCost + adSpendEstimate;
  const margin = sellPrice - totalCost;
  const marginPercent = sellPrice > 0 ? (margin / sellPrice) * 100 : 0;

  const isPositive = margin >= 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <DollarSign className="h-4 w-4 text-red-600" />
        )}
        <span
          className={`text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}
        >
          {margin.toFixed(2)} د.ج
        </span>
      </div>
      <span
        className={`text-xs px-1.5 py-0.5 rounded ${isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
      >
        {isPositive ? "+" : ""}
        {marginPercent.toFixed(1)}%
      </span>
    </div>
  );
}
