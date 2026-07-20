"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Sparkles } from "lucide-react";
import { AngleGeneratorForm } from "@/components/angles/angle-generator-form";
import { AngleDisplay, type GeneratedAngles } from "@/components/angles/angle-display";
import { useI18n } from "@/lib/i18n/context";
import {
  useSupabaseQuery,
  useSupabaseInsert,
  isSupabaseConfigured,
} from "@/hooks/use-supabase";
import type { MarketingAngle as DbMarketingAngle } from "@/types/database";

const MOCK_PRODUCTS = [
  { id: "p1", name: "نظارة شمسية بريميوم", description: "نظارة شمسية عصرية بتصميم أنيق، مقاومة للخدش، عدسات ملونة حماية UV400", price: 3500 },
  { id: "p2", name: "سماعات لاسلكية برو", description: "سماعات بلوتوث 5.3، إلغاء الضوضاء، بطارية 40 ساعة، مقاومة للماء", price: 5900 },
  { id: "p3", name: "مكنسة روبوتية ذكية", description: "مكنسة روبوتية بتقنية LiDAR، خرائط ذكية، شحن ذاتي، تحكم بالتطبيق", price: 28000 },
  { id: "p4", name: "ساعة رياضية ذكية", description: "ساعة ذكية بشاشة AMOLED، قياس نبض القلب، GPS، بطارية 14 يوم", price: 8500 },
  { id: "p5", name: "حقيبة ظهر مقاومة للماء", description: "حقيبة ظهر من النايلون العالي الجودة، سحّاب مخفي، جيب لابتوب، مقاومة للماء IPX5", price: 4200 },
];

const MOCK_SIGNALS = [
  { id: "s1", source: "فيسبوك", text: "الناس تحوس على نظارات شمسية رخيصة بجودة عالية", type: "pain_point" },
  { id: "s2", source: "تيك توك", text: "تريند السماعات اللاسلكية كبر بزاف في الجزائر", type: "trend" },
  { id: "s3", source: "إنستغرام", text: "بزاف ناس يشكون من المكنسات الروبوتية الغالية", type: "pain_point" },
  { id: "s4", source: "manual", text: "منافس جديد دخل السوق بساعات رياضية بثمن منخفض", type: "competitor" },
  { id: "s5", source: "تويتر", text: "الطلب على حقائب الظهر المقاومة للماء تزاد", type: "trend" },
];

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  );
}

export default function AnglesPage() {
  const { t } = useI18n();
  const isDemo = !isSupabaseConfigured();

  const { data: dbProducts } = useSupabaseQuery<{ id: string; name: string; description: string; sell_price: number }>({
    table: "products",
    select: "id, name, description, sell_price",
    orderBy: { column: "name", ascending: true },
    enabled: !isDemo,
  });

  const { data: dbSignals } = useSupabaseQuery<{ id: string; source: string; raw_text: string; signal_type: string }>({
    table: "signals",
    select: "id, source, raw_text, signal_type",
    orderBy: { column: "created_at", ascending: false },
    enabled: !isDemo,
  });

  const { insert: insertAngle } = useSupabaseInsert<DbMarketingAngle>("marketing_angles");

  const products = isDemo
    ? MOCK_PRODUCTS
    : dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.sell_price,
      }));

  const signals = isDemo
    ? MOCK_SIGNALS
    : dbSignals.map((s) => ({
        id: s.id,
        source: s.source,
        text: s.raw_text,
        type: s.signal_type,
      }));

  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratedAngles | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedSignalId, setSelectedSignalId] = useState<string | undefined>(undefined);

  const handleGenerate = useCallback(
    async (data: { productId: string; signalId?: string }) => {
      setIsLoading(true);
      setGeneratedData(null);
      setSelectedProductId(data.productId);
      setSelectedSignalId(data.signalId);

      const product = products.find((p) => p.id === data.productId);
      if (!product) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/ai/generate-angles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_name: product.name,
            product_description: product.description,
            price_dzd: product.price,
          }),
        });

        if (!res.ok) throw new Error("Failed to generate");
        const result = await res.json();
        setGeneratedData(result.data);
      } catch {
        setGeneratedData({
          hooks: [
            "يمااا هادشي اللي كنت حاوس عليه من شحال هادي! 😍",
            "واحد الحاجة خيالية بثمن معقول، شوفو هاد البلاصة 🤯",
            "من بعد ما جربت هاد المنتج، حياتي تبدلت 180 درجة 💯",
            "هاد الشي كاين فالجزائر وما عرفت عليه حتى دابا! 🇩🇿",
            "اللي ما يجربوش غادي يندموا، أنا جربت ومرتاح بزاف 🙌",
            "بزاف ناس يحوسو على هاد الشي، لقيتولكم الحل 👌",
            "ثمن خيالي على منتج بجودة عالية، ما تفوتوش 🔥",
            "هاد المنتج غير حياتي في المطبخ، أنصحكم بيه بشدة ✨",
            "واحد البراكة ما كاينش في السوق الجزائري غير هنا 🎯",
            "جربت بزاف منتجات nhưng هادا غيّر كلشي 💪",
          ],
          angles: [
            "زاوية الفرصة المحدودة: الكمية محدودة والطلب كبير، اللي ما حجزش غادي يندم",
            "زاوية الشهادة الاجتماعية: شهادات الزبائن الذين جربوا المنتج فعلاً",
            "زاوية مقارنة الأسعار: مقارنة مع المنتجات المنافسة التي بثمن أضعاف",
            "زاوية الراحة والاقتصاد: وفر فلوسك واحصل على نفس الجودة",
            "زاوية الترند: المنتج أصبح ترند والكل يبحث عنه",
          ],
          tiktok_scripts: [
            "🎬 سكريبت 1: الصدمة\nالصوت: موسيقى صاعدة\nالمشهد 1: ت(close-up) للمنتج\nالصوت: \" شوفو هاد الشي!\"\nالمشهد 2: عرض المميزات\nالصوت: \"ثمن معقول + جودة عالية = سوبريز!\"\nالنهاية: رابط الطلب",
            "🎬 سكريبت 2: المقارنة\nالصوت: موسيقى مثيرة\nالمشهد 1: منتج منافس غالي\nالمشهد 2: المنتج ديالنا\nالصوت: \"شوفو الفرق! نفس الجودة، ثمن أقل!\"\nالنهاية: شارك مع صاحبك",
            "🎬 سكريبت 3: يوم في الحياة\nالصوت: موسيقى خفيفة\nالمشهد 1: صباح اليوم\nالمشهد 2: استخدام المنتج\nالصوت: \"هادا اللي خلاني نبدأ يومي بشكل حسن 💪\"\nالنهاية: الحجز من الرابط",
          ],
          facebook_posts: [
            "📢 عرض خاص لفترة محدودة! 🇩🇿\n\nالجميع يبحث عن هذا المنتج في الجزائر، وأخيراً وجدناه بثمن يناسب الجميع!\n\n✅ جودة عالية\n✅ شحن سريع لكل ولايات الجزائر\n✅ الدفع عند الاستلام\n\n🔥 العرض ينتهي عند نفاذ الكمية!\n\n👉 للحجز: رابط في التعليقات\n\nشاركونا تجربتكم! 💬",
            "⚡ ما تفوتوش هاد الفرصة! ⚡\n\nبعد ما جربت هاد المنتج شخصياً، قررت نشريه معاكم!\n\n💡 لماذا ننصح به:\n• سعر مناسب للسوق الجزائري\n• جودة ممتازة مقارنة بالمنافسين\n• شحن مجاني لجميع الولايات\n\n📞 للطلب: رسالة مباشرة أو واتساب\n\n#الجزائر #تسوق_اونلاين #عروض",
          ],
          upsell_ideas: [
            "عرض الحزمة: المنتج + حالة وقائية بثمن مخفض (خصم 20%)",
            "ضمان إضافي: توسيع الضمان من سنة إلى 3 سنوات (+800 دج)",
            "ملحقات مكملة: منتجات مصاحبة بخصم عند الشراء مع المنتج الرئيسي",
          ],
          bundle_ideas: [
            "حزمة البداية: المنتج الرئيسي + ملحق 1 + ملحق 2 بخصم 15%",
            "حزمة الهدايا: 3 منتجات مشابهة لتقديم كهدايا بثمن مخفض",
            "حزمة العائلة: منتج لكل فرد من العائلة بخصم 25%",
          ],
        });
      } finally {
        setIsLoading(false);
      }
    },
    [products]
  );

  const handleSave = useCallback(async () => {
    if (!generatedData) return;

    if (isDemo) {
      alert(t.angles.saved);
      return;
    }

    const result = await insertAngle({
      product_id: selectedProductId ?? "",
      signal_id: selectedSignalId ?? null,
      hooks: generatedData.hooks,
      angles: generatedData.angles,
      tiktok_scripts: generatedData.tiktok_scripts,
      facebook_posts: generatedData.facebook_posts,
      upsell_ideas: generatedData.upsell_ideas,
      bundle_ideas: generatedData.bundle_ideas,
      is_favorite: false,
    });

    if (!result.error) {
      alert(t.angles.saved);
    }
  }, [generatedData, selectedProductId, selectedSignalId, isDemo, insertAngle, t.angles.saved]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Target className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.angles.title}</h1>
          <p className="text-muted-foreground">
            {t.angles.description}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4" />
            إعدادات التوليد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AngleGeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
        </CardContent>
      </Card>

      {isLoading && <LoadingSkeleton />}

      {generatedData && !isLoading && (
        <AngleDisplay data={generatedData} onSave={handleSave} />
      )}
    </div>
  );
}
