"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const MOCK_PRODUCTS = [
  { id: "p1", name: "نظارة شمسية بريميوم", niche: "أزياء" },
  { id: "p2", name: "سماعات لاسلكية برو", niche: "إلكترونيات" },
  { id: "p3", name: "مكنسة روبوتية ذكية", niche: "منزل" },
  { id: "p4", name: "ساعة رياضية ذكية", niche: "رياضة" },
  { id: "p5", name: "حقيبة ظهر مقاومة للماء", niche: "أزياء" },
  { id: "p6", name: "مصباح مكتبي LED", niche: "منزل" },
  { id: "p7", name: "جهاز تدليك كهربائي", niche: "صحة" },
  { id: "p8", name: "حافظة هاتف جلدية", niche: "إلكترونيات" },
];

const MOCK_SIGNALS = [
  { id: "s1", source: "فيسبوك", text: "الناس تحوسس على نظارات شمسية رخيصة但质量", type: "pain_point" },
  { id: "s2", source: "تيك توك", text: "تريند السماعات اللاسلكية كبر بزاف في الجزائر", type: "trend" },
  { id: "s3", source: "إنستغرام", text: "بزاف ناس يشكون من المكنسات الروبوتية الغالية", type: "pain_point" },
  { id: "s4", source: "manual", text: "منافس جديد دخل السوق بساعات رياضية بثمن منخفض", type: "competitor" },
  { id: "s5", source: "تويتر", text: "الطلب على حقائب الظهر المقاومة للماء تزاد", type: "trend" },
];

interface AngleGeneratorFormProps {
  onGenerate: (data: { productId: string; signalId?: string }) => void;
  isLoading: boolean;
}

export function AngleGeneratorForm({ onGenerate, isLoading }: AngleGeneratorFormProps) {
  const { t } = useI18n();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedSignal, setSelectedSignal] = useState<string>("");

  const handleGenerate = () => {
    if (!selectedProduct) return;
    onGenerate({
      productId: selectedProduct,
      signalId: selectedSignal || undefined,
    });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t.angles.product}</Label>
        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
          <SelectTrigger>
            <SelectValue placeholder={t.angles.chooseProduct} />
          </SelectTrigger>
          <SelectContent>
            {MOCK_PRODUCTS.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} — {product.niche}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">{t.angles.signalOptional}</Label>
        <Select value={selectedSignal} onValueChange={setSelectedSignal}>
          <SelectTrigger>
            <SelectValue placeholder={t.angles.chooseSignal} />
          </SelectTrigger>
          <SelectContent>
            {MOCK_SIGNALS.map((signal) => (
              <SelectItem key={signal.id} value={signal.id}>
                {signal.source}: {signal.text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="sm:col-span-2">
        <Button
          onClick={handleGenerate}
          disabled={!selectedProduct || isLoading}
          className="w-full sm:w-auto"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              {t.angles.generating}...
            </>
          ) : (
            <>
              <Sparkles className="ml-2 h-4 w-4" />
              {t.angles.generate}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
