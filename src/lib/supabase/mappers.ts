import type {
  Signal,
  SignalAiAnalysis,
  Product,
  ProductVariant,
  InventoryMovement,
  MarketingAngle,
  Campaign,
  Prompt,
  KnowledgeEntry,
  ContentPiece,
  CroAudit,
  Experiment,
  ExperimentVariant,
} from "@/types/database";

// DB snake_case -> component camelCase
export function mapDbSignalToSignal(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): Signal {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    user_id: db.user_id as string,
    source: db.source as string,
    raw_text: db.raw_text as string,
    source_link: db.source_link as string | null,
    signal_type: db.signal_type as string,
    niche: db.niche as string,
    engagement_estimate: db.engagement_estimate as number | null,
    tags: db.tags as string[],
    is_analyzed: db.is_analyzed as boolean,
  };
}

export function mapDbAnalysisToAnalysis(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): SignalAiAnalysis {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    signal_id: db.signal_id as string,
    pain_point: db.pain_point as string,
    buying_motive: db.buying_motive as string,
    target_persona: db.target_persona as string,
    suggested_products: db.suggested_products as string[],
    opportunity_score: db.opportunity_score as number,
    explanation: db.explanation as string,
    model_used: db.model_used as string,
  };
}

export function mapDbProductToProduct(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): Product {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    user_id: db.user_id as string,
    name: db.name as string,
    niche: db.niche as string,
    description: db.description as string,
    source_link: db.source_link as string | null,
    cost_price: Number(db.cost_price ?? 0),
    sell_price: Number(db.sell_price ?? 0),
    delivery_cost: Number(db.delivery_cost ?? 0),
    confirmation_cost: Number(db.confirmation_cost ?? 0),
    ad_spend_estimate: Number(db.ad_spend_estimate ?? 0),
    notes: db.notes as string,
    status: db.status as string,
    image_url: db.image_url as string | null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbVariantToVariant(db: any): ProductVariant {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    product_id: db.product_id as string,
    sku: db.sku as string,
    model: db.model as string,
    color: db.color as string,
    storage: db.storage as string,
    quantity: db.quantity as number,
    reserved_quantity: db.reserved_quantity as number,
    notes: db.notes as string,
  };
}

export function mapDbMovementToMovement(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): InventoryMovement {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    user_id: db.user_id as string,
    product_variant_id: db.product_variant_id as string,
    movement_type: db.movement_type as string,
    quantity: db.quantity as number,
    unit_cost: db.unit_cost as number | null,
    reference_id: db.reference_id as string | null,
    notes: db.notes as string,
  };
}

export function mapDbAngleToAngle(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): MarketingAngle {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    user_id: db.user_id as string,
    product_id: db.product_id as string,
    signal_id: db.signal_id as string | null,
    hooks: db.hooks as string[],
    angles: db.angles as string[],
    tiktok_scripts: db.tiktok_scripts as string[],
    facebook_posts: db.facebook_posts as string[],
    upsell_ideas: db.upsell_ideas as string[],
    bundle_ideas: db.bundle_ideas as string[],
    is_favorite: db.is_favorite as boolean,
  };
}

export function mapDbCampaignToCampaign(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): Campaign {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    user_id: db.user_id as string,
    name: db.name as string,
    platform: db.platform as string,
    product_id: db.product_id as string,
    angle_used: db.angle_used as string,
    hook_used: db.hook_used as string,
    launch_date: db.launch_date as string,
    spend: Number(db.spend ?? 0),
    messages: db.messages as number,
    confirmed_orders: db.confirmed_orders as number,
    delivered_orders: db.delivered_orders as number,
    cancellations: db.cancellations as number,
    notes: db.notes as string,
    status: db.status as string,
  };
}

export function mapDbPromptToPrompt(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): Prompt {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    user_id: db.user_id as string,
    title: db.title as string,
    content: db.content as string,
    category: db.category as string,
    is_favorite: db.is_favorite as boolean,
    usage_count: db.usage_count as number,
  };
}

export function mapDbKnowledgeToKnowledge(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): KnowledgeEntry {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    user_id: db.user_id as string,
    title: db.title as string,
    content: db.content as string,
    niche: db.niche as string,
    tags: db.tags as string[],
    category: db.category as string,
    is_pinned: db.is_pinned as boolean,
  };
}

export function mapDbContentToContent(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): ContentPiece {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    user_id: db.user_id as string,
    title: db.title as string,
    content_type: db.content_type as string,
    content: db.content as string,
    source_product_id: db.source_product_id as string | null,
    source_campaign_id: db.source_campaign_id as string | null,
    overall_score: db.overall_score != null ? Number(db.overall_score) : null,
    scores: (db.scores as Record<string, number>) || {},
    feedback: (db.feedback as Record<string, string>) || {},
    optimized_version: db.optimized_version as string | null,
    status: db.status as string,
  };
}

export function mapDbAuditToAudit(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): CroAudit {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    user_id: db.user_id as string,
    product_id: db.product_id as string | null,
    url: db.url as string | null,
    headline_score: db.headline_score != null ? Number(db.headline_score) : null,
    clarity_score: db.clarity_score != null ? Number(db.clarity_score) : null,
    urgency_score: db.urgency_score != null ? Number(db.urgency_score) : null,
    trust_score: db.trust_score != null ? Number(db.trust_score) : null,
    cta_score: db.cta_score != null ? Number(db.cta_score) : null,
    mobile_score: db.mobile_score != null ? Number(db.mobile_score) : null,
    speed_score: db.speed_score != null ? Number(db.speed_score) : null,
    design_score: db.design_score != null ? Number(db.design_score) : null,
    overall_score: db.overall_score != null ? Number(db.overall_score) : null,
    letter_grade: db.letter_grade as string | null,
    recommendations: db.recommendations as string[],
    benchmark_percentile: db.benchmark_percentile != null ? Number(db.benchmark_percentile) : null,
  };
}

export function mapDbExperimentToExperiment(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): Experiment {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    updated_at: db.updated_at as string,
    user_id: db.user_id as string,
    name: db.name as string,
    hypothesis: db.hypothesis as string,
    variable: db.variable as string,
    metric: db.metric as string,
    platform: db.platform as string | null,
    campaign_id: db.campaign_id as string | null,
    status: db.status as string,
    winner_id: db.winner_id as string | null,
    confidence: db.confidence != null ? Number(db.confidence) : null,
    lift: db.lift != null ? Number(db.lift) : null,
    started_at: db.started_at as string | null,
    concluded_at: db.concluded_at as string | null,
  };
}

export function mapDbExperimentVariantToVariant(db: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any): ExperimentVariant {
  return {
    id: db.id as string,
    created_at: db.created_at as string,
    experiment_id: db.experiment_id as string,
    name: db.name as string,
    description: db.description as string,
    impressions: db.impressions as number,
    conversions: db.conversions as number,
    spend: Number(db.spend ?? 0),
    is_control: db.is_control as boolean,
    is_winner: db.is_winner as boolean,
  };
}
