"use client";

import { useState, useMemo, useCallback } from "react";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { KnowledgeSearch } from "@/components/knowledge/knowledge-search";
import { KnowledgeCard, type KnowledgeEntry } from "@/components/knowledge/knowledge-card";
import { KnowledgeForm } from "@/components/knowledge/knowledge-form";
import { generateId } from "@/lib/utils";
import type { KnowledgeInput } from "@/lib/validators";
import { useI18n } from "@/lib/i18n/context";
import {
  useSupabaseQuery,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";
import { mapDbKnowledgeToKnowledge } from "@/lib/supabase/mappers";
import type { KnowledgeEntry as DbKnowledgeEntry } from "@/types/database";

const MOCK_ENTRIES: KnowledgeEntry[] = [
  {
    id: "1",
    title: "استراتيجية التسعير في السوق الجزائري",
    content:
      "يعتمد المستهلك الجزائري بشكل كبير على مقارنة الأسعار قبل الشراء. يُنصح بعرض سعر خاص مقارنة بالسوق مع توضيح قيمة التوصيل. الأسعار الفردية (OD) تعطي نتائج أفضل من الدفع عند الاستلام في بعض المناطق. يُفضل تحديد هامش ربح واضح قبل الخصم وعرض السعر الأصلي بجانب السعر المخفض.",
    category: "strategy",
    niche: "beauty",
    tags: ["تسعير", "جزائر", "مبيعات"],
    is_pinned: true,
    created_at: "2026-07-10T08:00:00Z",
  },
  {
    id: "2",
    title: "قوانين التجارة الإلكترونية في الجزائر",
    content:
      "يجب الانتباه لقوانين الجمارك عند استيراد المنتجات. الحد الأقصى للشحنة بدون رسوم هو 50,000 دج. بعض الفئات تحتاج تصاريح خاصة من وزارة التجارة. يُنصح بالتعامل مع شركات شحن موثوقة لديها خبرة في التخليص الجمركي.",
    category: "operations",
    niche: "other",
    tags: ["قانون", "استيراد", "جمارك"],
    is_pinned: false,
    created_at: "2026-07-08T12:30:00Z",
  },
  {
    id: "3",
    title: "الإعلانات على فيسبوك للمسوقين الجزائريين",
    content:
      "منصة فيسبوك Ads هي الأكثر استخداماً للسوق الجزائري. يُنصح باستهداف الفئة العمرية 25-40 سنة. الإعلانات باللغة الدارجة تحقق تفاعل أعلى. متوسط تكلفة النقرة (CPC) يتراوح بين 5-15 دج. يُفضل اختبار 3-5 نسخ إعلانية في كل حملة.",
    category: "marketing",
    niche: "fashion",
    tags: ["إعلانات", "فيسبوك", "تسويق"],
    is_pinned: true,
    created_at: "2026-07-05T09:15:00Z",
  },
  {
    id: "4",
    title: "مورد موثوق للجمال والتجميل من الصين",
    content:
      "شركة Shenzhen Beauty Tech موردة موثوقة للمنتجات التجميلية. الحد الأدنى للطلب 100 قطعة. وقت التسليم 15-20 يوم. تقبل الدفع عبر Alibaba Trade Assurance. جودة المنتجات ممتازة مع شهادات CE و FDA. يمكن التفاوض على الأسعار للطلبات الكبيرة.",
    category: "supplier",
    niche: "beauty",
    tags: ["موردين", "صين", "تجميل"],
    is_pinned: false,
    created_at: "2026-07-02T14:45:00Z",
  },
];

export default function KnowledgePage() {
  const { t } = useI18n();
  const isDemo = !isSupabaseConfigured();

  const { data: dbEntries, isLoading, refetch: refetchEntries } =
    useSupabaseQuery<DbKnowledgeEntry>({
      table: "knowledge_entries",
      orderBy: { column: "created_at", ascending: false },
      enabled: !isDemo,
    });

  const { insert: insertEntry } = useSupabaseInsert<DbKnowledgeEntry>("knowledge_entries");
  const { update: updateEntry } = useSupabaseUpdate<DbKnowledgeEntry>("knowledge_entries");
  const { remove: deleteEntry } = useSupabaseDelete("knowledge_entries");

  const [demoEntries, setDemoEntries] = useState<KnowledgeEntry[]>(MOCK_ENTRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterNiche, setFilterNiche] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);

  const allEntries: KnowledgeEntry[] = isDemo
    ? demoEntries
    : dbEntries.map((e) => {
        const mapped = mapDbKnowledgeToKnowledge(e);
        return {
          id: mapped.id,
          title: mapped.title,
          content: mapped.content,
          category: mapped.category,
          niche: mapped.niche,
          tags: mapped.tags,
          is_pinned: e.is_pinned,
          created_at: e.created_at,
        };
      });

  const filteredEntries = useMemo(() => {
    const result = allEntries.filter((e) => {
      const matchCategory =
        filterCategory === "all" || e.category === filterCategory;
      const matchNiche = filterNiche === "all" || e.niche === filterNiche;
      const matchSearch =
        searchQuery === "" ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCategory && matchNiche && matchSearch;
    });

    return result.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [allEntries, filterCategory, filterNiche, searchQuery]);

  const handleClearFilters = useCallback(() => {
    setFilterCategory("all");
    setFilterNiche("all");
    setSearchQuery("");
  }, []);

  const handleAddEntry = useCallback(
    async (data: KnowledgeInput) => {
      if (isDemo) {
        const newEntry: KnowledgeEntry = {
          id: generateId(),
          created_at: new Date().toISOString(),
          title: data.title,
          content: data.content,
          category: data.category,
          niche: data.niche,
          tags: data.tags ?? [],
          is_pinned: false,
        };
        setDemoEntries((prev) => [newEntry, ...prev]);
        return;
      }

      const result = await insertEntry({
        title: data.title,
        content: data.content,
        category: data.category,
        niche: data.niche,
        tags: data.tags ?? [],
        is_pinned: false,
      });
      if (!result.error) refetchEntries();
    },
    [isDemo, insertEntry, refetchEntries]
  );

  const handleEditEntry = useCallback(
    async (data: KnowledgeInput) => {
      if (!editingEntry) return;

      if (isDemo) {
        setDemoEntries((prev) =>
          prev.map((e) =>
            e.id === editingEntry.id
              ? {
                  ...e,
                  title: data.title,
                  content: data.content,
                  category: data.category,
                  niche: data.niche,
                  tags: data.tags ?? [],
                }
              : e
          )
        );
        setEditingEntry(null);
        return;
      }

      const result = await updateEntry(editingEntry.id, {
        title: data.title,
        content: data.content,
        category: data.category,
        niche: data.niche,
        tags: data.tags ?? [],
      });
      if (!result.error) refetchEntries();
      setEditingEntry(null);
    },
    [isDemo, editingEntry, updateEntry, refetchEntries]
  );

  const handleDeleteEntry = useCallback(
    async (entry: KnowledgeEntry) => {
      if (!confirm(t.knowledge.deleteConfirm)) return;

      if (isDemo) {
        setDemoEntries((prev) => prev.filter((e) => e.id !== entry.id));
        return;
      }

      const result = await deleteEntry(entry.id);
      if (!result.error) refetchEntries();
    },
    [isDemo, t.knowledge.deleteConfirm, deleteEntry, refetchEntries]
  );

  const handleTogglePin = useCallback(
    async (entry: KnowledgeEntry) => {
      if (isDemo) {
        setDemoEntries((prev) =>
          prev.map((e) =>
            e.id === entry.id ? { ...e, is_pinned: !e.is_pinned } : e
          )
        );
        return;
      }

      const result = await updateEntry(entry.id, {
        is_pinned: !entry.is_pinned,
      });
      if (!result.error) refetchEntries();
    },
    [isDemo, updateEntry, refetchEntries]
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t.knowledge.title}</h1>
            <p className="text-sm text-muted-foreground">
              {t.knowledge.description}
            </p>
          </div>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 ml-1" />
          {t.knowledge.addEntry}
        </Button>
      </div>

      <KnowledgeSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterCategory={filterCategory}
        onCategoryChange={setFilterCategory}
        filterNiche={filterNiche}
        onNicheChange={setFilterNiche}
        onClear={handleClearFilters}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-6 space-y-3">
              <Skeleton className="h-5 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t.knowledge.emptyTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            {allEntries.length === 0
              ? t.knowledge.emptyDesc
              : t.knowledge.emptyDescFiltered}
          </p>
          {allEntries.length === 0 && (
            <Button className="mt-4" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 ml-1" />
              {t.knowledge.addFirstEntry}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredEntries.map((entry) => (
            <KnowledgeCard
              key={entry.id}
              entry={entry}
              onEdit={(e) => setEditingEntry(e)}
              onDelete={handleDeleteEntry}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}

      <KnowledgeForm
        open={formOpen || editingEntry !== null}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
            setEditingEntry(null);
          }
        }}
        onSubmit={editingEntry ? handleEditEntry : handleAddEntry}
        initialData={editingEntry ?? undefined}
        isEditing={editingEntry !== null}
      />
    </div>
  );
}
