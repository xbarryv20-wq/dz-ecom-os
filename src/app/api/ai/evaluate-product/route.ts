import { NextResponse } from "next/server";
import { z } from "zod";
import { callDeepSeek } from "@/lib/ai/deepseek";
import { PRODUCT_EVALUATION_PROMPT } from "@/lib/ai/prompts";

const ProductEvaluationInputSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_description: z.string().min(10, "Product description must be at least 10 characters"),
  price_dzd: z.number().positive("Price must be positive"),
  category: z.string().optional(),
  target_audience: z.string().optional(),
  competitors: z.array(z.string()).optional(),
});

const ProductEvaluationOutputSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
  market_fit_score: z.number().min(1).max(10),
  explanation: z.string(),
  upsell_ideas: z.array(z.string()),
  angle_ideas: z.array(z.string()),
  operational_complexity: z.enum(["منخفض", "متوسط", "مرتفع"]),
  recommendation: z.enum(["test", "avoid", "improve"]),
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
    const parsed = ProductEvaluationInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { product_name, product_description, price_dzd, category, target_audience, competitors } = parsed.data;

    let userPrompt = `اسم المنتج: ${product_name}\nوصف المنتج: ${product_description}\nالسعر بالدينار الجزائري: ${price_dzd} دج`;
    if (category) userPrompt += `\nالفئة: ${category}`;
    if (target_audience) userPrompt += `\nالجمهور المستهدف: ${target_audience}`;
    if (competitors?.length) userPrompt += `\nالمنافسون: ${competitors.join(", ")}`;

    let rawResponse: string;
    try {
      rawResponse = await callDeepSeek<string>({
        systemPrompt: PRODUCT_EVALUATION_PROMPT,
        userPrompt,
      });
    } catch (err) {
      console.error("DeepSeek API call failed:", err);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 503 }
      );
    }

    let evaluation: z.infer<typeof ProductEvaluationOutputSchema>;
    try {
      evaluation = parseAIResponse<z.infer<typeof ProductEvaluationOutputSchema>>(rawResponse);
    } catch {
      try {
        rawResponse = await callDeepSeek<string>({
          systemPrompt: PRODUCT_EVALUATION_PROMPT + "\n\nمهم جداً: أجب فقط بكائن JSON صالح بدون أي نص إضافي.",
          userPrompt,
        });
        evaluation = parseAIResponse<z.infer<typeof ProductEvaluationOutputSchema>>(rawResponse);
      } catch (retryErr) {
        console.error("Failed to parse AI response after retry:", retryErr);
        return NextResponse.json(
          { error: "AI returned invalid response, please try again" },
          { status: 502 }
        );
      }
    }

    const validated = ProductEvaluationOutputSchema.safeParse(evaluation);
    if (!validated.success) {
      console.error("AI response validation failed:", validated.error);
      return NextResponse.json(
        { error: "AI response did not match expected format" },
        { status: 502 }
      );
    }

    return NextResponse.json({ data: validated.data });
  } catch (err) {
    console.error("Product evaluation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
