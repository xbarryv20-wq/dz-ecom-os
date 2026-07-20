"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit,
  Trash2,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  Search,
  Package,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

export interface InventoryVariant {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  model: string;
  color: string;
  storage: string;
  quantity: number;
  reserved_quantity: number;
  notes: string;
}

interface InventoryTableProps {
  variants: InventoryVariant[];
  products: { id: string; name: string }[];
  onEdit: (variant: InventoryVariant) => void;
  onLogMovement: (variant: InventoryVariant) => void;
  onDelete: (variant: InventoryVariant) => void;
}

type SortKey = "sku" | "product_name" | "model" | "color" | "storage" | "quantity" | "reserved_quantity";

function getStockStatus(quantity: number, reserved: number, t: ReturnType<typeof useI18n>["t"]) {
  const available = quantity - reserved;
  if (available <= 0) return { label: t.products.outOfStock, color: "destructive" as const, icon: AlertTriangle };
  if (available <= 5) return { label: t.products.lowStock, color: "secondary" as const, icon: AlertTriangle };
  return { label: t.products.inStock, color: "default" as const, icon: CheckCircle };
}

function VariantCard({
  variant,
  onEdit,
  onLogMovement,
  onDelete,
}: {
  variant: InventoryVariant;
  onEdit: () => void;
  onLogMovement: () => void;
  onDelete: () => void;
}) {
  const { t } = useI18n();
  const available = variant.quantity - variant.reserved_quantity;
  const status = getStockStatus(variant.quantity, variant.reserved_quantity, t);

  return (
    <Card className="sm:hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium">{variant.product_name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{variant.sku}</p>
          </div>
          <Badge variant={status.color} className="text-xs">
            <status.icon className="ml-1 h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-muted-foreground">{t.inventory.model}: </span>
            <span>{variant.model || "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t.inventory.color}: </span>
            <span>{variant.color || "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t.inventory.storage}: </span>
            <span>{variant.storage || "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t.inventory.quantity}: </span>
            <span>{variant.quantity}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t.inventory.reserved}: </span>
            <span>{variant.reserved_quantity}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t.inventory.available}: </span>
            <span className={available <= 5 ? "text-yellow-600 font-medium" : ""}>{available}</span>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Edit className="ml-1 h-3 w-3" />
            {t.inventory.edit}
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={onLogMovement}>
            <Package className="ml-1 h-3 w-3" />
            {t.inventory.movement}
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function InventoryTable({
  variants,
  products,
  onEdit,
  onLogMovement,
  onDelete,
}: InventoryTableProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [filterProduct, setFilterProduct] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("sku");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (col: SortKey) => (
    <ArrowUpDown className={`ml-1 h-3 w-3 inline ${sortKey === col ? "text-primary" : "text-muted-foreground"}`} />
  );

  const filtered = useMemo(() => {
    let list = [...variants];
    if (filterProduct !== "all") {
      list = list.filter((v) => v.product_id === filterProduct);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.sku.toLowerCase().includes(q) ||
          v.product_name.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal), "ar")
        : String(bVal).localeCompare(String(aVal), "ar");
    });
    return list;
  }, [variants, search, filterProduct, sortKey, sortDir]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.inventory.description}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9"
          />
        </div>
        <Select value={filterProduct} onValueChange={setFilterProduct}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t.products.title} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all} {t.products.title}</SelectItem>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("sku")}>
                {renderSortIcon("sku")} {t.products.sku}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("product_name")}>
                {renderSortIcon("product_name")} {t.products.title}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("model")}>
                {renderSortIcon("model")} {t.products.model}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("color")}>
                {renderSortIcon("color")} {t.products.color}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("storage")}>
                {renderSortIcon("storage")} {t.products.storage}
              </TableHead>
              <TableHead className="cursor-pointer text-center" onClick={() => handleSort("quantity")}>
                {renderSortIcon("quantity")} {t.products.quantity}
              </TableHead>
              <TableHead className="cursor-pointer text-center" onClick={() => handleSort("reserved_quantity")}>
                {renderSortIcon("reserved_quantity")} {t.products.reserved}
              </TableHead>
              <TableHead className="text-center">{t.products.available}</TableHead>
              <TableHead>{t.common.status}</TableHead>
              <TableHead className="text-right">{t.common.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  {t.common.noData}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((variant) => {
                const available = variant.quantity - variant.reserved_quantity;
                const status = getStockStatus(variant.quantity, variant.reserved_quantity, t);
                return (
                  <TableRow key={variant.id}>
                    <TableCell className="font-mono text-xs">{variant.sku}</TableCell>
                    <TableCell className="font-medium">{variant.product_name}</TableCell>
                    <TableCell>{variant.model || "—"}</TableCell>
                    <TableCell>{variant.color || "—"}</TableCell>
                    <TableCell>{variant.storage || "—"}</TableCell>
                    <TableCell className="text-center">{variant.quantity}</TableCell>
                    <TableCell className="text-center">{variant.reserved_quantity}</TableCell>
                    <TableCell className={`text-center font-medium ${available <= 5 ? "text-yellow-600" : ""}`}>
                      {available}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.color} className="text-xs">
                        <status.icon className="ml-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(variant)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onLogMovement(variant)}>
                          <Package className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(variant)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 sm:hidden">
        {filtered.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">{t.common.noData}</p>
        ) : (
          filtered.map((variant) => (
            <VariantCard
              key={variant.id}
              variant={variant}
              onEdit={() => onEdit(variant)}
              onLogMovement={() => onLogMovement(variant)}
              onDelete={() => onDelete(variant)}
            />
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} / {variants.length} {t.inventory.totalQuantity}
      </p>
    </div>
  );
}
