"use client";

import {
  Package,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceCalculator } from "./price-calculator";
import { useI18n } from "@/lib/i18n/context";

export interface Product {
  id: string;
  name: string;
  niche: string;
  description: string;
  sourceLink?: string;
  costPrice: number;
  sellPrice: number;
  deliveryCost: number;
  confirmationCost: number;
  adSpendEstimate: number;
  notes: string;
  status: "draft" | "ready" | "active";
  aiReviewed: boolean;
  createdAt: string;
}

const NICHE_OPTIONS = [
  { value: "electronics", label: "إلكترونيات" },
  { value: "fashion", label: "أزياء" },
  { value: "beauty", label: "جمال وعناية" },
  { value: "home", label: "المنزل" },
  { value: "health", label: "صحة" },
  { value: "sports", label: "رياضة" },
  { value: "toys", label: "ألعاب" },
  { value: "automotive", label: "سيارات" },
  { value: "pets", label: "حيوانات أليفة" },
  { value: "food", label: "أغذية" },
  { value: "other", label: "أخرى" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "مسودة", color: "bg-gray-100 text-gray-700" },
  { value: "ready", label: "جاهز", color: "bg-blue-100 text-blue-700" },
  { value: "active", label: "نشط", color: "bg-green-100 text-green-700" },
];

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onEvaluate: (product: Product) => void;
  onView: (product: Product) => void;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onEvaluate,
  onView,
}: ProductCardProps) {
  const { t } = useI18n();
  const nicheLabel =
    NICHE_OPTIONS.find((n) => n.value === product.niche)?.label || product.niche;
  const statusOption =
    STATUS_OPTIONS.find((s) => s.value === product.status) || STATUS_OPTIONS[0];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">{product.name}</CardTitle>
          </div>
          {product.aiReviewed && (
            <Badge className="bg-purple-100 text-purple-700 gap-1">
              <Sparkles className="h-3 w-3" />
              {t.products.reviewed}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">{nicheLabel}</Badge>
          <Badge className={statusOption.color}>{statusOption.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">{t.products.cost}:</span>
            <span className="ms-1 font-medium">{product.costPrice} د.ج</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t.products.sell}:</span>
            <span className="ms-1 font-medium">{product.sellPrice} د.ج</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t.products.delivery}:</span>
            <span className="ms-1 font-medium">{product.deliveryCost} د.ج</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t.products.confirmation}:</span>
            <span className="ms-1 font-medium">{product.confirmationCost} د.ج</span>
          </div>
        </div>

        <PriceCalculator
          costPrice={product.costPrice}
          sellPrice={product.sellPrice}
          deliveryCost={product.deliveryCost}
          confirmationCost={product.confirmationCost}
          adSpendEstimate={product.adSpendEstimate}
        />

        {product.sourceLink && (
          <a
            href={product.sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="h-3 w-3" />
            {t.products.linkToSource}
          </a>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() => onEvaluate(product)}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t.products.evaluate}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() => onView(product)}
        >
          <Eye className="h-3.5 w-3.5" />
          {t.products.view}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={() => onEdit(product)}
        >
          <Edit className="h-3.5 w-3.5" />
          {t.common.edit}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(product.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t.common.delete}
        </Button>
      </CardFooter>
    </Card>
  );
}
