import { NextResponse } from "next/server";
import { CRO_AUDIT_PROMPT } from "@/lib/ai/prompts";

export async function POST(request: Request) {
  try {
    const { productName, productDescription, price, url } = await request.json();

    if (!productName || !productDescription) {
      return NextResponse.json({ error: "Product name and description are required" }, { status: 400 });
    }

    const userPrompt = `Product: ${productName}\nDescription: ${productDescription}\nPrice: ${price || "N/A"}\nURL: ${url || "N/A"}\n\nPlease audit this product page for conversion optimization.`;

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${deepseekKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: CRO_AUDIT_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    let result;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("CRO audit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
