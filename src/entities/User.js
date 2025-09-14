// Mock User entity for development
class User {
  static async me() {
    // Mock user data
    return {
      id: 1,
      name: "Demo User",
      age: 25,
      style_preferences: ["casual", "bohemian"],
      body_type: "hourglass",
      color_preferences: ["pink", "purple", "blue"],
      lifestyle: "active"
    };
  }

  static async login() {
    // Mock login - in real app this would handle authentication
    console.log("Mock login successful");
    return { success: true };
  }

  static async updateMyUserData(data) {
    // Mock update - in real app this would save to backend
    console.log("Mock user data update:", data);
    return { success: true };
  }
}

export { User };
