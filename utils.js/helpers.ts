import type { PexelsPhotoGet, NormalizedPhotoGet } from "./api";
import type { FavoritePhotoGet } from "../lib/favorite/types";

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
