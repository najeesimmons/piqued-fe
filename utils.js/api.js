import { createClient } from "pexels";
import { supabase } from "../lib/supabase";

const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY);

function handleApiError(response, endpoint) {
  if (response.error) {
    throw new Error(`Pexels API Error [${endpoint}]: ${response.error}`);
  }

  if (
    (endpoint === "curated" || endpoint === "search") &&
    (!Array.isArray(response.photos) || response.photos.length === 0)
  ) {
    throw new Error(
      `Pexels API Error [${endpoint}]: Invalid or empty photo list`
    );
  }

  if (endpoint === "show" && !response.id) {
    throw new Error(
      `Pexels API Error [${endpoint}]: Invalid response for photo ID`
    );
  }
}

function transformPhoto(photo) {
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

export async function fetchPexels(endpoint, params = {}, userId) {
  const page = params.page || 1;

  try {
    let response;
    switch (endpoint) {
      case "curated":
        response = await client.photos.curated({
          per_page: 40,
          page,
        });
        break;
      case "search":
        response = await client.photos.search({
          query: params.query,
          per_page: 40,
          page,
        });
        break;
      case "show":
        response = await client.photos.show({ id: params.id });
        break;
      default:
        throw new Error(`Unsupported endpoint: ${endpoint}`);
    }

    handleApiError(response, endpoint);

    if (endpoint === "search" || endpoint === "curated") {
      const { photos } = response;
      const transformedPhotos = photos.map(transformPhoto);

      // conditional favorites stuff
      if (!userId) {
        return {
          data: {
            ...response,
            photos: transformedPhotos,
          },
        };
      } else {
        const photoIds = transformedPhotos.map((p) => p.pexels_id);

        const { data: favorites } = await supabase
          .from("favorite")
          .select("pexels_id")
          .eq("user_id", userId)
          .in("pexels_id", photoIds);

        const favoriteSet = new Set((favorites || []).map((f) => f.pexels_id));
        console.log("favoritesSet:", favoriteSet);

        const photosWithFavorites = transformedPhotos.map((photo) => ({
          ...photo,
          isFavorited: favoriteSet.has(photo.pexels_id),
        }));

        return {
          data: {
            ...response,
            photos: photosWithFavorites,
          },
        };
      }
    } else if (endpoint === "show") {
      const transformedPhoto = transformPhoto(response);
      if (!userId) {
        return { data: { ...response, photo: transformedPhoto } };
      } else {
        //do favorite check
        const pexels_id = transformedPhoto.pexels_id;
        const { data } = await supabase
          .from("favorites")
          .select("pexels_id")
          .eq("user_id", userId)
          .eq("pexels_id", pexels_id)
          .limit(1)
          .maybeSingle();

        transformedPhoto.isFavorited = !!data;
        return transformedPhoto;
      }
    } else {
      throw new Error("invalid endpoint");
    }
  } catch (error) {
    if (error.message) {
      console.error(
        `❌ Error occurred fetching data from Pexels: ${error.message}`
      );
    } else {
      console.error(`❌ Unexpected error fetching from Pexels 🙅🏾‍♂️: ${error}`);
    }
    return { error };
  }
}
