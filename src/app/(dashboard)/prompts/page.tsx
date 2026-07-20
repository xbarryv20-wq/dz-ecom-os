"use client";

import { useState, useMemo, useCallback } from "react";
import { Sparkles, Plus, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptCard } from "@/components/prompts/prompt-card";
import { PromptForm } from "@/components/prompts/prompt-form";
import { PromptDetailDialog } from "@/components/prompts/prompt-detail-dialog";
import { PromptCategoryFilter } from "@/components/prompts/prompt-category-filter";
import { generateId } from "@/lib/utils";
import type { Prompt } from "@/types/database";
import type { PromptInput } from "@/lib/validators";
import { useI18n } from "@/lib/i18n/context";
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";
import { mapDbPromptToPrompt } from "@/lib/supabase/mappers";

type SortMode = "newest" | "most_used" | "favorites";

const MOCK_PROMPTS: Prompt[] = [
  {
    id: "1",
    created_at: "2026-07-18T10:00:00Z",
    updated_at: "2026-07-18T10:00:00Z",
    user_id: "user-1",
    title: "تحليل منافس من تيك توك",
    content: `analyze this TikTok product video and tell me:
1. What is the product?
2. What pain point does it solve?
3. What is the hook used in the first 3 seconds?
4. What is the editing style?
5. What is the estimated engagement?
6. Would this product work in the Algerian market? Why or why not?
7. Suggest 3 angles to sell this product in Algeria.

Video transcript:
[PASTE TRANSCRIPT HERE]`,
    category: "analysis",
    is_favorite: true,
    usage_count: 23,
  },
  {
    id: "2",
    created_at: "2026-07-17T14:30:00Z",
    updated_at: "2026-07-17T14:30:00Z",
    user_id: "user-1",
    title: "كتابة إعلان فيسبوك — صيغة AIDA",
    content: `اكتب إعلان فيسبوك لمنتج [اسم المنتج] يستخدم صيغة AIDA:
- الانتباه (Attention): افتح بسؤال أو إحالة على معضلة شائعة في الجزائر
- الاهتمام (Interest): قدّم معلومة أو إحصائية تثير الفضول
- الرغبة (Desire): اشرح الفائدة الرئيسية بلغة بسيطة وواضحة
- الإجراء (Action): اختم بدعوة واضحة للعمل (CTA)

المنتج: [اسم المنتج]
الفئة المستهدفة: [الفئة]
الميزة الرئيسية: [الميزة]

التعليمات:
- استخدم عامية جزائرية (دارجة)
- لا تزيد عن 125 كلمة
- أضف إيموجي مناسبة
- اختم برابط الطلب`,
    category: "ad_copy",
    is_favorite: true,
    usage_count: 45,
  },
  {
    id: "3",
    created_at: "2026-07-16T09:15:00Z",
    updated_at: "2026-07-16T09:15:00Z",
    user_id: "user-1",
    title: "سكريبت فيديو تيك توك — 30 ثانية",
    content: `اكتب سكريبت فيديو تيك توك مدته 30 ثانية لمنتج [اسم المنتج].

الهيكل:
- ثانية 0-3: Hook — جملة صادمة أو سؤال يوقف السكرول
- ثانية 3-8: المشكلة — وصف المعضلة بسرعة
- ثانية 8-18: العرض — عرض المنتج والحل
- ثانية 18-25: النتيجة — ماذا يتوقع العميل
- ثانية 25-30: CTA — دعوة للطلب

التعليمات:
- اللغة: عامية جزائرية
- النبرة: ودية وطبيعية
- أضف اقتراحات حركات الكاميرا
- اذكر التكلفة إذا كانت منخفضة`,
    category: "script",
    is_favorite: false,
    usage_count: 18,
  },
  {
    id: "4",
    created_at: "2026-07-15T16:45:00Z",
    updated_at: "2026-07-15T16:45:00Z",
    user_id: "user-1",
    title: "بحث سريع عن منتج — فلتر أمازون",
    content: `I'm looking for a winning product to sell in Algeria. Here's my criteria:

- Available on Amazon/AliExpress
- Price: $10-$40 (wholesale)
- Weight: under 500g (low shipping)
- Not easily found in Algerian stores
- Has "wow factor" for social media ads
- solves a real problem

Search this Amazon page and suggest 3 products that match:
[LINK HERE]

For each product, provide:
1. Product name
2. Wholesale price estimate
3. Suggested retail price in DZD
4. Why it could work in Algeria
5. Target audience
6. One-line ad hook`,
    category: "product_research",
    is_favorite: false,
    usage_count: 31,
  },
  {
    id: "5",
    created_at: "2026-07-14T11:00:00Z",
    updated_at: "2026-07-14T11:00:00Z",
    user_id: "user-1",
    title: "رد على عميل مستاء — خدمة العملاء",
    content: `اكتب رد احترافي على عميل جزائري مستاء من تأخير في التوصيل.

الوضع:
- العميل طلب المنتج قبل [عدد] أيام
- التوصيل تأخر عن الموعد المحدد
- العميل يهدد بالتقييم السلبي

المطلوب:
- اعترف بالمشكلة بوضوح
- اشرح السبب بإيجاز
- قدّم حلاً (إعادة توصيل / خصم / هدية)
- اختم بعتذر صادق

التعليمات:
- استخدم عامية جزائرية محترمة
- لا تكن روبوت — كن إنساناً
- لا تعد بأمور لا تستطيع الوفاء بها`,
    category: "customer_service",
    is_favorite: true,
    usage_count: 12,
  },
];

export default function PromptsPage() {
  const { t } = useI18n();
  const isDemo = !isSupabaseConfigured();

  const { data: dbPrompts, isLoading, refetch: refetchPrompts } =
    useSupabaseQuery<Prompt>({
      table: "prompts",
      orderBy: { column: "created_at", ascending: false },
      enabled: !isDemo,
    });

  const { insert: insertPrompt } = useSupabaseInsert<Prompt>("prompts");
  const { update: updatePrompt } = useSupabaseUpdate<Prompt>("prompts");
  const { remove: deletePrompt } = useSupabaseDelete("prompts");

  const [demoPrompts, setDemoPrompts] = useState<Prompt[]>(MOCK_PROMPTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  const [formOpen, setFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);

  const allPrompts = isDemo
    ? demoPrompts
    : dbPrompts && dbPrompts.length > 0
      ? dbPrompts
      : demoPrompts;

  const filteredPrompts = useMemo(() => {
    const result = allPrompts.filter((p) => {
      const matchCategory =
        filterCategory === "all" || p.category === filterCategory;
      const matchSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    switch (sortMode) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
        break;
      case "most_used":
        result.sort((a, b) => b.usage_count - a.usage_count);
        break;
      case "favorites":
        result.sort((a, b) => {
          if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        });
        break;
    }

    return result;
  }, [allPrompts, filterCategory, searchQuery, sortMode]);

  const handleAddPrompt = useCallback(
    async (data: PromptInput) => {
      if (isDemo) {
        const newPrompt: Prompt = {
          id: generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: "user-1",
          title: data.title,
          content: data.content,
          category: data.category,
          is_favorite: data.isFavorite ?? false,
          usage_count: 0,
        };
        setDemoPrompts((prev) => [newPrompt, ...prev]);
        return;
      }

      const result = await insertPrompt({
        title: data.title,
        content: data.content,
        category: data.category,
        is_favorite: data.isFavorite ?? false,
        usage_count: 0,
      });
      if (!result.error) refetchPrompts();
    },
    [isDemo, insertPrompt, refetchPrompts]
  );

  const handleEditPrompt = useCallback(
    async (data: PromptInput) => {
      if (!editingPrompt) return;

      if (isDemo) {
        setDemoPrompts((prev) =>
          prev.map((p) =>
            p.id === editingPrompt.id
              ? {
                  ...p,
                  title: data.title,
                  content: data.content,
                  category: data.category,
                  is_favorite: data.isFavorite ?? p.is_favorite,
                  updated_at: new Date().toISOString(),
                }
              : p
          )
        );
        setEditingPrompt(null);
        return;
      }

      const result = await updatePrompt(editingPrompt.id, {
        title: data.title,
        content: data.content,
        category: data.category,
        is_favorite: data.isFavorite ?? editingPrompt.is_favorite,
      });
      if (!result.error) refetchPrompts();
      setEditingPrompt(null);
    },
    [isDemo, editingPrompt, updatePrompt, refetchPrompts]
  );

  const handleDeletePrompt = useCallback(
    async (prompt: Prompt) => {
      if (!confirm(t.prompts.deleteConfirm)) return;

      if (isDemo) {
        setDemoPrompts((prev) => prev.filter((p) => p.id !== prompt.id));
        return;
      }

      const result = await deletePrompt(prompt.id);
      if (!result.error) refetchPrompts();
    },
    [isDemo, t.prompts.deleteConfirm, deletePrompt, refetchPrompts]
  );

  const handleToggleFavorite = useCallback(
    async (prompt: Prompt) => {
      if (isDemo) {
        setDemoPrompts((prev) =>
          prev.map((p) =>
            p.id === prompt.id ? { ...p, is_favorite: !p.is_favorite } : p
          )
        );
        return;
      }

      const result = await updatePrompt(prompt.id, {
        is_favorite: !prompt.is_favorite,
      });
      if (!result.error) refetchPrompts();
    },
    [isDemo, updatePrompt, refetchPrompts]
  );

  const handleCopy = useCallback(
    (prompt: Prompt) => {
      navigator.clipboard.writeText(prompt.content);

      if (isDemo) {
        setDemoPrompts((prev) =>
          prev.map((p) =>
            p.id === prompt.id ? { ...p, usage_count: p.usage_count + 1 } : p
          )
        );
        return;
      }

      updatePrompt(prompt.id, { usage_count: prompt.usage_count + 1 });
    },
    [isDemo, updatePrompt]
  );

  const handleArchive = useCallback(
    async (prompt: Prompt) => {
      if (isDemo) {
        setDemoPrompts((prev) => prev.filter((p) => p.id !== prompt.id));
        return;
      }

      const result = await deletePrompt(prompt.id);
      if (!result.error) refetchPrompts();
    },
    [isDemo, deletePrompt, refetchPrompts]
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t.prompts.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t.prompts.description}
            </p>
          </div>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 ml-1" />
          {t.prompts.addPrompt}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.prompts.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="newest">{t.prompts.newest}</option>
              <option value="most_used">{t.prompts.mostUsed}</option>
              <option value="favorites">{t.prompts.favoritesFirst}</option>
            </select>
          </div>
        </div>

        <PromptCategoryFilter
          value={filterCategory}
          onChange={setFilterCategory}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t.prompts.emptyTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {allPrompts.length === 0
              ? t.prompts.emptyDesc
              : t.prompts.emptyDescFiltered}
          </p>
          {allPrompts.length === 0 && (
            <Button className="mt-4" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 ml-1" />
              {t.prompts.addFirstPrompt}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={(p) => setEditingPrompt(p)}
              onDelete={handleDeletePrompt}
              onCopy={handleCopy}
              onToggleFavorite={handleToggleFavorite}
              onArchive={handleArchive}
              onClick={(p) => setViewingPrompt(p)}
            />
          ))}
        </div>
      )}

      <PromptForm
        open={formOpen || editingPrompt !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
            setEditingPrompt(null);
          }
        }}
        onSubmit={editingPrompt ? handleEditPrompt : handleAddPrompt}
        initialData={
          editingPrompt
            ? {
                title: editingPrompt.title,
                content: editingPrompt.content,
                category: editingPrompt.category,
                isFavorite: editingPrompt.is_favorite,
              }
            : undefined
        }
        isEditing={editingPrompt !== null}
      />

      <PromptDetailDialog
        open={detailOpen || viewingPrompt !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDetailOpen(false);
            setViewingPrompt(null);
          }
        }}
        prompt={viewingPrompt}
        onEdit={(p) => {
          setViewingPrompt(null);
          setDetailOpen(false);
          setEditingPrompt(p);
        }}
        onCopy={handleCopy}
      />
    </div>
  );
}
