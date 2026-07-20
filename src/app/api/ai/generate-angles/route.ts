import { NextResponse } from "next/server";
import { z } from "zod";
import { callOpenRouter } from "@/lib/ai/openrouter";
import { ANGLE_GENERATION_PROMPT } from "@/lib/ai/prompts";

const AngleGenerationInputSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_description: z.string().min(10, "Product description must be at least 10 characters"),
  price_dzd: z.number().positive("Price must be positive"),
  target_audience: z.string().optional(),
  style: z.enum(["sarcastic", "emotional", "humorous", "professional", "casual"]).optional(),
  platform_focus: z.array(z.enum(["tiktok", "facebook", "instagram"])).optional(),
});

const AngleGenerationOutputSchema = z.object({
  hooks: z.array(z.string()).min(10),
  angles: z.array(z.string()).min(5),
  tiktok_scripts: z.array(z.string()).min(3),
  facebook_posts: z.array(z.string()).min(2),
  upsell_ideas: z.array(z.string()).min(3),
  bundle_ideas: z.array(z.string()).min(3),
});

function parseAIResponse<T>(raw: string): T {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in AI response");
  }
  return JSON.parse(jsonMatch[0]) as T;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = AngleGenerationInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { product_name, product_description, price_dzd, target_audience, style, platform_focus } = parsed.data;

    let userPrompt = `اسم المنتج: ${product_name}\nوصف المنتج: ${product_description}\nالسعر بالدينار الجزائري: ${price_dzd} دج`;
    if (target_audience) userPrompt += `\nالجمهور المستهدف: ${target_audience}`;
    if (style) userPrompt += `\nالأسلوب المطلوب: ${style}`;
    if (platform_focus?.length) userPrompt += `\nالمنصات المستهدفة: ${platform_focus.join(", ")}`;

    let rawResponse: string;
    try {
      rawResponse = await callOpenRouter<string>({
        systemPrompt: ANGLE_GENERATION_PROMPT,
        userPrompt,
        responseFormat: { type: "json_object" },
      });
    } catch (err) {
      console.error("OpenRouter API call failed:", err);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 503 }
      );
    }

    let angles: z.infer<typeof AngleGenerationOutputSchema>;
    try {
      angles = parseAIResponse<z.infer<typeof AngleGenerationOutputSchema>>(rawResponse);
    } catch {
      try {
        rawResponse = await callOpenRouter<string>({
          systemPrompt: ANGLE_GENERATION_PROMPT + "\n\nمهم جداً: أجب فقط بكائن JSON صالح بدون أي نص إضافي.",
          userPrompt,
          responseFormat: { type: "json_object" },
        });
        angles = parseAIResponse<z.infer<typeof AngleGenerationOutputSchema>>(rawResponse);
      } catch (retryErr) {
        console.error("Failed to parse AI response after retry:", retryErr);
        return NextResponse.json(
          { error: "AI returned invalid response, please try again" },
          { status: 502 }
        );
      }
    }

    const validated = AngleGenerationOutputSchema.safeParse(angles);
    if (!validated.success) {
      console.error("AI response validation failed:", validated.error);
      return NextResponse.json(
        { error: "AI response did not match expected format" },
        { status: 502 }
      );
    }

    return NextResponse.json({ data: validated.data });
  } catch (err) {
    console.error("Angle generation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
