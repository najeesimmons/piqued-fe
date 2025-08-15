import type { PexelsGet, TransformedPhotoGet } from "./api";

export function transformPhoto(photo: PexelsGet): TransformedPhotoGet {
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
