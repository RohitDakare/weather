// import Gemini AI client
import { GoogleGenerativeAI } from "@google/generative-ai";
// import OpenAI client
import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

let genAI = null;
let openai = null;

// Fallback outfit data when API is unavailable
const FALLBACK_OUTFIT = {
  title: "Stylish Fallback Outfit",
  description: "A fashionable and comfortable outfit for any occasion",
  pieces: [
    { category: "Top", item: "Classic White T-Shirt", color: "White" },
    { category: "Bottom", item: "Tailored Chinos", color: "Navy Blue" },
    { category: "Shoes", item: "Leather Sneakers", color: "White" },
    { category: "Accessories", item: "Minimalist Watch", color: "Silver" }
  ],
  style_tags: ["casual", "versatile", "timeless"],
  why_this_outfit: "This outfit is a reliable choice that works for various occasions and weather conditions."
};

// Initialize Gemini AI
if (!API_KEY) {
  console.warn("[Gemini] Missing VITE_GEMINI_API_KEY in .env. Falling back to fallback responses.");
} else {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    console.log("[Gemini] Client initialized successfully");
  } catch (e) {
    console.error("[Gemini] Failed to init client:", e);
  }
}

// Initialize OpenAI
if (!OPENAI_API_KEY) {
  console.warn("[OpenAI] Missing VITE_OPENAI_API_KEY in .env. Image generation will fallback to placeholder.");
} else {
  try {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    console.log("[OpenAI] Client initialized successfully");
  } catch (e) {
    console.error("[OpenAI] Failed to init client:", e);
  }
}

// Simple cache to store successful responses
const responseCache = new Map();

// Function to extract JSON from response text
function extractJson(text) {
  try {
    // Clean code fences if present
    const cleaned = text
      .replace(/^```(json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (e) {
    // Best effort: find first JSON object in text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try { 
        return JSON.parse(match[0]); 
      } catch (e) {
        console.error("Failed to parse JSON from response:", e);
      }
    }
    throw new Error("Could not extract JSON from response");
  }
}

// Function to get a cached response if available
function getCachedResponse(prompt) {
  const cacheKey = prompt.substring(0, 100); // Use first 100 chars as cache key
  return responseCache.get(cacheKey);
}

// Function to cache a successful response
function cacheResponse(prompt, response) {
  const cacheKey = prompt.substring(0, 100);
  responseCache.set(cacheKey, response);
  return response;
}

export async function InvokeLLM({ prompt, response_json_schema }) {
  // If no API key, return fallback
  if (!genAI) {
    console.warn("[Gemini] No API key provided. Using fallback outfit.");
    return FALLBACK_OUTFIT;
  }

  try {
    // Check cache first
    const cachedResponse = getCachedResponse(prompt);
    if (cachedResponse) {
      console.log("[Gemini] Using cached response");
      return cachedResponse;
    }

    // If not in cache, make API request
    console.log("[Gemini] Making API request");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const systemInstructions = `You are a fashion stylist. Always respond ONLY with a compact JSON object that matches this TypeScript type (no extra text):\n${JSON.stringify(response_json_schema || {}, null, 2)}\nKeys: title, description, pieces[{category,item,color?}], style_tags[], why_this_outfit.`;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemInstructions + "\n\nUser request:\n" + prompt }] }
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 512,
        responseMimeType: "application/json"
      }
    });

    const response = await result.response;
    const text = response.text();
    const jsonResponse = extractJson(text);
    
    // Cache the successful response
    cacheResponse(prompt, jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error("[Gemini] API Error:", error);
    
    // If rate limited, return fallback instead of throwing
    if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('limit')) {
      console.warn("[Gemini] Rate limited - Using fallback outfit");
      return FALLBACK_OUTFIT;
    }
    
    // For other errors, try to use cache if available
    const cachedResponse = getCachedResponse(prompt);
    if (cachedResponse) {
      console.warn("[Gemini] Using cached response after error");
      return cachedResponse;
    }
    
    // If no cache, return fallback
    console.warn("[Gemini] No cached response available, using fallback outfit");
    return FALLBACK_OUTFIT;
  }
}

export async function GenerateImage({ prompt }) {
  console.log("[ImageGen] prompt:", prompt);
  // Use Pexels API for image search
  if (PEXELS_API_KEY) {
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(prompt)}&per_page=1`, {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const url = data.photos[0].src.medium;
          return { url };
        }
      } else {
        console.error("[Pexels] API response error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("[Pexels] Image generation error:", error);
    }
  }

  // Fallback to OpenAI image generation if available
  const fallbackImages = [
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=512&q=80",
    "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=512&q=80",
    "https://images.unsplash.com/photo-1495121605193-b116b5b09a6c?auto=format&fit=crop&w=512&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=512&q=80"
  ];

  if (openai) {
    try {
      const response = await openai.images.generate({
        prompt,
        size: "512x512",
        n: 1
      });
      const url = response.data[0].url;
      return { url };
    } catch (error) {
      console.error("[OpenAI] Image generation error:", error);
      // Return a random fallback image on error
      const randomIndex = Math.floor(Math.random() * fallbackImages.length);
      return { url: fallbackImages[randomIndex] };
    }
  }

  // If no OpenAI client, return a random fallback image
  const randomIndex = Math.floor(Math.random() * fallbackImages.length);
  return { url: fallbackImages[randomIndex] };
}
