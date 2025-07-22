import { supabase } from "../supabase/supabase";

export async function getFavorites(start, end) {
  const {
    data: asFetchedFavorites,
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
    const favorites = asFetchedFavorites.map((asFetchedFavorite) => ({
      ...asFetchedFavorite,
      isFavorited: true,
    }));
    return { favorites, count };
  }
}

export async function toggleFavorite(photo) {
  const {
    pexels_id,
    width,
    height,
    url,
    photographer,
    photographer_url,
    photographer_id,
    avg_color,
    src,
    alt,
  } = photo;
  const { data: existingFavorite, error: fetchError } = await supabase
    .from("favorite")
    .select("id")
    .eq("pexels_id", pexels_id);

  if (fetchError) {
    console.error(
      "Error checking whether photo is already favorited:",
      fetchError
    );
    return fetchError;
  } else if (existingFavorite.length > 0) {
    const { error: deleteError } = await supabase
      .from("favorite")
      .delete()
      .eq("pexels_id", pexels_id);

    if (deleteError) {
      console.error("Error deleting existing favorite:", deleteError);
      return deleteError;
    } else {
      return { action: "remove", success: true };
    }
  } else {
    const { error: insertError } = await supabase.from("favorite").insert({
      pexels_id,
      width,
      height,
      url,
      photographer,
      photographer_url,
      photographer_id,
      avg_color,
      src,
      alt,
    });

    if (insertError) {
      console.error("Error adding new favorite:", insertError);
      return insertError;
    } else {
      return { action: "insert", success: true };
    }
  }
}
