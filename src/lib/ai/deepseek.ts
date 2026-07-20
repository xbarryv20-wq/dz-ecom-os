const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";

export async function callDeepSeek<T>(options: {
  systemPrompt: string;
  userPrompt: string;
  responseFormat?: { type: "json_object" };
}): Promise<T> {
  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: options.systemPrompt },
        { role: "user", content: options.userPrompt },
      ],
      response_format: options.responseFormat || { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} ${error}`);
  }
  const data = await response.json();
  return data.choices[0].message.content as T;
}
