import { supabase } from "../lib/supabase"

const isUuid = (val) => typeof val === "string" && /^[0-9a-fA-F-]{36}$/.test(val)

class SavedOutfit {
  static async create(data) {
    const payload = {
      user_id: isUuid(data.user_id) ? data.user_id : null,
      outfit_id: data.outfit_id,
      is_liked: !!data.is_liked,
      is_saved: !!data.is_saved,
    }

    const { data: inserted, error } = await supabase
      .from("saved_outfits")
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error("[SavedOutfit.create]", error)
      throw error
    }

    return inserted
  }

  static async update(id, data) {
    const { data: updated, error } = await supabase
      .from("saved_outfits")
      .update({
        is_liked: data.is_liked,
        is_saved: data.is_saved,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[SavedOutfit.update]", error)
      throw error
    }

    return updated
  }

  static async filter(criteria = {}) {
    let query = supabase.from("saved_outfits").select("*")

    if (criteria.user_id && isUuid(criteria.user_id)) {
      query = query.eq("user_id", criteria.user_id)
    }
    if (criteria.outfit_id) {
      query = query.eq("outfit_id", criteria.outfit_id)
    }

    const { data: rows, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("[SavedOutfit.filter]", error)
      throw error
    }

    return rows || []
  }
}

export { SavedOutfit }
