import { supabase } from "../supabase";

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
