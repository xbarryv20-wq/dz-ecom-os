"use client";

import { useState, useMemo, useCallback } from "react";
import { Package, Plus, Filter, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductCard, type Product } from "@/components/products/product-card";
import { ProductForm } from "@/components/products/product-form";
import { ProductDetail } from "@/components/products/product-detail";
import {
  AIEvaluationDialog,
  type AIEvaluation,
} from "@/components/products/ai-evaluation-dialog";
import { CROAuditDialog } from "@/components/products/cro-audit-dialog";
import { useI18n } from "@/lib/i18n/context";
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
  getCurrentUserId,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";
import { mapDbProductToProduct } from "@/lib/supabase/mappers";
import type { Product as DbProduct } from "@/types/database";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "سماعات لاسلكية بلوتوث",
    niche: "electronics",
    description: "سماعات لاسلكية عالية الجودة مع خدوم عازل للضوضاء",
    sourceLink: "https://example.com/supplier1",
    costPrice: 800,
    sellPrice: 2500,
    deliveryCost: 200,
    confirmationCost: 150,
    adSpendEstimate: 300,
    notes: "مورد موثوق، وقت التوصيل 5-7 أيام",
    status: "active",
    aiReviewed: true,
    createdAt: "2026-07-10",
  },
  {
    id: "2",
    name: "حافظة هاتف مغناطيسية",
    niche: "electronics",
    description: "حافظة هاتف بتصميم أنيق مع دعم الشحن اللاسلكي",
    costPrice: 150,
    sellPrice: 600,
    deliveryCost: 100,
    confirmationCost: 80,
    adSpendEstimate: 120,
    notes: "",
    status: "ready",
    aiReviewed: false,
    createdAt: "2026-07-12",
  },
  {
    id: "3",
    name: "مجموعة فرش مكياج احترافية",
    niche: "beauty",
    description: "مجموعة فرش مكياج من 12 قطعة بجودة عالية",
    sourceLink: "https://example.com/supplier2",
    costPrice: 500,
    sellPrice: 1800,
    deliveryCost: 150,
    confirmationCost: 100,
    adSpendEstimate: 250,
    notes: "الأكثر مبيعاً في فئته",
    status: "active",
    aiReviewed: true,
    createdAt: "2026-07-08",
  },
  {
    id: "4",
    name: "ساعة ذكية رياضية",
    niche: "sports",
    description: "ساعة ذكية مقاومة للماء مع تتبع اللياقة",
    costPrice: 1200,
    sellPrice: 3500,
    deliveryCost: 250,
    confirmationCost: 200,
    adSpendEstimate: 400,
    notes: "",
    status: "draft",
    aiReviewed: false,
    createdAt: "2026-07-15",
  },
  {
    id: "5",
    name: "وسادة دعم الرقبة",
    niche: "health",
    description: "وسادة مدعومة بالرغوة الذاكرة لتخفيف آلام الرقبة",
    costPrice: 300,
    sellPrice: 900,
    deliveryCost: 120,
    confirmationCost: 80,
    adSpendEstimate: 150,
    notes: "نتائج مبيعات واعدة",
    status: "ready",
    aiReviewed: true,
    createdAt: "2026-07-14",
  },
];

const NICHE_OPTIONS = [
  { value: "all", label: "all" },
  { value: "electronics", label: "electronics" },
  { value: "fashion", label: "fashion" },
  { value: "beauty", label: "beauty" },
  { value: "home", label: "home" },
  { value: "health", label: "health" },
  { value: "sports", label: "sports" },
  { value: "toys", label: "toys" },
  { value: "automotive", label: "automotive" },
  { value: "pets", label: "pets" },
  { value: "food", label: "food" },
  { value: "other", label: "other" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "all" },
  { value: "draft", label: "draft" },
  { value: "ready", label: "ready" },
  { value: "active", label: "active" },
];

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
          <Skeleton className="h-6 w-28" />
          <div className="flex gap-2 border-t pt-3">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-8 w-16 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const { t } = useI18n();

  const isDemo = !isSupabaseConfigured();

  const {
    data: dbProducts,
    isLoading,
    refetch,
  } = useSupabaseQuery<DbProduct>({
    table: "products",
    orderBy: { column: "created_at", ascending: false },
    enabled: !isDemo,
  });

  const products: Product[] = isDemo || !dbProducts?.length
    ? MOCK_PRODUCTS
    : (dbProducts.map(mapDbProductToProduct) as unknown as Product[]);

  const { insert } = useSupabaseInsert<DbProduct>("products");
  const { update } = useSupabaseUpdate<DbProduct>("products");
  const { remove } = useSupabaseDelete("products");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterNiche, setFilterNiche] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleCroAudit = useCallback((product: Product) => {
    setCroProduct(product);
    setCroDialogOpen(true);
  }, []);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [evalDialogOpen, setEvalDialogOpen] = useState(false);
  const [evaluatingProduct, setEvaluatingProduct] = useState<Product | null>(
    null
  );
  const [croDialogOpen, setCroDialogOpen] = useState(false);
  const [croProduct, setCroProduct] = useState<Product | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<AIEvaluation | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.includes(searchQuery) ||
        p.description.includes(searchQuery);
      const matchesNiche = filterNiche === "all" || p.niche === filterNiche;
      const matchesStatus =
        filterStatus === "all" || p.status === filterStatus;
      return matchesSearch && matchesNiche && matchesStatus;
    });
  }, [products, searchQuery, filterNiche, filterStatus]);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDeleteId(id);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;

    if (isDemo) {
      // Demo mode: local state only
      setDeleteId(null);
      return;
    }

    const { error } = await remove(deleteId);
    if (!error) {
      refetch();
    }
    setDeleteId(null);
  }, [deleteId, isDemo, remove, refetch]);

  const handleView = useCallback((product: Product) => {
    setViewingProduct(product);
    setDetailOpen(true);
  }, []);

  const handleEvaluate = useCallback(async (product: Product) => {
    setEvaluatingProduct(product);
    setEvalDialogOpen(true);
    setEvalLoading(true);
    setEvalResult(null);
    setEvalError(null);

    try {
      const res = await fetch("/api/ai/evaluate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.name,
          niche: product.niche,
          costPrice: product.costPrice,
          sellPrice: product.sellPrice,
        }),
      });
      if (!res.ok) throw new Error("Evaluation failed");
      const { data } = await res.json();
      setEvalResult(data);
      // Mark as reviewed in DB
      if (!isDemo) {
        await update(product.id, { status: product.status });
        refetch();
      }
    } catch (err) {
      setEvalError(err instanceof Error ? err.message : "Error");
    } finally {
      setEvalLoading(false);
    }
  }, [isDemo, update, refetch]);

  const handleFormSubmit = useCallback(
    async (data: {
      name: string;
      niche: string;
      description: string;
      sourceLink: string;
      costPrice: number;
      sellPrice: number;
      deliveryCost: number;
      confirmationCost: number;
      adSpendEstimate: number;
      notes: string;
      status: "draft" | "ready" | "active";
    }) => {
      if (isDemo) {
        // Demo mode: local state only
        if (editingProduct) {
          setFormOpen(false);
          setEditingProduct(null);
        } else {
          setFormOpen(false);
        }
        return;
      }

      const userId = await getCurrentUserId();
      if (!userId) return;

      if (editingProduct) {
        const { error } = await update(editingProduct.id, {
          name: data.name,
          niche: data.niche,
          description: data.description,
          source_link: data.sourceLink || null,
          cost_price: data.costPrice,
          sell_price: data.sellPrice,
          delivery_cost: data.deliveryCost,
          confirmation_cost: data.confirmationCost,
          ad_spend_estimate: data.adSpendEstimate,
          notes: data.notes,
          status: data.status,
        });
        if (!error) {
          refetch();
        }
      } else {
        const { error } = await insert({
          user_id: userId,
          name: data.name,
          niche: data.niche,
          description: data.description,
          source_link: data.sourceLink || null,
          cost_price: data.costPrice,
          sell_price: data.sellPrice,
          delivery_cost: data.deliveryCost,
          confirmation_cost: data.confirmationCost,
          ad_spend_estimate: data.adSpendEstimate,
          notes: data.notes,
          status: data.status,
        });
        if (!error) {
          refetch();
        }
      }
      setEditingProduct(null);
    },
    [editingProduct, isDemo, insert, update, refetch]
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">{t.products.title}</h1>
          <Badge variant="secondary">{products.length}</Badge>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {t.products.addProduct}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.products.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9"
          />
        </div>
        <Select value={filterNiche} onValueChange={setFilterNiche}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 ms-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="all">{t.common.all} {t.products.niche}</SelectItem>
              {NICHE_OPTIONS.filter((o) => o.value !== "all").map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t.niches[opt.value]}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="all">{t.common.all} {t.products.status}</SelectItem>
              {STATUS_OPTIONS.filter((o) => o.value !== "all").map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t.products.statuses[opt.value]}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <Package className="h-12 w-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-1">{t.products.emptyTitle}</h3>
          <p className="text-sm mb-4">
            {products.length === 0
              ? t.products.emptyDesc
              : t.products.emptyDescFiltered}
          </p>
          {products.length === 0 && (
            <Button
              onClick={() => {
                setEditingProduct(null);
                setFormOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t.products.addProduct}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onEvaluate={handleEvaluate}
              onView={handleView}
              onCroAudit={handleCroAudit}
            />
          ))}
        </div>
      )}

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
      />

      {viewingProduct && (
        <ProductDetail
          open={detailOpen}
          onOpenChange={setDetailOpen}
          product={viewingProduct}
          onEdit={handleEdit}
          onEvaluate={handleEvaluate}
        />
      )}

      <AIEvaluationDialog
        open={evalDialogOpen}
        onOpenChange={setEvalDialogOpen}
        productName={evaluatingProduct?.name || ""}
        evaluation={evalResult}
        loading={evalLoading}
        error={evalError}
      />

      <CROAuditDialog
        open={croDialogOpen}
        onOpenChange={setCroDialogOpen}
        product={croProduct}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.products.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.products.deleteDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
