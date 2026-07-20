"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Megaphone,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { CampaignDetailDialog } from "@/components/campaigns/campaign-detail-dialog";
import { formatCurrency } from "@/lib/utils";
import {
  CAMPAIGN_PLATFORMS,
  CAMPAIGN_STATUSES,
} from "@/lib/constants";
import type { Campaign } from "@/types/database";
import type { CampaignInput } from "@/lib/validators";
import { useI18n } from "@/lib/i18n/context";
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  getCurrentUserId,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    created_at: "2026-07-10T08:00:00Z",
    updated_at: "2026-07-18T14:30:00Z",
    user_id: "user-1",
    name: "\u062d\u0645\u0644\u0629 \u0627\u0644\u0635\u064a\u0641 - \u0633\u0645\u0627\u0639\u0627\u062a \u0628\u0644\u0648\u062a\u0648\u062b \u0644\u0627\u0633\u0644\u0643\u064a\u0629",
    platform: "facebook",
    product_id: "1",
    angle_used: "\u0627\u0644\u062a\u0631\u0643\u064a\u0632 \u0639\u0644\u0649 \u0645\u0634\u0643\u0644\u0629 \u0627\u0644\u0623\u0633\u0644\u0627\u0643 \u0627\u0644\u0645\u062a\u062f\u0627\u062e\u0644\u0629 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062a\u0645\u0627\u0631\u064a\u0646 \u0627\u0644\u0631\u064a\u0627\u0636\u064a\u0629 \u0641\u064a \u0627\u0644\u0635\u064a\u0641. \u0627\u0644\u0639\u0631\u0636: \u0633\u0645\u0627\u0639\u0627\u062a \u0645\u0642\u0627\u0648\u0645\u0629 \u0644\u0644\u0645\u0627\u0621 \u0628\u0633\u0639\u0631 \u062d\u0635\u0631\u064a \u0644\u0641\u062a\u0631\u0629 \u0645\u062d\u062f\u0648\u062f\u0629.",
    hook_used: "\u062a\u062a\u0639\u0628 \u0645\u0646 \u0627\u0644\u0623\u0633\u0644\u0627\u0643\u061f \u062c\u0631\u0651\u0628 \u0647\u0627\u062f \u0627\u0644\u0644\u0627\u0633\u0644\u0643\u064a \u0648 \u063a\u064a\u0651\u0631 \u062a\u062c\u0631\u0628\u062a\u0643!",
    launch_date: "2026-07-10",
    spend: 8500,
    messages: 342,
    confirmed_orders: 67,
    delivered_orders: 52,
    cancellations: 15,
    notes: "\u0623\u0641\u0636\u0644 \u0623\u062f\u0627\u0621 \u0645\u0646 \u0627\u0644\u0645\u062a\u0648\u0642\u0639. \u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u062d\u0648\u064a\u0644 \u0645\u0645\u062a\u0627\u0632 \u0639\u0644\u0649 \u0641\u064a\u0633\u0628\u0648\u0643.",
    status: "active",
  },
  {
    id: "2",
    created_at: "2026-07-12T10:00:00Z",
    updated_at: "2026-07-17T09:00:00Z",
    user_id: "user-1",
    name: "\u062d\u0645\u0644\u0629 \u062a\u064a\u0643 \u062a\u0648\u0643 - \u062d\u0627\u0641\u0638\u0629 \u0647\u0627\u062a\u0641 \u0645\u063a\u0646\u0627\u0637\u064a\u0633\u064a\u0629",
    platform: "tiktok",
    product_id: "2",
    angle_used: "\u062a\u0639\u0631\u0636 \u0627\u0644\u0641\u064a\u062f\u064a\u0648 \u064a\u0638\u0647\u0631 \u0642\u0648\u0629 \u0627\u0644\u0645\u063a\u0646\u0627\u0637\u064a\u0633 \u0645\u0639 \u0625\u0633\u0642\u0627\u0637 \u0627\u0644\u0647\u0627\u062a\u0641 several \u0645\u0631\u0627\u062a. \u0627\u0644\u0631\u0633\u0627\u0644\u0629: \u062d\u0645\u0627\u064a\u0629 \u0647\u0627\u062a\u0641\u0643 \u0628\u062a\u0635\u0645\u064a\u0645 \u0623\u0646\u064a\u0642.",
    hook_used: "\u0647\u0644 \u062a\u0639\u0631\u0641\u0648 \u0634\u062d\u0627\u0644 \u0642\u0648\u064a \u0647\u0627\u062f \u0627\u0644\u062d\u0627\u0641\u0638\u0629\u061f \u0634\u0648\u0641\u0648!",
    launch_date: "2026-07-12",
    spend: 5200,
    messages: 189,
    confirmed_orders: 31,
    delivered_orders: 28,
    cancellations: 3,
    notes: "\u0645\u0639\u062f\u0644 \u0627\u0644\u0625\u0644\u063a\u0627\u0621 \u0645\u0646\u062e\u0641\u0636 \u062c\u062f\u0627\u064b. \u0627\u0644\u0645\u062d\u062a\u0648\u0649 \u0627\u0644\u062a\u064a\u0643 \u062a\u0648\u0643 \u0641\u0639\u0651\u0627\u0644.",
    status: "active",
  },
  {
    id: "3",
    created_at: "2026-07-05T14:00:00Z",
    updated_at: "2026-07-15T18:00:00Z",
    user_id: "user-1",
    name: "\u062d\u0645\u0644\u0629 \u0625\u0646\u0633\u062a\u063a\u0631\u0627\u0645 - \u0641\u0631\u0634 \u0645\u0643\u064a\u0627\u062c \u0627\u062d\u062a\u0631\u0627\u0641\u064a\u0629",
    platform: "instagram",
    product_id: "3",
    angle_used: "\u0627\u0644\u062a\u0631\u0643\u064a\u0632 \u0639\u0644\u0649 \u062a\u062d\u0648\u0644 \u0627\u0644\u0645\u0643\u064a\u0627\u062c \u0645\u0646 \u0627\u0644\u0635\u0641\u0631 \u0625\u0644\u0649 \u0627\u0644\u0627\u062d\u062a\u0631\u0627\u0641\u064a. \u0627\u0633\u062a\u0646\u062f\u062a \u0639\u0644\u0649 \u0642\u0635\u0635 \u0639\u0645\u0644\u0627\u0621 \u0633\u0627\u0628\u0642\u064a\u0646 \u0631\u0627\u0636\u064a\u0646.",
    hook_used: "\u0628\u062f\u0651\u064a \u063a\u064a\u0631 \u0634\u0643\u0644\u0643 \u0641\u064a 5 \u062f\u0642\u0627\u064a\u0642\u061f \u0647\u0627\u062f \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0629 \u063a\u062f\u064a \u062a\u062a\u0628\u062f\u0651\u0644\u0643!",
    launch_date: "2026-07-05",
    spend: 12000,
    messages: 567,
    confirmed_orders: 89,
    delivered_orders: 78,
    cancellations: 11,
    notes: "\u062d\u0645\u0644\u0629 \u0646\u0627\u062c\u062d\u0629 \u062c\u062f\u0627\u064b. \u0627\u0644\u0623\u0641\u0636\u0644 \u0623\u062f\u0627\u0621\u064b \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631.",
    status: "completed",
  },
  {
    id: "4",
    created_at: "2026-07-18T09:00:00Z",
    updated_at: "2026-07-18T09:00:00Z",
    user_id: "user-1",
    name: "\u062d\u0645\u0644\u0629 \u0642\u0648\u0642\u0644 - \u0633\u0627\u0639\u0629 \u0630\u0643\u064a\u0629 \u0631\u064a\u0627\u0636\u064a\u0629",
    platform: "google",
    product_id: "4",
    angle_used: "\u0627\u0644\u0627\u0633\u062a\u0647\u062f\u0627\u0641 \u0628\u0627\u0644\u0643\u0644\u0645\u0627\u062a \u0627\u0644\u0645\u0641\u062a\u0627\u062d\u064a\u0629: \u0633\u0627\u0639\u0629 \u0630\u0643\u064a\u0629 \u0627\u0644\u062c\u0632\u0627\u0626\u0631\u060c \u0633\u0627\u0639\u0629 \u0631\u064a\u0627\u0636\u064a\u0629 \u0645\u0642\u0627\u0648\u0645\u0629 \u0644\u0644\u0645\u0627\u0621.",
    hook_used: "",
    launch_date: "2026-07-18",
    spend: 3000,
    messages: 45,
    confirmed_orders: 0,
    delivered_orders: 0,
    cancellations: 0,
    notes: "\u062d\u0645\u0644\u0629 \u062c\u062f\u064a\u062f\u0629. \u0644\u0645 \u062a\u062d\u0642\u0642 \u0646\u062a\u0627\u0626\u062c \u0643\u0641\u0627\u0621\u0629 \u0628\u0639\u062f.",
    status: "paused",
  },
  {
    id: "5",
    created_at: "2026-06-28T11:00:00Z",
    updated_at: "2026-07-10T16:00:00Z",
    user_id: "user-1",
    name: "\u062d\u0645\u0644\u0629 \u0648\u0627\u062a\u0633\u0627\u0628 - \u0648\u0633\u0627\u0621\u0629 \u062f\u0639\u0645 \u0627\u0644\u0631\u0642\u0628\u0629",
    platform: "whatsapp",
    product_id: "5",
    angle_used: "\u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0645\u0628\u0627\u0634\u0631 \u0645\u0639 \u0627\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0633\u0627\u0628\u0642\u064a\u0646 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628. \u0639\u0631\u0636 \u062e\u0627\u0635 \u0644\u0644\u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0642\u062f\u0627\u0645\u0649.",
    hook_used: "\ud83d\udc4b \u0646\u0633\u064a\u062a\u0643\u0645! \u0639\u0631\u0636 \u062e\u0627\u0635 \u0644\u064a\u0648\u0645\u064a\u0646 \u0641\u0642\u0637 \u0639\u0644\u0649 \u0648\u0633\u0627\u0621 \u0627\u0644\u0631\u0642\u0628\u0629",
    launch_date: "2026-06-28",
    spend: 1500,
    messages: 78,
    confirmed_orders: 12,
    delivered_orders: 10,
    cancellations: 2,
    notes: "\u062d\u0645\u0644\u0629 \u0645\u063a\u0644\u0642\u0629. \u0623\u062f\u0627\u0621 \u062c\u064a\u062f \u0645\u0642\u0627\u0631\u0646\u0629 \u0628\u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629.",
    status: "cancelled",
  },
];

const SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "spend", label: "Spend" },
  { value: "orders", label: "Orders" },
];

export default function CampaignsPage() {
  const { t } = useI18n();

  const isDemo = !isSupabaseConfigured();

  const {
    data: dbCampaigns,
    isLoading,
    refetch,
  } = useSupabaseQuery<Campaign>({
    table: "campaigns",
    orderBy: { column: "launch_date", ascending: false },
    enabled: !isDemo,
  });

  const campaigns = isDemo ? MOCK_CAMPAIGNS : dbCampaigns;

  const { insert } = useSupabaseInsert<Campaign>("campaigns");
  const { update } = useSupabaseUpdate<Campaign>("campaigns");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);

  const filteredCampaigns = useMemo(() => {
    const result = campaigns.filter((c) => {
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      const matchPlatform =
        filterPlatform === "all" || c.platform === filterPlatform;
      const matchSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchPlatform && matchSearch;
    });

    result.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.launch_date).getTime() -
          new Date(a.launch_date).getTime()
        );
      }
      if (sortBy === "spend") return b.spend - a.spend;
      if (sortBy === "orders")
        return b.confirmed_orders - a.confirmed_orders;
      return 0;
    });

    return result;
  }, [campaigns, filterStatus, filterPlatform, searchQuery, sortBy]);

  const summaryStats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === "active").length;
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalMessages = campaigns.reduce((sum, c) => sum + c.messages, 0);
    const totalClicks = campaigns.reduce(
      (sum, c) => sum + c.confirmed_orders,
      0
    );
    const avgCtr =
      totalMessages > 0
        ? ((totalClicks / totalMessages) * 100).toFixed(1)
        : "0.0";

    return { total, active, totalSpend, avgCtr };
  }, [campaigns]);

  const handleAddCampaign = useCallback(async (data: CampaignInput) => {
    if (isDemo) {
      setFormOpen(false);
      return;
    }

    const userId = await getCurrentUserId();
    if (!userId) return;

    const { error } = await insert({
      user_id: userId,
      name: data.name,
      platform: data.platform,
      product_id: data.productId,
      angle_used: data.angleUsed,
      hook_used: data.hookUsed,
      launch_date: data.launchDate,
      spend: data.spend ?? 0,
      messages: data.messages ?? 0,
      confirmed_orders: data.confirmedOrders ?? 0,
      delivered_orders: data.deliveredOrders ?? 0,
      cancellations: data.cancellations ?? 0,
      notes: data.notes,
      status: data.status,
    });
    if (!error) {
      refetch();
    }
    setFormOpen(false);
  }, [isDemo, insert, refetch]);

  const handleEditCampaign = useCallback(
    async (data: CampaignInput) => {
      if (!editingCampaign) return;

      if (isDemo) {
        setEditingCampaign(null);
        return;
      }

      const { error } = await update(editingCampaign.id, {
        name: data.name,
        platform: data.platform,
        product_id: data.productId,
        angle_used: data.angleUsed,
        hook_used: data.hookUsed,
        launch_date: data.launchDate,
        spend: data.spend ?? 0,
        messages: data.messages ?? 0,
        confirmed_orders: data.confirmedOrders ?? 0,
        delivered_orders: data.deliveredOrders ?? 0,
        cancellations: data.cancellations ?? 0,
        notes: data.notes,
        status: data.status,
      });
      if (!error) {
        refetch();
      }
      setEditingCampaign(null);
    },
    [editingCampaign, isDemo, update, refetch]
  );

  const handlePauseResume = useCallback(async (campaign: Campaign) => {
    if (isDemo) {
      return;
    }

    const newStatus = campaign.status === "active" ? "paused" : "active";
    const { error } = await update(campaign.id, { status: newStatus });
    if (!error) {
      refetch();
    }
  }, [isDemo, update, refetch]);

  const handleViewDetails = useCallback((campaign: Campaign) => {
    setViewingCampaign(campaign);
    setDetailOpen(true);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.campaigns.title}</h1>
            <p className="text-sm text-muted-foreground">
              {t.campaigns.description}
            </p>
          </div>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 ml-1" />
          {t.campaigns.addCampaign}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t.campaigns.totalCampaigns}</span>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{summaryStats.total}</p>
        </div>
        <div className="rounded-xl border p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t.campaigns.active}</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {summaryStats.active}
          </p>
        </div>
        <div className="rounded-xl border p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t.campaigns.totalSpend}</span>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalSpend)}</p>
        </div>
        <div className="rounded-xl border p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t.campaigns.avgCTR}</span>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{summaryStats.avgCtr}%</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.campaigns.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full max-w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.campaigns.allStatuses}</SelectItem>
              {CAMPAIGN_STATUSES.map((cs) => (
                <SelectItem key={cs.key} value={cs.key}>
                  {t.campaigns.statuses[cs.key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-full max-w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.campaigns.allPlatforms}</SelectItem>
              {CAMPAIGN_PLATFORMS.map((cp) => (
                <SelectItem key={cp.key} value={cp.key}>
                  {t.campaigns.platforms[cp.key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full max-w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">{t.campaigns.sortBy}: {t.campaigns.sortOptions.date}</SelectItem>
              <SelectItem value="spend">{t.campaigns.sortBy}: {t.campaigns.sortOptions.spend}</SelectItem>
              <SelectItem value="orders">{t.campaigns.sortBy}: {t.campaigns.sortOptions.orders}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-6 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Megaphone className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t.campaigns.emptyTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {campaigns.length === 0
              ? t.campaigns.emptyDesc
              : t.campaigns.emptyDescFiltered}
          </p>
          {campaigns.length === 0 && (
            <Button className="mt-4" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 ml-1" />
              {t.campaigns.addFirstCampaign}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={(c) => {
                setEditingCampaign(c);
              }}
              onViewDetails={handleViewDetails}
              onPauseResume={handlePauseResume}
            />
          ))}
        </div>
      )}

      <CampaignForm
        open={formOpen || editingCampaign !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
            setEditingCampaign(null);
          }
        }}
        onSubmit={editingCampaign ? handleEditCampaign : handleAddCampaign}
        initialData={editingCampaign}
        isEditing={editingCampaign !== null}
      />

      <CampaignDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        campaign={viewingCampaign}
        onEdit={(c) => {
          setDetailOpen(false);
          setEditingCampaign(c);
        }}
      />
    </div>
  );
}
