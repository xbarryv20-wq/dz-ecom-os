import { NextResponse } from "next/server";
import { z } from "zod";
import { callDeepSeek } from "@/lib/ai/deepseek";
import { SIGNAL_ANALYSIS_PROMPT } from "@/lib/ai/prompts";

const SignalAnalysisInputSchema = z.object({
  signal: z.string().min(10, "Signal must be at least 10 characters"),
  context: z.string().optional(),
});

const SignalAnalysisOutputSchema = z.object({
  pain_point: z.string(),
  buying_motive: z.string(),
  target_persona: z.string(),
  suggested_products: z.array(z.string()),
  opportunity_score: z.number().min(1).max(10),
  explanation: z.string(),
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
    const parsed = SignalAnalysisInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { signal, context } = parsed.data;
    const userPrompt = context
      ? `إشارة السوق: ${signal}\nالسياق الإضافي: ${context}`
      : `إشارة السوق: ${signal}`;

    let rawResponse: string;
    try {
      rawResponse = await callDeepSeek<string>({
        systemPrompt: SIGNAL_ANALYSIS_PROMPT,
        userPrompt,
      });
    } catch (err) {
      console.error("DeepSeek API call failed:", err);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 503 }
      );
    }

    let analysis: z.infer<typeof SignalAnalysisOutputSchema>;
    try {
      analysis = parseAIResponse<z.infer<typeof SignalAnalysisOutputSchema>>(rawResponse);
    } catch {
      try {
        rawResponse = await callDeepSeek<string>({
          systemPrompt: SIGNAL_ANALYSIS_PROMPT + "\n\nمهم جداً: أجب فقط بكائن JSON صالح بدون أي نص إضافي.",
          userPrompt,
        });
        analysis = parseAIResponse<z.infer<typeof SignalAnalysisOutputSchema>>(rawResponse);
      } catch (retryErr) {
        console.error("Failed to parse AI response after retry:", retryErr);
        return NextResponse.json(
          { error: "AI returned invalid response, please try again" },
          { status: 502 }
        );
      }
    }

    const validated = SignalAnalysisOutputSchema.safeParse(analysis);
    if (!validated.success) {
      console.error("AI response validation failed:", validated.error);
      return NextResponse.json(
        { error: "AI response did not match expected format" },
        { status: 502 }
      );
    }

    return NextResponse.json({ data: validated.data });
  } catch (err) {
    console.error("Signal analysis error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
