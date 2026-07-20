"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Dices } from "lucide-react";
import { generateId } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

export interface VariantFormData {
  product_id: string;
  sku: string;
  model: string;
  color: string;
  storage: string;
  quantity: number;
  notes: string;
}

interface VariantFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: VariantFormData) => void;
  products: { id: string; name: string }[];
  initialData?: {
    id?: string;
    product_id: string;
    sku: string;
    model: string;
    color: string;
    storage: string;
    quantity: number;
    notes: string;
  };
}

function generateSKU(productName: string): string {
  const prefix = productName.slice(0, 3).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${suffix}`;
}

export function VariantForm({
  open,
  onOpenChange,
  onSave,
  products,
  initialData,
}: VariantFormProps) {
  const { t } = useI18n();
  const [productId, setProductId] = useState(initialData?.product_id ?? "");
  const [sku, setSku] = useState(initialData?.sku ?? "");
  const [model, setModel] = useState(initialData?.model ?? "");
  const [color, setColor] = useState(initialData?.color ?? "");
  const [storage, setStorage] = useState(initialData?.storage ?? "");
  const [quantity, setQuantity] = useState<number>(initialData?.quantity ?? 0);
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!productId) errs.product_id = t.products.title + " " + t.common.status;
    if (!sku.trim()) errs.sku = t.products.sku + " " + t.common.status;
    if (quantity < 0) errs.quantity = t.products.quantity + " " + t.common.status;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      product_id: productId,
      sku: sku.trim(),
      model: model.trim(),
      color: color.trim(),
      storage: storage.trim(),
      quantity,
      notes: notes.trim(),
    });
    onOpenChange(false);
  };

  const handleAutoSKU = () => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSku(generateSKU(product.name));
    }
  };

  const isEditing = !!initialData?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? t.common.edit : t.inventory.addVariant}</DialogTitle>
          <DialogDescription>
            {isEditing ? t.inventory.description : t.inventory.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t.products.title} *</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder={t.angles.chooseProduct} />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.product_id && (
              <p className="text-xs text-destructive">{errors.product_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t.products.sku} *</Label>
            <div className="flex gap-2">
              <Input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="NSH-ABC12"
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAutoSKU} title={t.inventory.addVariant}>
                <Dices className="h-4 w-4" />
              </Button>
            </div>
            {errors.sku && (
              <p className="text-xs text-destructive">{errors.sku}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.products.model}</Label>
              <Input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder={t.products.model}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.products.color}</Label>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder={t.products.color}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.products.storage}</Label>
              <Input
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="256GB"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.products.quantity} *</Label>
              <Input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">{errors.quantity}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.common.notes}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.common.notes + "..."}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit">
              <Save className="ml-2 h-4 w-4" />
              {isEditing ? t.common.save : t.common.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
