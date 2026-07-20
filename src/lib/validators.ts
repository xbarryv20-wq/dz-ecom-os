import { z } from "zod";

export const signalSchema = z.object({
  source: z.string().trim().min(1, "Source is required"),
  rawText: z.string().trim().min(1, "Raw text is required"),
  sourceLink: z
    .string()
    .trim()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  signalType: z.string().trim().min(1, "Signal type is required"),
  niche: z.string().trim().min(1, "Niche is required"),
  engagementEstimate: z.coerce.number().min(0).optional(),
  tags: z.array(z.string().trim()).optional().default([]),
});

export type SignalInput = z.infer<typeof signalSchema>;

export const signalAnalysisSchema = z.object({
  painPoint: z.string().trim().min(1, "Pain point is required"),
  buyingMotive: z.string().trim().min(1, "Buying motive is required"),
  targetPersona: z.string().trim().min(1, "Target persona is required"),
  suggestedProducts: z
    .array(z.string().trim())
    .min(1, "Suggest at least one product"),
  opportunityScore: z.coerce.number().min(0).max(10),
  explanation: z.string().trim().min(1, "Explanation is required"),
});

export type SignalAnalysisInput = z.infer<typeof signalAnalysisSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  niche: z.string().trim().min(1, "Niche is required"),
  description: z.string().trim().optional().default(""),
  sourceLink: z
    .string()
    .trim()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  costPrice: z.coerce.number().min(0, "Cost price must be positive"),
  sellPrice: z.coerce.number().min(0, "Sell price must be positive"),
  deliveryCost: z.coerce.number().min(0).optional().default(0),
  confirmationCost: z.coerce.number().min(0).optional().default(0),
  adSpendEstimate: z.coerce.number().min(0).optional().default(0),
  notes: z.string().trim().optional().default(""),
});

export type ProductInput = z.infer<typeof productSchema>;

export const productVariantSchema = z.object({
  sku: z.string().trim().min(1, "SKU is required"),
  model: z.string().trim().optional().default(""),
  color: z.string().trim().optional().default(""),
  storage: z.string().trim().optional().default(""),
  quantity: z.coerce.number().int().min(0, "Quantity must be positive"),
  notes: z.string().trim().optional().default(""),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

export const angleSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  signalId: z.string().uuid("Invalid signal ID").optional().nullable(),
  hooks: z.array(z.string().trim()).min(1, "Add at least one hook"),
  angles: z.array(z.string().trim()).min(1, "Add at least one angle"),
  tiktokScripts: z.array(z.string().trim()).optional().default([]),
  facebookPosts: z.array(z.string().trim()).optional().default([]),
  upsellIdeas: z.array(z.string().trim()).optional().default([]),
  bundleIdeas: z.array(z.string().trim()).optional().default([]),
});

export type AngleInput = z.infer<typeof angleSchema>;

export const campaignSchema = z.object({
  name: z.string().trim().min(1, "Campaign name is required"),
  platform: z.string().trim().min(1, "Platform is required"),
  productId: z.string().uuid("Invalid product ID"),
  angleUsed: z.string().trim().optional().default(""),
  hookUsed: z.string().trim().optional().default(""),
  launchDate: z.string().trim().min(1, "Launch date is required"),
  spend: z.coerce.number().min(0).optional().default(0),
  messages: z.coerce.number().int().min(0).optional().default(0),
  confirmedOrders: z.coerce.number().int().min(0).optional().default(0),
  deliveredOrders: z.coerce.number().int().min(0).optional().default(0),
  cancellations: z.coerce.number().int().min(0).optional().default(0),
  notes: z.string().trim().optional().default(""),
  status: z.string().trim().min(1, "Status is required"),
});

export type CampaignInput = z.infer<typeof campaignSchema>;

export const promptSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Content is required"),
  category: z.string().trim().min(1, "Category is required"),
  isFavorite: z.boolean().optional().default(false),
});

export type PromptInput = z.infer<typeof promptSchema>;

export const knowledgeSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Content is required"),
  niche: z.string().trim().optional().default(""),
  tags: z.array(z.string().trim()).optional().default([]),
  category: z.string().trim().min(1, "Category is required"),
});

export type KnowledgeInput = z.infer<typeof knowledgeSchema>;

export const searchSchema = z.object({
  query: z.string().trim().min(1, "Enter a search term"),
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
