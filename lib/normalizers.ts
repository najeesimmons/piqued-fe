import { supabase } from "./supabase/supabase";
import type { NormalizedPhotoGet } from "./pexels/types";
import type { PexelsPhotoGet } from "./pexels/types";
import type { FavoritePhotoGet } from "./favorite/types";

export function normalizePexelsPhoto(photo: PexelsPhotoGet): NormalizedPhotoGet {
  return {
    pexels_id: photo.id,
    width: photo.width,
    height: photo.height,
    url: photo.src.original,
    urlLarge2x: photo.src.large2x,
    photographer: photo.photographer,
    photographer_url: photo.photographer_url,
    photographer_id: photo.photographer_id,
    avg_color: photo.avg_color,
    src: photo.src,
    alt: photo.alt,
  };
}

export function normalizeFavoritePhoto(favorite: FavoritePhotoGet): NormalizedPhotoGet {
  return {
    pexels_id: favorite.pexels_id,
    width: favorite.width,
    height: favorite.height,
    url: favorite.url,
    urlLarge2x: favorite.urlLarge2x,
    photographer: favorite.photographer,
    photographer_url: favorite.photographer_url,
    photographer_id: favorite.photographer_id,
    avg_color: favorite.avg_color,
    src: favorite.src,
    alt: favorite.alt,
    isFavorited: true, // always true for favorites
  };
}

export async function checkFavoritesArray(photos: NormalizedPhotoGet[], userId: string) {
  if (!userId) return photos;

  const photoIds = photos.map((p) => p.pexels_id); 
  const { data: favorites } = await supabase
    .from("favorite")
    .select("pexels_id")
    .eq("user_id", userId)
    .in("pexels_id", photoIds); 

  const favoriteSet = new Set((favorites || []).map((f) => f.pexels_id));

  return photos.map((photo) => ({
    ...photo,
    isFavorited: favoriteSet.has(photo.pexels_id),
  }));
}

export async function checkFavoriteSingle(photo: NormalizedPhotoGet, userId: string) {
  if (!userId) return { ...photo, isFavorited: false };

  const { data } = await supabase
    .from("favorite")
    .select("pexels_id")
    .eq("user_id", userId)
    .eq("pexels_id", photo.pexels_id)
    .limit(1)
    .maybeSingle();

  return { ...photo, isFavorited: !!data };
}
