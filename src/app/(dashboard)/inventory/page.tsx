"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Warehouse, Plus, AlertTriangle, CheckCircle, Package } from "lucide-react";
import { InventoryTable, type InventoryVariant } from "@/components/inventory/inventory-table";
import { VariantForm, type VariantFormData } from "@/components/inventory/variant-form";
import { StockMovementDialog } from "@/components/inventory/stock-movement-dialog";
import { generateId } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";
import { mapDbVariantToVariant } from "@/lib/supabase/mappers";
import type { ProductVariant as DbVariant } from "@/types/database";

const MOCK_PRODUCTS = [
  { id: "p1", name: "نظارة شمسية بريميوم" },
  { id: "p2", name: "سماعات لاسلكية برو" },
  { id: "p3", name: "مكنسة روبوتية ذكية" },
  { id: "p4", name: "ساعة رياضية ذكية" },
  { id: "p5", name: "حقيبة ظهر مقاومة للماء" },
];

const MOCK_VARIANTS: InventoryVariant[] = [
  { id: "v1", product_id: "p1", product_name: "نظارة شمسية بريميوم", sku: "NSH-BLK-001", model: "كلاسيك", color: "أسود", storage: "", quantity: 50, reserved_quantity: 5, notes: "" },
  { id: "v2", product_id: "p1", product_name: "نظارة شمسية بريميوم", sku: "NSH-BRN-002", model: "كلاسيك", color: "بني", storage: "", quantity: 3, reserved_quantity: 1, notes: "" },
  { id: "v3", product_id: "p2", product_name: "سماعات لاسلكية برو", sku: "SMA-WHT-001", model: "برو", color: "أبيض", storage: "256GB", quantity: 25, reserved_quantity: 3, notes: "" },
  { id: "v4", product_id: "p2", product_name: "سماعات لاسلكية برو", sku: "SMA-BLK-002", model: "برو", color: "أسود", storage: "512GB", quantity: 8, reserved_quantity: 2, notes: "" },
  { id: "v5", product_id: "p3", product_name: "مكنسة روبوتية ذكية", sku: "MKN-STD-001", model: "ستاندرد", color: "أبيض", storage: "", quantity: 0, reserved_quantity: 0, notes: "نفد المخزون" },
  { id: "v6", product_id: "p4", product_name: "ساعة رياضية ذكية", sku: "SA3-BLK-001", model: "سبورت", color: "أسود", storage: "", quantity: 40, reserved_quantity: 6, notes: "" },
  { id: "v7", product_id: "p5", product_name: "حقيبة ظهر مقاومة للماء", sku: "HQP-GRY-001", model: "رحلة", color: "رمادي", storage: "", quantity: 15, reserved_quantity: 0, notes: "" },
  { id: "v8", product_id: "p4", product_name: "ساعة رياضية ذكية", sku: "SA3-SLV-002", model: "سبورت", color: "فضي", storage: "", quantity: 2, reserved_quantity: 1, notes: "" },
];

export default function InventoryPage() {
  const { t } = useI18n();
  const isDemo = !isSupabaseConfigured();

  const { data: dbVariants, refetch: refetchVariants } =
    useSupabaseQuery<DbVariant>({
      table: "product_variants",
      orderBy: { column: "created_at", ascending: false },
      enabled: !isDemo,
    });

  const { data: dbProducts } = useSupabaseQuery<{ id: string; name: string }>({
    table: "products",
    select: "id, name",
    orderBy: { column: "name", ascending: true },
    enabled: !isDemo,
  });

  const { insert: insertVariant } = useSupabaseInsert<DbVariant>("product_variants");
  const { update: updateVariant } = useSupabaseUpdate<DbVariant>("product_variants");
  const { remove: deleteVariant } = useSupabaseDelete("product_variants");

  const [demoVariants, setDemoVariants] = useState<InventoryVariant[]>(MOCK_VARIANTS);

  const products = isDemo || !dbProducts?.length ? MOCK_PRODUCTS : dbProducts;

  const variants: InventoryVariant[] = isDemo || !dbVariants?.length
    ? demoVariants
    : dbVariants.map((v) => {
        const mapped = mapDbVariantToVariant(v);
        const product = dbProducts.find((p) => p.id === v.product_id);
        return {
          id: mapped.id,
          product_id: v.product_id,
          product_name: product?.name ?? "",
          sku: mapped.sku,
          model: mapped.model,
          color: mapped.color,
          storage: mapped.storage,
          quantity: mapped.quantity,
          reserved_quantity: v.reserved_quantity,
          notes: mapped.notes,
        };
      });

  const [variantFormOpen, setVariantFormOpen] = useState(false);
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<InventoryVariant | null>(null);
  const [movementVariant, setMovementVariant] = useState<InventoryVariant | null>(null);

  const totalQuantity = variants.reduce((s, v) => s + v.quantity, 0);
  const totalReserved = variants.reduce((s, v) => s + v.reserved_quantity, 0);
  const totalAvailable = totalQuantity - totalReserved;
  const lowStockCount = variants.filter((v) => {
    const avail = v.quantity - v.reserved_quantity;
    return avail > 0 && avail <= 5;
  }).length;
  const outOfStockCount = variants.filter((v) => v.quantity - v.reserved_quantity <= 0).length;

  const handleSaveVariant = useCallback(
    async (data: VariantFormData) => {
      if (isDemo) {
        if (editingVariant) {
          setDemoVariants((prev) =>
            prev.map((v) =>
              v.id === editingVariant.id
                ? {
                    ...v,
                    product_id: data.product_id,
                    product_name: MOCK_PRODUCTS.find((p) => p.id === data.product_id)?.name || v.product_name,
                    sku: data.sku,
                    model: data.model,
                    color: data.color,
                    storage: data.storage,
                    quantity: data.quantity,
                    notes: data.notes,
                  }
                : v
            )
          );
        } else {
          const product = MOCK_PRODUCTS.find((p) => p.id === data.product_id);
          setDemoVariants((prev) => [
            ...prev,
            {
              id: generateId(),
              product_id: data.product_id,
              product_name: product?.name || "",
              sku: data.sku,
              model: data.model,
              color: data.color,
              storage: data.storage,
              quantity: data.quantity,
              reserved_quantity: 0,
              notes: data.notes,
            },
          ]);
        }
        setEditingVariant(null);
        return;
      }

      if (editingVariant) {
        const result = await updateVariant(editingVariant.id, {
          product_id: data.product_id,
          sku: data.sku,
          model: data.model,
          color: data.color,
          storage: data.storage,
          quantity: data.quantity,
          notes: data.notes,
        });
        if (!result.error) refetchVariants();
      } else {
        const result = await insertVariant({
          product_id: data.product_id,
          sku: data.sku,
          model: data.model,
          color: data.color,
          storage: data.storage,
          quantity: data.quantity,
          reserved_quantity: 0,
          notes: data.notes,
        });
        if (!result.error) refetchVariants();
      }
      setEditingVariant(null);
    },
    [isDemo, editingVariant, insertVariant, updateVariant, refetchVariants]
  );

  const handleSaveMovement = useCallback(
    async (data: {
      movement_type: string;
      quantity: number;
      unit_cost: number;
      notes: string;
    }) => {
      if (!movementVariant) return;

      if (isDemo) {
        setDemoVariants((prev) =>
          prev.map((v) => {
            if (v.id !== movementVariant.id) return v;
            let newQty = v.quantity;
            switch (data.movement_type) {
              case "purchase":
              case "return":
              case "adjustment":
                newQty = v.quantity + data.quantity;
                break;
              case "sale":
              case "damaged":
                newQty = Math.max(0, v.quantity - data.quantity);
                break;
            }
            return { ...v, quantity: newQty };
          })
        );
        setMovementVariant(null);
        return;
      }

      let newQty = movementVariant.quantity;
      switch (data.movement_type) {
        case "purchase":
        case "return":
        case "adjustment":
          newQty = movementVariant.quantity + data.quantity;
          break;
        case "sale":
        case "damaged":
          newQty = Math.max(0, movementVariant.quantity - data.quantity);
          break;
      }
      const result = await updateVariant(movementVariant.id, { quantity: newQty });
      if (!result.error) refetchVariants();
      setMovementVariant(null);
    },
    [isDemo, movementVariant, updateVariant, refetchVariants]
  );

  const handleDelete = useCallback(
    async (variant: InventoryVariant) => {
      if (!confirm(t.inventory.deleteConfirm.replace("{sku}", variant.sku))) return;

      if (isDemo) {
        setDemoVariants((prev) => prev.filter((v) => v.id !== variant.id));
        return;
      }

      const result = await deleteVariant(variant.id);
      if (!result.error) refetchVariants();
    },
    [isDemo, t.inventory.deleteConfirm, deleteVariant, refetchVariants]
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Warehouse className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.inventory.title}</h1>
            <p className="text-muted-foreground">{t.inventory.description}</p>
          </div>
        </div>
        <Button onClick={() => { setEditingVariant(null); setVariantFormOpen(true); }}>
          <Plus className="ml-2 h-4 w-4" />
          {t.inventory.addVariant}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t.inventory.totalQuantity}</p>
                <p className="text-xl font-bold">{totalQuantity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t.inventory.available}</p>
                <p className="text-xl font-bold">{totalAvailable}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t.inventory.lowStock}</p>
                <p className="text-xl font-bold">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t.inventory.outOfStock}</p>
                <p className="text-xl font-bold">{outOfStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <InventoryTable
            variants={variants}
            products={products}
            onEdit={(v) => { setEditingVariant(v); setVariantFormOpen(true); }}
            onLogMovement={(v) => { setMovementVariant(v); setMovementDialogOpen(true); }}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <VariantForm
        open={variantFormOpen}
        onOpenChange={setVariantFormOpen}
        onSave={handleSaveVariant}
        products={products}
        initialData={editingVariant || undefined}
      />

      {movementVariant && (
        <StockMovementDialog
          open={movementDialogOpen}
          onOpenChange={setMovementDialogOpen}
          onSave={handleSaveMovement}
          variantSku={movementVariant.sku}
          variantName={movementVariant.product_name}
          currentQuantity={movementVariant.quantity}
        />
      )}
    </div>
  );
}
