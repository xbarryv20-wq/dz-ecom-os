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
import { INVENTORY_MOVEMENT_TYPES } from "@/lib/constants";
import { Package } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface StockMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    movement_type: string;
    quantity: number;
    unit_cost: number;
    notes: string;
  }) => void;
  variantSku: string;
  variantName: string;
  currentQuantity: number;
}

export function StockMovementDialog({
  open,
  onOpenChange,
  onSave,
  variantSku,
  variantName,
  currentQuantity,
}: StockMovementDialogProps) {
  const { t } = useI18n();
  const [movementType, setMovementType] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!movementType) errs.movementType = t.inventory.movementType + " " + t.common.status;
    if (quantity <= 0) errs.quantity = t.products.quantity + " " + t.common.status;
    if (unitCost < 0) errs.unitCost = t.inventory.unitCost + " " + t.common.status;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      movement_type: movementType,
      quantity,
      unit_cost: unitCost,
      notes: notes.trim(),
    });
    onOpenChange(false);
    setMovementType("");
    setQuantity(1);
    setUnitCost(0);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{t.inventory.logMovement}</DialogTitle>
          <DialogDescription>
            {variantName} ({variantSku}) — {t.products.quantity}: {currentQuantity}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t.inventory.movementType} *</Label>
            <Select value={movementType} onValueChange={setMovementType}>
              <SelectTrigger>
                <SelectValue placeholder={t.inventory.movementType} />
              </SelectTrigger>
              <SelectContent>
                {INVENTORY_MOVEMENT_TYPES.map((t) => (
                  <SelectItem key={t.key} value={t.key}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.movementType && (
              <p className="text-xs text-destructive">{errors.movementType}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.products.quantity} *</Label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">{errors.quantity}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t.inventory.unitCost} (دج)</Label>
              <Input
                type="number"
                min={0}
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
              />
              {errors.unitCost && (
                <p className="text-xs text-destructive">{errors.unitCost}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.common.notes}</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.inventory.description}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit">
              <Package className="ml-2 h-4 w-4" />
              {t.inventory.logMovement}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
