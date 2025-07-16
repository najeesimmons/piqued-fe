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
        const photoIds = photos.map((p) => p.id);

        const { data: favorites } = await supabase // include error? how to handle gracefully?
          .from("favorites")
          .select("pexels_id")
          .eq("user_id", userId)
          .in("pexels_id", photoIds);

        const favoriteSet = new Set(favorites.map((f) => f.pexels_id));

        const photosWithFavorites = photos.map((photo) => ({
          ...photo,
          isFavorited: favoriteSet.has(photo.id),
        }));

        console.log(photosWithFavorites);

        return {
          data: {
            ...response,
            photos: photosWithFavorites,
          },
        };
      }
    } else {
      return { data: { ...response, photo: transformPhoto(response) } };
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
