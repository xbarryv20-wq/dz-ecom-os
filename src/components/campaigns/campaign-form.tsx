"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campaignSchema, type CampaignInput } from "@/lib/validators";
import { CAMPAIGN_PLATFORMS, CAMPAIGN_STATUSES } from "@/lib/constants";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Campaign } from "@/types/database";
import { useI18n } from "@/lib/i18n/context";

const MOCK_PRODUCTS = [
  { id: "1", name: "سماعات لاسلكية بلوتوث" },
  { id: "2", name: "حافظة هاتف مغناطيسية" },
  { id: "3", name: "مجموعة فرش مكياج احترافية" },
  { id: "4", name: "ساعة ذكية رياضية" },
  { id: "5", name: "وسادة دعم الرقبة" },
];

interface CampaignFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CampaignInput) => void;
  initialData?: Campaign | null;
  isEditing?: boolean;
}

export function CampaignForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: CampaignFormProps) {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CampaignInput>({
    resolver: zodResolver(campaignSchema) as Resolver<CampaignInput>,
    defaultValues: {
      name: initialData?.name ?? "",
      platform: initialData?.platform ?? "",
      productId: initialData?.product_id ?? "",
      angleUsed: initialData?.angle_used ?? "",
      hookUsed: initialData?.hook_used ?? "",
      launchDate: initialData?.launch_date ?? "",
      spend: initialData?.spend ?? 0,
      messages: initialData?.messages ?? 0,
      confirmedOrders: initialData?.confirmed_orders ?? 0,
      deliveredOrders: initialData?.delivered_orders ?? 0,
      cancellations: initialData?.cancellations ?? 0,
      notes: initialData?.notes ?? "",
      status: initialData?.status ?? "draft",
    },
  });

  const platformValue = watch("platform");
  const statusValue = watch("status");
  const productIdValue = watch("productId");

  function handleFormSubmit(data: CampaignInput) {
    onSubmit(data);
    reset();
    onOpenChange(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[580px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t.common.edit : t.campaigns.addCampaign}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t.campaigns.description
              : t.campaigns.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t.campaigns.name}</Label>
            <Input
              id="name"
              placeholder={t.campaigns.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform">{t.campaigns.platform}</Label>
              <Select
                value={platformValue}
                onValueChange={(val) => setValue("platform", val)}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder={t.campaigns.platform} />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_PLATFORMS.map((p) => (
                    <SelectItem key={p.key} value={p.key}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.platform && (
                <p className="text-sm text-destructive">
                  {errors.platform.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="productId">{t.campaigns.product}</Label>
              <Select
                value={productIdValue}
                onValueChange={(val) => setValue("productId", val)}
              >
                <SelectTrigger id="productId">
                  <SelectValue placeholder={t.campaigns.product} />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PRODUCTS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.productId && (
                <p className="text-sm text-destructive">
                  {errors.productId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="launchDate">{t.campaigns.launchDate}</Label>
              <Input
                id="launchDate"
                type="date"
                {...register("launchDate")}
              />
              {errors.launchDate && (
                <p className="text-sm text-destructive">
                  {errors.launchDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t.common.status}</Label>
              <Select
                value={statusValue}
                onValueChange={(val) => setValue("status", val)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder={t.common.status} />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_STATUSES.map((s) => (
                    <SelectItem key={s.key} value={s.key}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="angleUsed">{t.campaigns.angleUsed}</Label>
            <Textarea
              id="angleUsed"
              placeholder={t.campaigns.angleUsed}
              className="min-h-[60px]"
              {...register("angleUsed")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hookUsed">{t.campaigns.hookUsed}</Label>
            <Textarea
              id="hookUsed"
              placeholder={t.campaigns.hookUsed}
              className="min-h-[60px]"
              {...register("hookUsed")}
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-3">{t.campaigns.totalCampaigns}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spend">{t.campaigns.spend} (د.ج)</Label>
                <Input
                  id="spend"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("spend")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="messages">{t.campaigns.messages}</Label>
                <Input
                  id="messages"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("messages")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmedOrders">{t.campaigns.confirmedOrders}</Label>
                <Input
                  id="confirmedOrders"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("confirmedOrders")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveredOrders">{t.campaigns.deliveredOrders}</Label>
                <Input
                  id="deliveredOrders"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("deliveredOrders")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cancellations">{t.campaigns.cancellations}</Label>
                <Input
                  id="cancellations"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register("cancellations")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t.common.notes}</Label>
            <Textarea
              id="notes"
              placeholder={t.common.notes}
              className="min-h-[60px]"
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? t.common.save : t.campaigns.addCampaign}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
