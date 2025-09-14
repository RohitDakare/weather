// Mock Core integrations for development
export async function InvokeLLM({ prompt, response_json_schema }) {
  // Mock LLM response
  console.log("Mock LLM prompt:", prompt);
  
  // Return mock outfit data
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
  };
}

export async function GenerateImage({ prompt }) {
  // Mock image generation
  console.log("Mock image generation prompt:", prompt);
  
  // Return a placeholder image URL
  return {
    url: "https://via.placeholder.com/300x400/ff6b9d/ffffff?text=Outfit+Image"
  };
}
