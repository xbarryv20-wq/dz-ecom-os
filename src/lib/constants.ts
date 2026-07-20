export const SIDEBAR_NAV_ITEMS = [
  {
    key: "dashboard",
    label: "لوحة التحكم",
    path: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    key: "signals",
    label: "الإشارات",
    path: "/signals",
    icon: "Radar",
  },
  {
    key: "products",
    label: "المنتجات",
    path: "/products",
    icon: "Package",
  },
  {
    key: "angles",
    label: "الزوايا التسويقية",
    path: "/angles",
    icon: "Target",
  },
  {
    key: "inventory",
    label: "المخزون",
    path: "/inventory",
    icon: "Warehouse",
  },
  {
    key: "campaigns",
    label: "الحملات",
    path: "/campaigns",
    icon: "Megaphone",
  },
  {
    key: "prompts",
    label: "البرومبتات",
    path: "/prompts",
    icon: "Sparkles",
  },
  {
    key: "knowledge",
    label: "قاعدة المعرفة",
    path: "/knowledge",
    icon: "BookOpen",
  },
  {
    key: "settings",
    label: "الإعدادات",
    path: "/settings",
    icon: "Settings",
  },
] as const;

export const SIGNAL_TYPES = [
  { key: "pain_point", label: "معضلة / ألم" },
  { key: "buying_motive", label: "دافع شرائي" },
  { key: "trend", label: "اتجاه صاعد" },
  { key: "competitor", label: "منافس" },
  { key: "opportunity", label: "فرصة" },
] as const;

export const SIGNAL_SOURCES = [
  { key: "facebook", label: "فيسبوك" },
  { key: "tiktok", label: "تيك توك" },
  { key: "instagram", label: "إنستغرام" },
  { key: "youtube", label: "يوتيوب" },
  { key: "twitter", label: "تويتر / X" },
  { key: "google", label: "قوقل" },
  { key: "amazon", label: "أمازون" },
  { key: "aliexpress", label: "علي إكسبريس" },
  { key: "manual", label: "يدوي" },
  { key: "other", label: "أخرى" },
] as const;

export const NICHE_OPTIONS = [
  { key: "beauty", label: "الجمال والتجميل" },
  { key: "fashion", label: "الأزياء والموضة" },
  { key: "electronics", label: "الإلكترونيات" },
  { key: "health", label: "الصحة واللياقة" },
  { key: "home", label: "المنزل والمطبخ" },
  { key: "kids", label: "الأطفال" },
  { key: "pets", label: "الحيوانات الأليفة" },
  { key: "food", label: "الأغذية" },
  { key: "sports", label: "الرياضة" },
  { key: "automotive", label: "السيارات" },
  { key: "education", label: "التعليم" },
  { key: "other", label: "أخرى" },
] as const;

export const CAMPAIGN_PLATFORMS = [
  { key: "facebook", label: "فيسبوك" },
  { key: "instagram", label: "إنستغرام" },
  { key: "tiktok", label: "تيك توك" },
  { key: "google", label: "قوقل" },
  { key: "snapchat", label: "سناب شات" },
  { key: "whatsapp", label: "واتساب" },
  { key: "other", label: "أخرى" },
] as const;

export const CAMPAIGN_STATUSES = [
  { key: "draft", label: "مسودة" },
  { key: "active", label: "نشطة" },
  { key: "paused", label: "متوقفة" },
  { key: "completed", label: "مكتملة" },
  { key: "cancelled", label: "ملغاة" },
] as const;

export const PROMPT_CATEGORIES = [
  { key: "product_research", label: "بحث المنتجات" },
  { key: "ad_copy", label: "كتابة الإعلانات" },
  { key: "script", label: "سكريبتات" },
  { key: "analysis", label: "تحليل" },
  { key: "customer_service", label: "خدمة العملاء" },
  { key: "other", label: "أخرى" },
] as const;

export const KNOWLEDGE_CATEGORIES = [
  { key: "strategy", label: "استراتيجية" },
  { key: "marketing", label: "تسويق" },
  { key: "operations", label: "عمليات" },
  { key: "finance", label: "مالي" },
  { key: "supplier", label: "موردين" },
  { key: "other", label: "أخرى" },
] as const;

export const INVENTORY_MOVEMENT_TYPES = [
  { key: "purchase", label: "شراء" },
  { key: "sale", label: "بيع" },
  { key: "return", label: "إرجاع" },
  { key: "adjustment", label: "تعديل" },
  { key: "damaged", label: "تالف" },
] as const;

export const CURRENCIES = [
  { key: "DZD", label: "دينار جزائري (DZD)" },
  { key: "USD", label: "دولار أمريكي (USD)" },
  { key: "EUR", label: "يورو (EUR)" },
] as const;

export const DEFAULT_PAGE_SIZE = 20;

export const APP_NAME = "DZ Ecom OS";
export const APP_DESCRIPTION = "نظام التشغيل للتجارة الإلكترونية في الجزائر";
