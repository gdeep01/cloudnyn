// Gemini Prescriptive Analysis Service
// Uses Google Generative Language API to produce prescriptive recommendations

import { AnalyticsData } from "./analyticsService";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-1.5-flash";

export interface GeminiPrescription {
  summary: string;
  nextActions: string[];
  weeklyPlan: Array<{
    day: string;
    time: string;
    contentType: string;
    idea: string;
    hashtags: string[];
  }>;
}

export async function generatePrescriptionsWithGemini(
  analytics: AnalyticsData,
  platform: "instagram" | "youtube"
): Promise<GeminiPrescription | null> {
  if (!GEMINI_API_KEY) return null;

  const prompt = `You are a social media growth strategist. Given analytics for ${platform}, propose a concise action plan.

Analytics JSON:
${JSON.stringify(analytics, null, 2)}

Return JSON with keys: summary (string), nextActions (array of 6 imperative bullets), weeklyPlan (7 items; each with day, time, contentType, idea, hashtags as array of 3).`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  } as const;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.warn("Gemini API call failed", await res.text());
    return null;
  }

  const data = (await res.json()) as any;
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  // Try to parse JSON from the model output
  const match = text.match(/\{[\s\S]*\}$/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    return parsed as GeminiPrescription;
  } catch {
    return null;
  }
}


