export function transformPhotoSingle(photo) {
  return {
    pexels_id: photo.id,
    width: photo.width,
    height: photo.height,
    url: photo.src.original,
    photographer: photo.photographer,
    photographer_url: photo.photographer_url,
    photographer_id: photo.photographer_id,
    avg_color: photo.avg_color,
    src: photo.src,
    alt: photo.alt,
  };
}

export function transformPhotoArray(photos) {
  return photos.map(transformPhotoSingle);
}
