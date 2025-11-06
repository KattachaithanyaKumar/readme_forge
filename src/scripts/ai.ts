/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getKeysFromStore } from "../scripts/keys";

const MODEL = "gemini-2.5-flash";
const MAX_OUTPUT_TOKENS = 2200;
const MAX_PASSES = 3;

// accept literal, hex-escaped, and HTML-escaped markers
const END_MARK = "<!-- END_OF_README -->";
const END_RE =
  /<!-- END_OF_README -->|\\x3C!-- END_OF_README -->|&lt;!-- END_OF_README --&gt;/;

/** Return only the new suffix of `next` after the longest common prefix with `prev`. */
function suffixAfterCommonPrefix(prev: string, next: string) {
  let i = 0;
  const limit = Math.min(prev.length, next.length);
  while (i < limit && prev.charCodeAt(i) === next.charCodeAt(i)) i++;
  return next.slice(i);
}

/** Safely merge streamed `seen` and final snapshot without losing the prefix. */
function mergeSeenAndFinal(seen: string, finalFull: string) {
  if (!finalFull) return seen;
  if (!seen) return finalFull;
  if (finalFull.startsWith(seen)) return finalFull;
  if (seen.startsWith(finalFull)) return seen;

  // stitch by maximal suffix/prefix overlap
  const max = Math.min(seen.length, finalFull.length);
  for (let k = max; k > 0; k--) {
    if (seen.slice(-k) === finalFull.slice(0, k)) {
      return seen + finalFull.slice(k);
    }
  }
  // no overlap: keep the longer (more complete)
  return seen.length >= finalFull.length ? seen : finalFull;
}

// ── stream a single pass; yields ONLY deltas (safe for prev += delta) ───────────
async function* streamOnce(prompt: string): AsyncGenerator<string> {
  const { apiKey } = getKeysFromStore();
  if (!apiKey) {
    throw new Error(
      "No API key found. Add one in Settings or set VITE_GEMINI_API_KEY."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS, temperature: 0.2 },
  });

  const stream = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  let seen = "";

  try {
    for await (const chunk of (stream as any).stream) {
      const raw = chunk?.text?.() ?? "";
      if (!raw) continue;

      const delta = suffixAfterCommonPrefix(seen, raw);
      if (delta) {
        seen += delta;
        yield delta; // ✅ only the new part: safe to append
      }
    }
  } finally {
    // reconcile with final snapshot (sometimes partial)
    try {
      const final = await (stream as any).response;
      const finalFull = final?.text?.() ?? "";

      const merged = mergeSeenAndFinal(seen, finalFull);
      if (merged.length > seen.length) {
        yield merged.slice(seen.length); // only the missing tail
      }
    } catch {
      /* ignore; we already streamed best-effort */
    }
  }
}

// ── multi-pass continuation orchestrator; still yields ONLY deltas ─────────────
export async function* streamReadmeWithContinuation(
  initialPrompt: string
): AsyncGenerator<string> {
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

    for await (const delta of streamOnce(prompt)) {
      acc += delta; // track full text locally
      yield delta; // ✅ UI can do prev += delta

      if (END_RE.test(acc)) return; // stop if end marker seen
    }

    if (END_RE.test(acc)) return;
  }
}
