// Test script to verify Gemini API connection
import { GoogleGenerativeAI } from "@google/generative-ai";

// Get the API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function testGeminiConnection() {
  if (!API_KEY) {
    console.error("Error: VITE_GEMINI_API_KEY is not set in .env file");
    return;
  }

  try {
    console.log("Testing Gemini API connection...");
    
    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    
    // Make a simple test request
    const prompt = "Say 'Connection test successful' in a creative way";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ Gemini API Connection Successful!");
    console.log("Response:", text);
  } catch (error) {
    console.error("❌ Gemini API Connection Failed:", error.message);
    if (error.response) {
      console.error("Error details:", error.response);
    }
  }
}

testGeminiConnection();
