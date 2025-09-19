import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini client using Vite env var
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
let genAI = null

if (!API_KEY) {
  console.warn("[Gemini] Missing VITE_GEMINI_API_KEY in .env. Falling back to mock responses.")
} else {
  try {
    genAI = new GoogleGenerativeAI(API_KEY)
  } catch (e) {
    console.error("[Gemini] Failed to init client:", e)
  }
}

function extractJson(text) {
  try {
    // Clean code fences if present
    const cleaned = text
      .replace(/^```(json)?/i, "")
      .replace(/```$/i, "")
      .trim()
    return JSON.parse(cleaned)
  } catch (e) {
    // Best effort: find first JSON object in text
    const match = text.match(/\{[\s\S]*\}/)
    if (match) {
      try { return JSON.parse(match[0]) } catch {}
    }
    throw e
  }
}

export async function InvokeLLM({ prompt, response_json_schema }) {
  // If no API key, return a stable mock for dev
  if (!genAI) {
    return {
      title: "Perfect Weather Outfit",
      description: "A stylish and comfortable outfit perfect for today's weather",
      pieces: [
        { category: "Top", item: "Lightweight Blouse", color: "Soft Pink" },
        { category: "Bottom", item: "High-Waisted Jeans", color: "Medium Blue" },
        { category: "Shoes", item: "Comfortable Sneakers", color: "White" },
        { category: "Accessories", item: "Delicate Necklace", color: "Gold" }
      ],
      style_tags: ["casual", "comfortable", "weather-appropriate"],
      why_this_outfit: "This outfit combines comfort with style, perfect for the current weather conditions and your personal preferences."
    }
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const systemInstructions = `You are a fashion stylist. Always respond ONLY with a compact JSON object that matches this TypeScript type (no extra text):\n${JSON.stringify(response_json_schema || {}, null, 2)}\nKeys: title, description, pieces[{category,item,color?}], style_tags[], why_this_outfit.`

  const result = await model.generateContent({
    contents: [
      { role: "user", parts: [{ text: systemInstructions + "\n\nUser request:\n" + prompt }] }
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 512,
      responseMimeType: "application/json"
    }
  })

  const text = result?.response?.text?.() ?? "{}"
  try {
    const json = extractJson(text)
    return json
  } catch (e) {
    console.warn("[Gemini] Could not parse JSON, returning fallback. Raw:", text)
    return {
      title: "Stylish Daily Look",
      description: "A cohesive look tailored to your preferences and today's weather.",
      pieces: [
        { category: "Top", item: "Crewneck Tee", color: "White" },
        { category: "Bottom", item: "Relaxed Chinos", color: "Khaki" },
        { category: "Shoes", item: "Minimal Sneakers", color: "White" }
      ],
      style_tags: ["minimal", "casual"],
      why_this_outfit: "Balanced comfort and style for the conditions."
    }
  }
}

// In src/integrations/Core.js, update the GenerateImage function:
export async function GenerateImage({ prompt }) {
  console.log("[ImageGen] prompt:", prompt);
  // Using a more reliable placeholder service
  return {
    url: "https://placehold.co/600x800/ff6b9d/ffffff/png?text=Outfit+Image"
  };
}
