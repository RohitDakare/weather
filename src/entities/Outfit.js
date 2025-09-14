// Mock Outfit entity for development
class Outfit {
  static async create(data) {
    // Mock outfit creation
    const outfit = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString()
    };
    console.log("Mock outfit created:", outfit);
    return outfit;
  }

  static async find(id) {
    // Mock outfit retrieval
    return {
      id: parseInt(id),
      title: "Sample Outfit",
      description: "A beautiful outfit for today",
      pieces: [
        { category: "Top", item: "Blouse", color: "Pink" },
        { category: "Bottom", item: "Jeans", color: "Blue" },
        { category: "Shoes", item: "Sneakers", color: "White" }
      ],
      style_tags: ["casual", "comfortable"],
      why_this_outfit: "Perfect for the weather and your style",
      image_url: "https://via.placeholder.com/300x400"
    };
  }
}

export { Outfit };
