export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  store_name: string | null;
  phone: string | null;
  preferred_currency: string;
  preferred_niche: string | null;
}

export interface Signal {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  source: string;
  raw_text: string;
  source_link: string | null;
  signal_type: string;
  niche: string;
  engagement_estimate: number | null;
  tags: string[];
  is_analyzed: boolean;
}

export interface SignalAiAnalysis {
  id: string;
  created_at: string;
  updated_at: string;
  signal_id: string;
  pain_point: string;
  buying_motive: string;
  target_persona: string;
  suggested_products: string[];
  opportunity_score: number;
  explanation: string;
  model_used: string;
}

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  niche: string;
  description: string;
  source_link: string | null;
  cost_price: number;
  sell_price: number;
  delivery_cost: number;
  confirmation_cost: number;
  ad_spend_estimate: number;
  notes: string;
  status: string;
  image_url: string | null;
}

export interface ProductVariant {
  id: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  sku: string;
  model: string;
  color: string;
  storage: string;
  quantity: number;
  reserved_quantity: number;
  notes: string;
}

export interface InventoryMovement {
  id: string;
  created_at: string;
  user_id: string;
  product_variant_id: string;
  movement_type: string;
  quantity: number;
  unit_cost: number | null;
  reference_id: string | null;
  notes: string;
}

export interface ProductAiReview {
  id: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  rating: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  market_fit_score: number;
  explanation: string;
  model_used: string;
}

export interface MarketingAngle {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  product_id: string;
  signal_id: string | null;
  hooks: string[];
  angles: string[];
  tiktok_scripts: string[];
  facebook_posts: string[];
  upsell_ideas: string[];
  bundle_ideas: string[];
  is_favorite: boolean;
}

export interface Script {
  id: string;
  created_at: string;
  updated_at: string;
  angle_id: string;
  platform: string;
  content: string;
  duration_seconds: number | null;
  is_active: boolean;
}

export interface Campaign {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  platform: string;
  product_id: string;
  angle_used: string;
  hook_used: string;
  launch_date: string;
  spend: number;
  messages: number;
  confirmed_orders: number;
  delivered_orders: number;
  cancellations: number;
  notes: string;
  status: string;
}

export interface CampaignMetric {
  id: string;
  created_at: string;
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  messages: number;
  confirmed_orders: number;
  delivered_orders: number;
  cancellations: number;
}

export interface Prompt {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_favorite: boolean;
  usage_count: number;
}

export interface KnowledgeEntry {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  content: string;
  niche: string;
  tags: string[];
  category: string;
  is_pinned: boolean;
}

export interface Tag {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  color: string | null;
}
