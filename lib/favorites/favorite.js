import { supabase } from "../supabase";

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
  console.log(photo);
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
  console.log(pexels_id);
  const { data: existingFavorite, error: fetchError } = await supabase
    .from("favorite")
    .select("id")
    .eq("pexels_id", pexels_id);

  if (fetchError) {
    console.error(
      "Error checking whether photo is already favorited:",
      fetchError
    );
  } else if (existingFavorite.length > 0) {
    const { error: deleteError } = await supabase
      .from("favorite")
      .delete()
      .eq("pexels_id", pexels_id);

    if (deleteError)
      console.error("Error deleting existing favorite:", deleteError);
    else {
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

    if (insertError) console.error("Error adding new favorite:", insertError);
    else {
      return { action: "insert", success: true };
    }
  }
}
