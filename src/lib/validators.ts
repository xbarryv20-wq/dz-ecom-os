import { z } from "zod";

export const signalSchema = z.object({
  source: z.string().trim().min(1, "المصدر مطلوب"),
  rawText: z.string().trim().min(1, "النص الأصلي مطلوب"),
  sourceLink: z
    .string()
    .trim()
    .url("رابط غير صالح")
    .optional()
    .or(z.literal("")),
  signalType: z.string().trim().min(1, "نوع الإشارة مطلوب"),
  niche: z.string().trim().min(1, "النيش مطلوب"),
  engagementEstimate: z.coerce.number().min(0).optional(),
  tags: z.array(z.string().trim()).optional().default([]),
});

export type SignalInput = z.infer<typeof signalSchema>;

export const signalAnalysisSchema = z.object({
  painPoint: z.string().trim().min(1, "المعضلة مطلوبة"),
  buyingMotive: z.string().trim().min(1, "دافع الشراء مطلوب"),
  targetPersona: z.string().trim().min(1, "الشريحة المستهدفة مطلوبة"),
  suggestedProducts: z
    .array(z.string().trim())
    .min(1, "اقترح منتجاً واحداً على الأقل"),
  opportunityScore: z.coerce.number().min(0).max(10),
  explanation: z.string().trim().min(1, "التفسير مطلوب"),
});

export type SignalAnalysisInput = z.infer<typeof signalAnalysisSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(1, "اسم المنتج مطلوب"),
  niche: z.string().trim().min(1, "النيش مطلوب"),
  description: z.string().trim().optional().default(""),
  sourceLink: z
    .string()
    .trim()
    .url("رابط غير صالح")
    .optional()
    .or(z.literal("")),
  costPrice: z.coerce.number().min(0, "سعر التكلفة يجب أن يكون موجباً"),
  sellPrice: z.coerce.number().min(0, "سعر البيع يجب أن يكون موجباً"),
  deliveryCost: z.coerce.number().min(0).optional().default(0),
  confirmationCost: z.coerce.number().min(0).optional().default(0),
  adSpendEstimate: z.coerce.number().min(0).optional().default(0),
  notes: z.string().trim().optional().default(""),
});

export type ProductInput = z.infer<typeof productSchema>;

export const productVariantSchema = z.object({
  sku: z.string().trim().min(1, "رمز SKU مطلوب"),
  model: z.string().trim().optional().default(""),
  color: z.string().trim().optional().default(""),
  storage: z.string().trim().optional().default(""),
  quantity: z.coerce.number().int().min(0, "الكمية يجب أن تكون موجبة"),
  notes: z.string().trim().optional().default(""),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

export const angleSchema = z.object({
  productId: z.string().uuid("معرف المنتج غير صالح"),
  signalId: z.string().uuid("معرف الإشارة غير صالح").optional().nullable(),
  hooks: z.array(z.string().trim()).min(1, "أضف خطافاً واحداً على الأقل"),
  angles: z.array(z.string().trim()).min(1, "أضف زاوية واحدة على الأقل"),
  tiktokScripts: z.array(z.string().trim()).optional().default([]),
  facebookPosts: z.array(z.string().trim()).optional().default([]),
  upsellIdeas: z.array(z.string().trim()).optional().default([]),
  bundleIdeas: z.array(z.string().trim()).optional().default([]),
});

export type AngleInput = z.infer<typeof angleSchema>;

export const campaignSchema = z.object({
  name: z.string().trim().min(1, "اسم الحملة مطلوب"),
  platform: z.string().trim().min(1, "المنصة مطلوبة"),
  productId: z.string().uuid("معرف المنتج غير صالح"),
  angleUsed: z.string().trim().optional().default(""),
  hookUsed: z.string().trim().optional().default(""),
  launchDate: z.string().trim().min(1, "تاريخ الإطلاق مطلوب"),
  spend: z.coerce.number().min(0).optional().default(0),
  messages: z.coerce.number().int().min(0).optional().default(0),
  confirmedOrders: z.coerce.number().int().min(0).optional().default(0),
  deliveredOrders: z.coerce.number().int().min(0).optional().default(0),
  cancellations: z.coerce.number().int().min(0).optional().default(0),
  notes: z.string().trim().optional().default(""),
  status: z.string().trim().min(1, "الحالة مطلوبة"),
});

export type CampaignInput = z.infer<typeof campaignSchema>;

export const promptSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب"),
  content: z.string().trim().min(1, "المحتوى مطلوب"),
  category: z.string().trim().min(1, "الفئة مطلوبة"),
  isFavorite: z.boolean().optional().default(false),
});

export type PromptInput = z.infer<typeof promptSchema>;

export const knowledgeSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب"),
  content: z.string().trim().min(1, "المحتوى مطلوب"),
  niche: z.string().trim().optional().default(""),
  tags: z.array(z.string().trim()).optional().default([]),
  category: z.string().trim().min(1, "الفئة مطلوبة"),
});

export type KnowledgeInput = z.infer<typeof knowledgeSchema>;

export const searchSchema = z.object({
  query: z.string().trim().min(1, "أدخل كلمة للبحث"),
  filters: z
    .object({
      niche: z.string().optional(),
      status: z.string().optional(),
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    })
    .optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;
