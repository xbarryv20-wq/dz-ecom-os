const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

export async function callOpenRouter<T>(options: {
  model?: string;
  systemPrompt: string;
  userPrompt: string;
  responseFormat?: { type: "json_object" };
}): Promise<T> {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://dz-ecom-os.vercel.app",
      "X-Title": "DZ Ecom OS",
    },
    body: JSON.stringify({
      model: options.model || "minimax/minimax-m2.5",
      messages: [
        { role: "system", content: options.systemPrompt },
        { role: "user", content: options.userPrompt },
      ],
      response_format: options.responseFormat,
      temperature: 0.7,
      max_tokens: 8192,
    }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${error}`);
  }
  const data = await response.json();
  return data.choices[0].message.content as T;
}
