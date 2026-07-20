export const SIDEBAR_NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    key: "signals",
    label: "Signals",
    path: "/signals",
    icon: "Radar",
  },
  {
    key: "products",
    label: "Products",
    path: "/products",
    icon: "Package",
  },
  {
    key: "angles",
    label: "Marketing Angles",
    path: "/angles",
    icon: "Target",
  },
  {
    key: "content",
    label: "Content Studio",
    path: "/content",
    icon: "FileText",
  },
  {
    key: "experiments",
    label: "Experiments",
    path: "/experiments",
    icon: "FlaskConical",
  },
  {
    key: "inventory",
    label: "Inventory",
    path: "/inventory",
    icon: "Warehouse",
  },
  {
    key: "campaigns",
    label: "Campaigns",
    path: "/campaigns",
    icon: "Megaphone",
  },
  {
    key: "prompts",
    label: "Prompts",
    path: "/prompts",
    icon: "Sparkles",
  },
  {
    key: "knowledge",
    label: "Knowledge Base",
    path: "/knowledge",
    icon: "BookOpen",
  },
  {
    key: "settings",
    label: "Settings",
    path: "/settings",
    icon: "Settings",
  },
] as const;

export const SIGNAL_TYPES = [
  { key: "pain_point", label: "Pain Point" },
  { key: "buying_motive", label: "Buying Motive" },
  { key: "trend", label: "Trend" },
  { key: "competitor", label: "Competitor" },
  { key: "opportunity", label: "Opportunity" },
] as const;

export const SIGNAL_SOURCES = [
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "twitter", label: "Twitter / X" },
  { key: "google", label: "Google" },
  { key: "amazon", label: "Amazon" },
  { key: "aliexpress", label: "AliExpress" },
  { key: "manual", label: "Manual" },
  { key: "other", label: "Other" },
] as const;

export const NICHE_OPTIONS = [
  { key: "beauty", label: "Beauty & Cosmetics" },
  { key: "fashion", label: "Fashion" },
  { key: "electronics", label: "Electronics" },
  { key: "health", label: "Health & Fitness" },
  { key: "home", label: "Home & Kitchen" },
  { key: "kids", label: "Kids" },
  { key: "pets", label: "Pets" },
  { key: "food", label: "Food" },
  { key: "sports", label: "Sports" },
  { key: "automotive", label: "Automotive" },
  { key: "education", label: "Education" },
  { key: "other", label: "Other" },
] as const;

export const CAMPAIGN_PLATFORMS = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "google", label: "Google" },
  { key: "snapchat", label: "Snapchat" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "other", label: "Other" },
] as const;

export const CAMPAIGN_STATUSES = [
  { key: "draft", label: "Draft" },
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export const PROMPT_CATEGORIES = [
  { key: "product_research", label: "Product Research" },
  { key: "ad_copy", label: "Ad Copy" },
  { key: "script", label: "Scripts" },
  { key: "analysis", label: "Analysis" },
  { key: "customer_service", label: "Customer Service" },
  { key: "other", label: "Other" },
] as const;

export const KNOWLEDGE_CATEGORIES = [
  { key: "strategy", label: "Strategy" },
  { key: "marketing", label: "Marketing" },
  { key: "operations", label: "Operations" },
  { key: "finance", label: "Finance" },
  { key: "supplier", label: "Suppliers" },
  { key: "other", label: "Other" },
] as const;

export const INVENTORY_MOVEMENT_TYPES = [
  { key: "purchase", label: "Purchase" },
  { key: "sale", label: "Sale" },
  { key: "return", label: "Return" },
  { key: "adjustment", label: "Adjustment" },
  { key: "damaged", label: "Damaged" },
] as const;

export const CURRENCIES = [
  { key: "DZD", label: "Algerian Dinar (DZD)" },
  { key: "USD", label: "US Dollar (USD)" },
  { key: "EUR", label: "Euro (EUR)" },
] as const;

export const DEFAULT_PAGE_SIZE = 20;

export const APP_NAME = "DZ Ecom OS";
export const APP_DESCRIPTION = "E-commerce operating system for Algerian merchants";

export const CONTENT_TYPES = [
  { key: "ad_copy", label: "Ad Copy" },
  { key: "hook", label: "Hook" },
  { key: "script", label: "Script" },
  { key: "facebook_post", label: "Facebook Post" },
  { key: "tiktok_script", label: "TikTok Script" },
  { key: "headline", label: "Headline" },
  { key: "cta", label: "Call to Action" },
  { key: "email", label: "Email" },
  { key: "whatsapp_message", label: "WhatsApp Message" },
  { key: "other", label: "Other" },
] as const;

export const EXPERIMENT_VARIABLES = [
  { key: "headline", label: "Headline" },
  { key: "cta", label: "Call to Action" },
  { key: "image", label: "Image / Visual" },
  { key: "format", label: "Format" },
  { key: "audience", label: "Audience Targeting" },
  { key: "offer", label: "Offer" },
  { key: "landing_page", label: "Landing Page" },
  { key: "copy", label: "Copy" },
  { key: "platform", label: "Platform" },
  { key: "other", label: "Other" },
] as const;

export const EXPERIMENT_METRICS = [
  { key: "ctr", label: "CTR (Click-through Rate)" },
  { key: "conversion_rate", label: "Conversion Rate" },
  { key: "cpm", label: "CPM (Cost per 1000)" },
  { key: "cpc", label: "CPC (Cost per Click)" },
  { key: "roas", label: "ROAS (Return on Ad Spend)" },
  { key: "messages", label: "Messages Received" },
  { key: "orders", label: "Orders" },
  { key: "engagement", label: "Engagement" },
] as const;
