import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { content, tone, length } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY" },
        { status: 501 },
      );
    }

    const system =
      "You are a professional Notion-style editor. Transform the text content to be more polished, engaging, and well-structured like a high-quality Notion document. Preserve the exact JSON structure and only modify text in 'content' fields. Make the content more readable, professional, and visually appealing with better headings, bullet points, and flow. CRITICAL: Return ONLY the improved JSON object, no explanations, no markdown, no additional text.";

    const parsedContent =
      typeof content === "string" ? JSON.parse(content) : content;

    const userPrompt = `Transform this content into a polished Notion-style document:

${JSON.stringify(parsedContent, null, 2)}

Instructions:
- Improve readability and flow
- Add proper headings and structure
- Enhance bullet points and lists
- Make text more engaging and professional
- Keep all formatting, links, and media intact
- Use Notion-style formatting conventions

IMPORTANT: Return ONLY the JSON object, no explanations or additional text.`;

    const model = process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free";

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
        "X-Title": "Zotion Rewrite",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json(
        { error: err || "OpenRouter error" },
        { status: 502 },
      );
    }
    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content?.trim();
    if (!raw) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 502 });
    }
    let rewritten;
    try {
      // First try to parse the raw response directly
      rewritten = JSON.parse(raw);
    } catch (e) {
      // If that fails, try to extract JSON from the response
      let jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          rewritten = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          // If still failing, try to find the first complete JSON object
          const lines = raw.split("\n");
          let jsonStart = -1;
          let jsonEnd = -1;
          let braceCount = 0;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes("{") && jsonStart === -1) {
              jsonStart = i;
            }
            if (jsonStart !== -1) {
              braceCount += (line.match(/\{/g) || []).length;
              braceCount -= (line.match(/\}/g) || []).length;
              if (braceCount === 0 && jsonStart !== -1) {
                jsonEnd = i;
                break;
              }
            }
          }

          if (jsonStart !== -1 && jsonEnd !== -1) {
            const jsonLines = lines.slice(jsonStart, jsonEnd + 1);
            const jsonString = jsonLines.join("\n");
            rewritten = JSON.parse(jsonString);
          } else {
            throw new Error("Could not extract valid JSON from AI response");
          }
        }
      } else {
        throw new Error("No JSON found in AI response");
      }
    }
    return NextResponse.json({ content: rewritten });
  } catch (err: any) {
    if (err.name === "AbortError") {
      return NextResponse.json(
        { error: "Rewrite request timed out. Please try again." },
        { status: 408 },
      );
    }
    const status = err?.status || 500;
    return NextResponse.json(
      { error: err?.message || "Failed to rewrite content" },
      { status },
    );
  }
}
