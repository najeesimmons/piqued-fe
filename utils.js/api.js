import { createClient } from "pexels";
import {
  checkFavoritesArray,
  checkFavoriteSingle,
} from "../lib/favorite/utils";
import { transformPhotoArray, transformPhotoSingle } from "./helpers";

const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY);

function handleApiError(response, endpoint) {
  if (response.error) {
    throw new Error(`Pexels API Error [${endpoint}]: ${response.error}`);
  }

  if (
    (endpoint === "curated" || endpoint === "search") &&
    !Array.isArray(response.photos)
  ) {
    throw new Error(
      `Pexels API Error [${endpoint}]: Invalid response for this endpoint.`
    );
  }

  if (endpoint === "show" && !response.id) {
    throw new Error(
      `Pexels API Error [${endpoint}]: Invalid response for this endpoint.`
    );
  }
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

    if (endpoint === "curated" || endpoint === "search") {
      let transformedPhotos = transformPhotoArray(response.photos);

      if (userId) {
        transformedPhotos = await checkFavoritesArray(
          transformedPhotos,
          userId
        );
      }

      // return {
      //   data: {
      //     ...response,
      //     photos: transformedPhotos,
      //   },
      // };
      return {
        ...response,
        photos: transformedPhotos,
      };
    }

    if (endpoint === "show") {
      let transformedPhoto = transformPhotoSingle(response);

      if (userId) {
        transformedPhoto = await checkFavoriteSingle(transformedPhoto, userId);
      }

      return {
        ...response,
        photo: transformedPhoto,
      };
    }
  } catch (error) {
    console.error(
      error.message
        ? `❌ Error occurred fetching data from Pexels: ${error.message}`
        : `❌ Unexpected error fetching from Pexels: ${error}`
    );
    return {
      error,
    };
  }
}
