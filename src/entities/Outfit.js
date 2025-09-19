import { supabase } from "../lib/supabase"

class Outfit {
  static async create(data) {
    // Maps expected fields to the DB schema in README: public.outfits
    const payload = {
      title: data.title ?? "",
      description: data.description ?? null,
      pieces: data.pieces ?? [],
      style_tags: data.style_tags ?? [],
      why_this_outfit: data.why_this_outfit ?? null,
      weather_condition: data.weather_condition ?? null,
      temperature_range: data.temperature_range ?? null,
      occasion: data.occasion ?? null,
      image_url: data.image_url ?? null,
    }

    const { data: inserted, error } = await supabase
      .from("outfits")
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error("[Outfit.create]", error)
      throw error
    }

    return inserted
  }

  static async find(id) {
    const { data: row, error } = await supabase
      .from("outfits")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("[Outfit.find]", error)
      throw error
    }

    return row
  }

  static async get(id) {
    return this.find(id)
  }
}

export { Outfit }
