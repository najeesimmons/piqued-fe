import { supabase } from "./supabase";

export async function toggleFavorite({ pexel_id, url }) {
  const response = await supabase.from("favorite").insert([{ pexel_id, url }]);

  if (response.error) {
    console.error(response.error);
    return null;
  }
  return response;
}
