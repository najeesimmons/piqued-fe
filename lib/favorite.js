import { supabase } from "./supabase";

export async function getFavorites(start, end) {
  const {
    data: favorites,
    count,
    error,
  } = await supabase
    .from("favorite")
    .select("*", { count: "exact" })
    .range(start, end);
  if (error) {
    console.error(error.message);
    return null;
  } else {
    console.log("favorites:", favorites, "count:", count);
    return { favorites, count };
  }
}

export async function toggleFavorite({ pexel_id, url }) {
  const { data: existingFavorite, error: fetchError } = await supabase
    .from("favorite")
    .select("id")
    .eq("pexel_id", pexel_id);

  if (fetchError) {
    console.error(
      "Error checking whether photo is already favorited:",
      fetchError
    );
  } else if (existingFavorite.length > 0) {
    const { error: deleteError } = await supabase
      .from("favorite")
      .delete()
      .eq("pexel_id", pexel_id);

    if (deleteError)
      console.error("Error deleting existing favorite:", deleteError);
    else console.log("Existing favorite successfully removed.");
  } else {
    const { error: insertError } = await supabase
      .from("favorite")
      .insert({ pexel_id, url });

    if (insertError) console.error("Error adding new favorite:", insertError);
    else console.log("New favorite successfully added.");
  }
}
