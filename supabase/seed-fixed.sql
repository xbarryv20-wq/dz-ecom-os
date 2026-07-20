-- ============================================================
-- DZ Ecom OS — Seed Data (Algerian e-commerce operator)
-- Fixed for actual auth user
-- ============================================================

-- Use the actual auth user ID
DO $$
DECLARE
  v_user_id UUID := 'ec4f0e6d-90d2-4b06-87f2-3aed5d8e9fa2';
  v_signal1_id UUID := gen_random_uuid();
  v_signal2_id UUID := gen_random_uuid();
  v_signal3_id UUID := gen_random_uuid();
  v_signal4_id UUID := gen_random_uuid();
  v_product1_id UUID := gen_random_uuid();
  v_product2_id UUID := gen_random_uuid();
  v_product3_id UUID := gen_random_uuid();
  v_product4_id UUID := gen_random_uuid();
  v_variant1_id UUID := gen_random_uuid();
  v_variant2_id UUID := gen_random_uuid();
  v_variant3_id UUID := gen_random_uuid();
  v_variant4_id UUID := gen_random_uuid();
  v_variant5_id UUID := gen_random_uuid();
  v_variant6_id UUID := gen_random_uuid();
  v_angle1_id UUID := gen_random_uuid();
  v_angle2_id UUID := gen_random_uuid();
  v_angle3_id UUID := gen_random_uuid();
  v_campaign1_id UUID := gen_random_uuid();
  v_campaign2_id UUID := gen_random_uuid();
  v_campaign3_id UUID := gen_random_uuid();
  v_campaign4_id UUID := gen_random_uuid();
BEGIN

-- Profile
INSERT INTO public.profiles (user_id, full_name, email, store_name, phone, preferred_currency, preferred_niche)
VALUES (v_user_id, 'ياسين بوزيد', 'admin@ecom.os', 'متجر بوزيد للإلكترونيات', '0555123456', 'DZD', 'الإلكترونيات')
ON CONFLICT (user_id) DO NOTHING;

-- Signals
INSERT INTO public.signals (id, user_id, source, raw_text, source_link, signal_type, niche, engagement_estimate, tags, is_analyzed)
VALUES
  (v_signal1_id, v_user_id, 'facebook', 'واحد يحكيلي على سوار ذكي يقيس الضغط والنبض في الجزائر، وين نلقاه؟ الكل يحكي عليه أما ما لقيناهش', 'https://facebook.com/groups/dztech/posts/12345', 'pain_point', 'أجهزة طبية', 487, ARRAY['سوار_ذكي','صحة','أجهزة_wearable'], true),
  (v_signal2_id, v_user_id, 'tiktok', 'فيديو فيروزي: بنت جزائرية توري كيفاش تصلح شعرها بالبرتقال والعسل، المكونات بـ 200 دج', 'https://tiktok.com/@dzbeauty/video/98765', 'desire', 'تجميل', 12300, ARRAY['تجميل','وصفات_طبيعية'], true),
  (v_signal3_id, v_user_id, 'facebook', 'اللي يعرف شنّا حبوب فيتامين تخلّي الشعر يكبر بزّاف ينصحني، أنا تعبت من تساقط الشعر', 'https://facebook.com/groups/dzbeauty/posts/67890', 'desire', 'عناية بالجسم', 892, ARRAY['شعر','فيتامينات','عناية'], true),
  (v_signal4_id, v_user_id, 'facebook', 'شنّا رأيكم في المكنسة الروبوتية؟ واش تستاهل؟ سعرها غالي أما تكفي في الوقت', 'https://facebook.com/groups/dzhome/posts/24680', 'desire', 'المنزل', 1540, ARRAY['منزل_ذكي','تنظيف','روبوت'], false);

-- Signal AI Analysis
INSERT INTO public.signal_ai_analysis (signal_id, pain_point, buying_motive, target_persona, suggested_products, opportunity_score, explanation, model_used)
VALUES
  (v_signal1_id, 'لا يمكنهم العثور على أجهزة قياس الضغط الذكية في الجزائر بسهولة', 'الرغبة في مراقبة الصحة بشكل يومي والاطمئنان على الحالة الصحية بدون زيارة الطبيب', 'رجل/امرأة، 30-50 سنة، مهتم بالصحة، في ولاية كبيرة', ARRAY['سوار ذكي قياس الضغط','جهاز قياس ضغط ذكي'], 8, 'الإقبال الكبير على منشورات الصحة في المجموعات الجزائرية يدل على طلب غير مستوفي.', 'deepseek-chat'),
  (v_signal2_id, 'البنات يبحثن عن وصفات تجميل طبيعية ورخيصة الثمن', 'الرغبة في تحسين المظهر بطرق طبيعية وبتكلفة بسيطة تناسب الميزانية الجزائرية', 'امرأة، 18-35 سنة، مهتمة بالتجميل الطبيعي', ARRAY['مجموعة وصفات التجميل الطبيعي','زيت أرغان مغربي أصلي'], 9, 'المحتوى التجميلي الطبيعي على تيك توك يحقق ملايين المشاهدات في الجزائر.', 'deepseek-chat'),
  (v_signal3_id, 'تساقط الشعر مشكلة منتشرة بين النساء والرجال في الجزائر', 'الرغبة في إيجاد حل فعال لتساقط الشعر من السوق المحلي', 'امرأة، 25-45 سنة، تعاني من تساقط الشعر', ARRAY['فيتامينات الشعر (بيوتين)','سيروم تكثيف الشعر'], 7, 'تساقط الشعر من أكثر المشاكل الصحية تداولا في المجموعات الجزائرية.', 'deepseek-chat');

-- Products
INSERT INTO public.products (id, user_id, name, niche, description, source_link, cost_price, sell_price, delivery_cost, confirmation_cost, ad_spend_estimate, notes, status)
VALUES
  (v_product1_id, v_user_id, 'سوار ذكي قياس الضغط FitPulse Pro', 'أجهزة طبية', 'سوار ذكي يقيس ضغط الدم، نبض القلب، ومستوى الأكسجين. شاشة LED ملونة، مقاوم للماء IP67، بطارية 7 أيام.', 'https://alibaba.com/fitpulse-pro', 2500, 5500, 400, 300, 800, 'يحتاج ترخيص من وزارة الصحة. تجربة أولية 20 وحدة.', 'active'),
  (v_product2_id, v_user_id, 'طقم وصفات التجميل الطبيعي - 15 وصفة', 'تجميل', 'كتيب رقمي يحتوي 15 وصفة طبيعية للتجميل بالمكونات المتوفرة في الجزائر.', null, 150, 800, 0, 0, 500, 'منتج رقمي، لا يحتاج توصيل. هامش ربح عالي جداً.', 'active'),
  (v_product3_id, v_user_id, 'فيتامينات الشعر BioHair Plus', 'عناية بالجسم', 'مكمل غذائي للشعر: البيوتين، الزنك، وفيتامينات B. 60 كبسولة تكفي شهر.', 'https://alibaba.com/biohair-plus', 800, 2200, 350, 250, 600, 'يحتاج ترخيص. شهادة جودة متوفرة.', 'active'),
  (v_product4_id, v_user_id, 'المكنسة الروبوتية CleanBot X1', 'المنزل', 'مكنسة روبوتية ذاتية الشحن، 2500 باسكال، خرائط لاسلكية، تطبيق موبايل.', 'https://alibaba.com/cleanbot-x1', 8500, 18000, 600, 500, 1200, 'منتج عالي القيمة. يجرب 10 وحدات أولاً.', 'draft');

-- Product Variants
INSERT INTO public.product_variants (id, product_id, sku, model, color, storage, quantity, reserved_quantity, notes)
VALUES
  (v_variant1_id, v_product1_id, 'FP-BLK-001', 'FitPulse Pro', 'أسود', '', 15, 3, 'الأكثر مبيعاً'),
  (v_variant2_id, v_product1_id, 'FP-SLV-002', 'FitPulse Pro', 'فضي', '', 8, 1, ''),
  (v_variant3_id, v_product1_id, 'FP-PNK-003', 'FitPulse Pro', 'وردي', '', 5, 0, 'للنساء'),
  (v_variant4_id, v_product3_id, 'BH-60C-001', 'BioHair Plus', 'أبيض', '60 كبسولة', 25, 5, 'عبوة شهر واحد'),
  (v_variant5_id, v_product3_id, 'BH-120C-002', 'BioHair Plus', 'أبيض', '120 كبسولة', 12, 2, 'عبوة شهرين'),
  (v_variant6_id, v_product4_id, 'CB-WHT-001', 'CleanBot X1', 'أبيض', '', 10, 0, 'متوفر');

-- Inventory Movements
INSERT INTO public.inventory_movements (user_id, product_variant_id, movement_type, quantity, unit_cost, reference_id, notes)
VALUES
  (v_user_id, v_variant1_id, 'purchase', 20, 2500, 'PO-2025-001', 'الدفعة الأولى - 20 وحدة'),
  (v_user_id, v_variant1_id, 'sale', -3, 5500, 'CMP-2025-001', 'مبيعات حملة ديسمبر'),
  (v_user_id, v_variant2_id, 'purchase', 10, 2500, 'PO-2025-001', 'الدفعة الأولى - لون فضي'),
  (v_user_id, v_variant4_id, 'purchase', 30, 800, 'PO-2025-002', 'دفعة فيتامينات الشعر'),
  (v_user_id, v_variant4_id, 'sale', -5, 2200, 'CMP-2025-002', 'مبيعات حملة الشعر');

-- Marketing Angles
INSERT INTO public.marketing_angles (id, user_id, product_id, signal_id, hooks, angles, tiktok_scripts, facebook_posts, upsell_ideas, bundle_ideas, is_favorite)
VALUES
  (v_angle1_id, v_user_id, v_product1_id, v_signal1_id,
    ARRAY['واش تعرف ضغطك دابا؟','هذا السوار يخليك طبيبك الخاص','7 أيام بلا شحن!'],
    ARRAY['الصحة أولاً - راقب ضغطك في أي وقت','للأهل والوالدين - هدية بـ 5500 دج فقط','بديل جهاز الضغط التقليدي - أدق وأسهل'],
    ARRAY['[مقطع 15 ثانية] بابا شاف السوار وحبو بزّاف - يقيس الضغط والنبض في 10 ثواني','[مقطع 30 ثانية] واش رأيكم؟ سوار ذكي يقيس كلشي ويكلمك في الموبايل'],
    ARRAY['السلام عليكم، شحال من واحد يعاني من ضغط الدم؟ ها السوار الحل - يقيس ضغطك في أي وقت بلا ما تمشي للطبيب. التوصيل لباب الدار.'],
    ARRAY['غسول الوجه بالشاي الأخضر + سوار FitPulse','فيتامينات الشعر + السوار الصحي'],
    ARRAY['سوار + غسول وجه','سوار + كتاب التجميل'],
    true),
  (v_angle2_id, v_user_id, v_product2_id, v_signal2_id,
    ARRAY['تجميلك في يديك بـ 800 دج فقط!','وصفات الطبيعة أحسن من الكريما'],
    ARRAY['التجميل الطبيعي - وصفات بـ 200 دج','من المطبخ لوجهك - وصفات جزائرية','جمالك بدون ما تفرقي بزاف'],
    ARRAY['[مقطع 20 ثانية] بنت جزائرية توري الوصفة السحرية - مكونات من المطبخ ونتيجة خرافية','[مقطع 15 ثانية] ها الوصفة خلات وجهي كي البرتقال! المكونات بـ 200 دج'],
    ARRAY['بنتي الختية سولاتني شنّا السر، قلتلها: البرتقال والعسل! ها الكتاب فيه 15 وصفة مجربة. سعره 800 دج فقط.'],
    ARRAY['كتاب الوصفات + طين مغربي أصلي','كتاب + زيت أرغان'],
    ARRAY['كتاب + طين مغربي + فرشاة','كتاب + سيروم فيتامين C'],
    false),
  (v_angle3_id, v_user_id, v_product3_id, v_signal3_id,
    ARRAY['تعبتي من تساقط الشعر؟','الفيتامين اللي يخلّي شعرك يكبر في شهر'],
    ARRAY['حل تساقط الشعر بأكل الفيتامينات','شعرك يكبار مع BioHair','ماكملتي الشهر ولقيتي الفرق'],
    ARRAY['[مقطع 25 ثانية] بنت مسحت شعرها قدام الكاميرا قبل وبعد - فرق خرافي في شهر','[مقطع 15 ثانية] واش كليت باش شعرك كبر؟ ها الفيتامين السحري'],
    ARRAY['السلام عليكم، واش من مشكل تعاني في شعرك؟ تساقط؟ جفاف؟ ها الفيتامينات تحل المشكلة في شهر. التوصيل مجاني للعاصمة.'],
    ARRAY['فيتامينات الشعر + شامبو الأرغان','فيتامينات + سيروم الشعر'],
    ARRAY['عبوة شهر + شامبو','عبوة شهرين + سيروم + فرشاة'],
    true);

-- Campaigns
INSERT INTO public.campaigns (id, user_id, name, platform, product_id, angle_used, hook_used, launch_date, spend, messages, confirmed_orders, delivered_orders, cancellations, notes, status)
VALUES
  (v_campaign1_id, v_user_id, 'حملة السوار الذكي - ديسمبر 2025', 'facebook', v_product1_id, 'الصحة أولاً - راقب ضغطك في أي وقت', 'واش تعرف ضغطك دابا؟', '2025-12-01', 35000, 245, 42, 38, 4, 'أداء جيد. تكلفة التأكيد: 833 دج.', 'active'),
  (v_campaign2_id, v_user_id, 'حملة فيتامينات الشعر - يناير 2026', 'facebook', v_product3_id, 'شعرك يكبار مع BioHair', 'تعبتي من تساقط الشعر؟', '2026-01-10', 22000, 180, 28, 25, 3, 'أداء متوسط. تكلفة التأكيد: 785 دج.', 'active'),
  (v_campaign3_id, v_user_id, 'حملة كتاب التجميل - تجريبية', 'tiktok', v_product2_id, 'التجميل الطبيعي - وصفات بـ 200 دج', 'تجميلك في يديك بـ 800 دج فقط!', '2026-02-01', 15000, 320, 0, 0, 0, 'منتج رقمي - في الانتظار.', 'completed'),
  (v_campaign4_id, v_user_id, 'حملة المكنسة الروبوتية - مارس 2026', 'facebook', v_product4_id, 'المنزل الذكي - وفّر وقتك', 'المنزل يتنظف لوحده؟', '2026-03-01', 0, 0, 0, 0, 0, 'لم تبدأ بعد.', 'draft');

-- Campaign Metrics
INSERT INTO public.campaign_metrics (campaign_id, date, impressions, clicks, spend, messages, confirmed_orders, delivered_orders, cancellations)
VALUES
  (v_campaign1_id, '2025-12-01', 12000, 480, 3000, 22, 4, 0, 0),
  (v_campaign1_id, '2025-12-02', 15000, 620, 3500, 30, 5, 2, 0),
  (v_campaign1_id, '2025-12-03', 18000, 750, 4000, 38, 7, 5, 0),
  (v_campaign1_id, '2025-12-04', 14000, 580, 3200, 28, 5, 8, 1),
  (v_campaign1_id, '2025-12-05', 16000, 640, 3800, 32, 6, 10, 1),
  (v_campaign2_id, '2026-01-10', 10000, 400, 2500, 20, 3, 0, 0),
  (v_campaign2_id, '2026-01-11', 12000, 480, 3000, 24, 4, 2, 0),
  (v_campaign2_id, '2026-01-12', 14000, 560, 3500, 28, 5, 5, 0),
  (v_campaign2_id, '2026-01-13', 11000, 440, 2800, 22, 4, 6, 1);

-- Prompts
INSERT INTO public.prompts (user_id, title, content, category, is_favorite, usage_count)
VALUES
  (v_user_id, 'تحليل الإشارة - شكوى', 'أنت محلل ذكي للسوق الجزائري. قم بتحليل هذه الشكوى/الإشارة واستخرج: 1) نقطة الألم الرئيسية 2) الدافع الشرائي 3) الشريحة المستهدفة 4) منتجات مقترحة 5) تقييم الفرصة من 1-10.', 'analysis', true, 12),
  (v_user_id, 'كتابة بوست فيسبوك تسويقي', 'اكتب بوست فيسبوك تسويقي بالدارجة الجزائرية لمنتج: [اسم المنتج]. البوست يجب أن يحتوي: 1) مقدمة تجذب 2) وصف المنتج 3) السعر والمميزات 4) دعوة للعمل.', 'ad_copy', true, 8),
  (v_user_id, 'مراجعة منتج بالذكاء الاصطناعي', 'أنت خبير تقييم المنتجات في السوق الجزائري. قيّم: 1) نقاط القوة 2) نقاط الضعف 3) التوصيات 4) ملاءمة السوق من 1-10.', 'product_research', false, 5),
  (v_user_id, 'تحليل أداء الحملة الإعلانية', 'حلل أداء هذه الحملة: 1) تكلفة التأكيد 2) هامش الربح 3) معدل التحويل 4) نقاط القوة والضعف 5) التوصيات.', 'analysis', true, 6);

-- Knowledge Entries
INSERT INTO public.knowledge_entries (user_id, title, content, niche, tags, category, is_pinned)
VALUES
  (v_user_id, 'دليل التسعير في السوق الجزائري', 'قواعد التسعير: 1) تكلفة المنتج + التوصيل + تأكيد + إعلان = التكلفة الإجمالية 2) هامش الربح: 30-50% فيزيائي، 80-90% رقمي 3) تكلفة التأكيد: 500-1000 دج 4) السعر المثالي: 2000-8000 دج 5) التوصيل المجاني يزيد التحويل 40%.', 'عام', ARRAY['تسعير','استراتيجية'], 'strategy', true),
  (v_user_id, 'أنواع الحملات الإعلانية الناجحة', 'أنواع الحملات في الجزائر: 1) التثقيف 2) الإثبات الاجتماعي 3) العرض المحدود 4) المقارنة. أفضل الأوقات: الأربعاء والخميس مساءً، الجمعة بعد الصلاة.', 'تسويق', ARRAY['حملات','إعلانات'], 'marketing', true),
  (v_user_id, 'المنتجات الأكثر مبيعاً في الجزائر', 'الفئات الأكثر طلباً: 1) العناية بالشعر 2) الإلكترونيات 3) المنزل 4) التجميل 5) الصحة. الميزانية المتوسطة: 2000-5000 دج.', 'عام', ARRAY['منتجات','سوق'], 'strategy', true),
  (v_user_id, 'كيفاش نتعامل مع الإرجاعات', 'سياسة الإرجاع: 1) خلال 48 ساعة 2) المنتج غير مستعمل 3) الزبون يتحمل التكلفة إلا إذا عيب 4) استرجاع خلال 3-5 أيام 5) تسجيل كل إرجاع. نسبة الإرجاع: 8-12%.', 'عمليات', ARRAY['إرجاع','سياسة'], 'operations', false);

-- Tags
INSERT INTO public.tags (user_id, name, color)
VALUES
  (v_user_id, 'مهم', '#FF6B6B'),
  (v_user_id, 'صحة', '#4ECDC4'),
  (v_user_id, 'تجميل', '#FF69B4'),
  (v_user_id, 'منزل', '#45B7D1'),
  (v_user_id, 'إلكترونيات', '#96CEB4'),
  (v_user_id, 'فيسبوك', '#4267B2'),
  (v_user_id, 'تيك توك', '#000000');

END $$;
