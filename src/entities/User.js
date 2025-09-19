// src/entities/User.js
import { supabase } from '../lib/supabase'; // Make sure this path is correct

class User {
  static async me() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session?.user || null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  static async login() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google' // or other providers as needed
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  static async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  static async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  static async updateMyUserData(data) {
    try {
      const { data: updatedUser, error } = await supabase.auth.updateUser({
        data: data
      });
      if (error) throw error;
      return updatedUser;
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }

  // Add other methods as needed
}

export { User };