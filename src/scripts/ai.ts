/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const MODEL = "gemini-2.5-flash";
const MAX_OUTPUT_TOKENS = 2200;
const MAX_PASSES = 3;
const END_MARK = "<!-- END_OF_README -->";

const genAI = new GoogleGenerativeAI(API_KEY);

async function* streamOnce(prompt: string) {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.2 },
  });

  const stream = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  for await (const chunk of stream.stream) {
    const text = chunk.text(); // ✅ incremental delta
    if (text) yield text;
    if (text) console.log();
  }
}

export async function* streamReadmeWithContinuation(initialPrompt: string) {
  let acc = "";
  let pass = 0;

  while (pass < MAX_PASSES) {
    pass++;

    const prompt =
      pass === 1
        ? initialPrompt
        : [
            "Continue the SAME README from exactly where you left off.",
            "Do NOT repeat any text already written.",
            `End by emitting ${END_MARK} once.`,
            "Tail:",
            "```markdown",
            acc.slice(Math.max(0, acc.length - 1200)),
            "```",
          ].join("\n");

    for await (const chunk of streamOnce(prompt)) {
      acc += chunk;
      yield chunk;
      if (acc.includes(END_MARK)) return;
    }

    if (acc.includes(END_MARK)) return;
  }
}
