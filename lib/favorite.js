import { supabase } from "./supabase";

export async function addFavorite({ pexel_id, url }) {
  const { data, error } = await supabase
    .from("favorite")
    .insert([{ pexel_id, url }]);

  if (error) {
    console.error("Failed to add favorite:", error.message);
    return null;
  }

  return data;
}
