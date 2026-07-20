"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Edit,
  Sparkles,
  ExternalLink,
  TrendingUp,
  ShoppingCart,
  Boxes,
} from "lucide-react";
import { PriceCalculator } from "./price-calculator";
import { useI18n } from "@/lib/i18n/context";
import type { Product } from "./product-card";

interface ProductDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onEdit: (product: Product) => void;
  onEvaluate: (product: Product) => void;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  ready: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
};

export function ProductDetail({
  open,
  onOpenChange,
  product,
  onEdit,
  onEvaluate,
}: ProductDetailProps) {
  const { t } = useI18n();
  const nicheLabel = t.products.niches[product.niche] ?? product.niche;
  const statusColor = STATUS_COLORS[product.status] ?? STATUS_COLORS.draft;

  const totalCost =
    product.costPrice +
    product.deliveryCost +
    product.confirmationCost +
    product.adSpendEstimate;
  const margin = product.sellPrice - totalCost;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t.products.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              {t.products.title}
            </TabsTrigger>
            <TabsTrigger value="variants" className="flex-1">
              {t.products.variants}
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">
              {t.products.productEvaluation}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {product.description || t.common.noData}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{nicheLabel}</Badge>
                <Badge className={statusColor}>{t.products.statuses[product.status]}</Badge>
                {product.aiReviewed && (
                  <Badge className="bg-purple-100 text-purple-700 gap-1">
                    <Sparkles className="h-3 w-3" />
                    {t.products.reviewed}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t.products.title}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">{t.products.costPrice}</span>
                  <span className="text-sm font-medium">{product.costPrice} د.ج</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">{t.products.sellPrice}</span>
                  <span className="text-sm font-medium">{product.sellPrice} د.ج</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">{t.products.deliveryCost}</span>
                  <span className="text-sm font-medium">{product.deliveryCost} د.ج</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">{t.products.confirmationCost}</span>
                  <span className="text-sm font-medium">
                    {product.confirmationCost} د.ج
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">{t.products.adSpendEstimate}</span>
                  <span className="text-sm font-medium">
                    {product.adSpendEstimate} د.ج
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    {t.products.cost}
                  </span>
                  <span className="text-sm font-medium">{totalCost} د.ج</span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg border-2 ${margin >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t.products.margin}</span>
                  <PriceCalculator
                    costPrice={product.costPrice}
                    sellPrice={product.sellPrice}
                    deliveryCost={product.deliveryCost}
                    confirmationCost={product.confirmationCost}
                    adSpendEstimate={product.adSpendEstimate}
                  />
                </div>
              </div>
            </div>

            {product.sourceLink && (
              <div>
                <Separator />
                <a
                  href={product.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-3"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t.products.linkToSource}
                </a>
              </div>
            )}

            {product.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-1">{t.common.notes}</h4>
                  <p className="text-sm text-muted-foreground">{product.notes}</p>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="gap-1"
                onClick={() => {
                  onEdit(product);
                  onOpenChange(false);
                }}
              >
                <Edit className="h-3.5 w-3.5" />
                {t.common.edit}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => {
                  onEvaluate(product);
                  onOpenChange(false);
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t.products.evaluate}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="variants" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Boxes className="h-4 w-4" />
                  {t.products.variants}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t.common.noData}</p>
                    <p className="text-xs mt-1">
                      {t.products.addVariant}
                    </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  {t.products.productEvaluation}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {product.aiReviewed ? (
                  <div className="text-center py-6">
                    <Badge className="bg-purple-100 text-purple-700 gap-1 mb-3">
                      <Sparkles className="h-3 w-3" />
                      {t.products.reviewed}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {t.products.analyzingProduct}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground mb-3">
                      {t.products.emptyTitle}
                    </p>
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        onEvaluate(product);
                        onOpenChange(false);
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {t.products.evaluate}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
