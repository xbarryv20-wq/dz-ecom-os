"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceCalculator } from "./price-calculator";
import { useI18n } from "@/lib/i18n/context";
import type { Product } from "./product-card";

const NICHE_OPTIONS = [
  { value: "electronics" },
  { value: "fashion" },
  { value: "beauty" },
  { value: "home" },
  { value: "health" },
  { value: "sports" },
  { value: "toys" },
  { value: "automotive" },
  { value: "pets" },
  { value: "food" },
  { value: "other" },
];

const STATUS_OPTIONS = [
  { value: "draft" },
  { value: "ready" },
  { value: "active" },
];

interface ProductFormData {
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
}

const DEFAULT_FORM: ProductFormData = {
  name: "",
  niche: "",
  description: "",
  sourceLink: "",
  costPrice: 0,
  sellPrice: 0,
  deliveryCost: 0,
  confirmationCost: 0,
  adSpendEstimate: 0,
  notes: "",
  status: "draft",
};

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: Product | null;
}

export function ProductForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: ProductFormProps) {
  const { t } = useI18n();
  const [form, setForm] = useState<ProductFormData>(() =>
    initialData
      ? {
          name: initialData.name,
          niche: initialData.niche,
          description: initialData.description,
          sourceLink: initialData.sourceLink || "",
          costPrice: initialData.costPrice,
          sellPrice: initialData.sellPrice,
          deliveryCost: initialData.deliveryCost,
          confirmationCost: initialData.confirmationCost,
          adSpendEstimate: initialData.adSpendEstimate,
          notes: initialData.notes,
          status: initialData.status,
        }
      : DEFAULT_FORM
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const margin = useMemo(() => {
    return (
      form.sellPrice -
      form.costPrice -
      form.deliveryCost -
      form.confirmationCost -
      form.adSpendEstimate
    );
  }, [
    form.sellPrice,
    form.costPrice,
    form.deliveryCost,
    form.confirmationCost,
    form.adSpendEstimate,
  ]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.products.name + " " + t.common.status;
    if (!form.niche) e.niche = t.products.niche + " " + t.common.status;
    if (form.costPrice < 0) e.costPrice = t.products.costPrice + " " + t.common.status;
    if (form.sellPrice <= 0) e.sellPrice = t.products.sellPrice + " " + t.common.status;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t.common.edit : t.products.addProduct}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.products.name} *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t.products.name}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t.products.niche} *</Label>
            <Select
              value={form.niche}
              onValueChange={(v) => setForm({ ...form, niche: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.products.niche} />
              </SelectTrigger>
              <SelectContent>
                {NICHE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {t.products.niches[opt.value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.niche && (
              <p className="text-xs text-red-500">{errors.niche}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t.products.status}</Label>
            <Select
              value={form.status}
              onValueChange={(v: "draft" | "ready" | "active") =>
                setForm({ ...form, status: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {t.products.statuses[opt.value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.products.description}</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder={t.products.description + "..."}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceLink">{t.products.sourceLink}</Label>
            <Input
              id="sourceLink"
              value={form.sourceLink}
              onChange={(e) =>
                setForm({ ...form, sourceLink: e.target.value })
              }
              placeholder="https://..."
              dir="ltr"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">{t.products.costPrice} (د.ج) *</Label>
              <Input
                id="costPrice"
                type="number"
                min={0}
                value={form.costPrice || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    costPrice: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {errors.costPrice && (
                <p className="text-xs text-red-500">{errors.costPrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellPrice">{t.products.sellPrice} (د.ج) *</Label>
              <Input
                id="sellPrice"
                type="number"
                min={0}
                value={form.sellPrice || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sellPrice: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {errors.sellPrice && (
                <p className="text-xs text-red-500">{errors.sellPrice}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryCost">{t.products.deliveryCost} (د.ج)</Label>
              <Input
                id="deliveryCost"
                type="number"
                min={0}
                value={form.deliveryCost || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deliveryCost: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmationCost">{t.products.confirmationCost} (د.ج)</Label>
              <Input
                id="confirmationCost"
                type="number"
                min={0}
                value={form.confirmationCost || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmationCost: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adSpendEstimate">{t.products.adSpendEstimate} (د.ج)</Label>
            <Input
              id="adSpendEstimate"
              type="number"
              min={0}
              value={form.adSpendEstimate || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  adSpendEstimate: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-xs text-muted-foreground mb-2 block">
              {t.products.estimatedMargin}
            </Label>
            <PriceCalculator
              costPrice={form.costPrice}
              sellPrice={form.sellPrice}
              deliveryCost={form.deliveryCost}
              confirmationCost={form.confirmationCost}
              adSpendEstimate={form.adSpendEstimate}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t.common.notes}</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder={t.common.notes + "..."}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit">
              {initialData ? t.common.save : t.products.addProduct}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
