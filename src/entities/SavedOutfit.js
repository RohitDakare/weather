// Mock SavedOutfit entity for development
class SavedOutfit {
  static async create(data) {
    // Mock saved outfit creation
    const savedOutfit = {
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString()
    };
    console.log("Mock saved outfit created:", savedOutfit);
    return savedOutfit;
  }

  static async update(id, data) {
    // Mock saved outfit update
    console.log("Mock saved outfit updated:", id, data);
    return { ...data, id };
  }

  static async filter(criteria) {
    // Mock saved outfit filtering
    return [];
  }
}

export { SavedOutfit };
