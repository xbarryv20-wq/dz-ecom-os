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

export interface ContentPiece {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  content_type: string;
  content: string;
  source_product_id: string | null;
  source_campaign_id: string | null;
  overall_score: number | null;
  scores: Record<string, number>;
  feedback: Record<string, string>;
  optimized_version: string | null;
  status: string;
}

export interface CroAudit {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  product_id: string | null;
  url: string | null;
  headline_score: number | null;
  clarity_score: number | null;
  urgency_score: number | null;
  trust_score: number | null;
  cta_score: number | null;
  mobile_score: number | null;
  speed_score: number | null;
  design_score: number | null;
  overall_score: number | null;
  letter_grade: string | null;
  recommendations: string[];
  benchmark_percentile: number | null;
}

export interface Experiment {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  name: string;
  hypothesis: string;
  variable: string;
  metric: string;
  platform: string | null;
  campaign_id: string | null;
  status: string;
  winner_id: string | null;
  confidence: number | null;
  lift: number | null;
  started_at: string | null;
  concluded_at: string | null;
}

export interface ExperimentVariant {
  id: string;
  created_at: string;
  experiment_id: string;
  name: string;
  description: string;
  impressions: number;
  conversions: number;
  spend: number;
  is_control: boolean;
  is_winner: boolean;
}
