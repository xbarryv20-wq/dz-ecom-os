import type {
  Signal as DbSignal,
  Product as DbProduct,
  Campaign as DbCampaign,
  Prompt as DbPrompt,
  KnowledgeEntry as DbKnowledge,
  MarketingAngle as DbAngle,
  ProductVariant as DbVariant,
} from "@/types/database";

// ── Target types (matching component interfaces) ──

export interface Signal {
  id: string;
  source: string;
  rawText: string;
  sourceLink: string | null;
  type: string;
  niche: string;
  engagement: number | null;
  tags: string[];
  isAnalyzed: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  niche: string;
  description: string;
  sourceLink?: string;
  costPrice: number;
  sellPrice: number;
  deliveryCost: number;
  confirmationCost: number;
  adSpendEstimate: number;
  notes: string;
  status: "draft" | "ready" | "active";
  aiReviewed: boolean;
  createdAt: string;
}

// ── Signal Mappers ──

export function mapDbSignalToSignal(db: DbSignal): Signal {
  return {
    id: db.id,
    source: db.source,
    rawText: db.raw_text,
    sourceLink: db.source_link,
    type: db.signal_type,
    niche: db.niche,
    engagement: db.engagement_estimate,
    tags: db.tags,
    isAnalyzed: db.is_analyzed,
    createdAt: db.created_at,
  };
}

// ── Product Mappers ──

export function mapDbProductToProduct(db: DbProduct): Product {
  return {
    id: db.id,
    name: db.name,
    niche: db.niche,
    description: db.description,
    sourceLink: db.source_link ?? undefined,
    costPrice: db.cost_price,
    sellPrice: db.sell_price,
    deliveryCost: db.delivery_cost,
    confirmationCost: db.confirmation_cost,
    adSpendEstimate: db.ad_spend_estimate,
    notes: db.notes,
    status: db.status as "draft" | "ready" | "active",
    aiReviewed: false,
    createdAt: db.created_at,
  };
}

// ── Campaign Mappers ──
// Campaign uses DB types directly (snake_case matches component expectations)

// ── Prompt Mappers ──

export function mapDbPromptToPrompt(db: DbPrompt) {
  return {
    id: db.id,
    title: db.title,
    content: db.content,
    category: db.category,
    isFavorite: db.is_favorite,
    usageCount: db.usage_count,
    createdAt: db.created_at,
  };
}

// ── Knowledge Mappers ──

export function mapDbKnowledgeToKnowledge(db: DbKnowledge) {
  return {
    id: db.id,
    title: db.title,
    content: db.content,
    niche: db.niche,
    tags: db.tags,
    category: db.category,
    isPinned: db.is_pinned,
    createdAt: db.created_at,
  };
}

// ── Angle Mappers ──

export function mapDbAngleToAngle(db: DbAngle) {
  return {
    id: db.id,
    productId: db.product_id,
    signalId: db.signal_id,
    hooks: db.hooks,
    angles: db.angles,
    tiktokScripts: db.tiktok_scripts,
    facebookPosts: db.facebook_posts,
    upsellIdeas: db.upsell_ideas,
    bundleIdeas: db.bundle_ideas,
    isFavorite: db.is_favorite,
    createdAt: db.created_at,
  };
}

// ── Variant Mappers ──

export function mapDbVariantToVariant(db: DbVariant) {
  return {
    id: db.id,
    productId: db.product_id,
    sku: db.sku,
    model: db.model,
    color: db.color,
    storage: db.storage,
    quantity: db.quantity,
    reservedQuantity: db.reserved_quantity,
    notes: db.notes,
  };
}
