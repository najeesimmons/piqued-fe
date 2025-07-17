import { supabase } from "../supabase/supabase";

export async function checkFavoritesArray(photos, userId) {
  if (!userId) return photos;

  const photoIds = photos.map((p) => p.pexels_id); //array of pexel ids
  const { data: favorites } = await supabase
    .from("favorite")
    .select("pexels_id")
    .eq("user_id", userId)
    .in("pexels_id", photoIds); //get pexel ids for user with mathcng pexelsids

  const favoriteSet = new Set((favorites || []).map((f) => f.pexels_id));

  return photos.map((photo) => ({
    ...photo,
    isFavorited: favoriteSet.has(photo.pexels_id),
  }));
}

export async function checkFavoriteSingle(photo, userId) {
  if (!userId) return { ...photo, isFavorited: false };

  const { data } = await supabase
    .from("favorites")
    .select("pexels_id")
    .eq("user_id", userId)
    .eq("pexels_id", photo.pexels_id)
    .limit(1)
    .maybeSingle();

  return { ...photo, isFavorited: !!data };
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
