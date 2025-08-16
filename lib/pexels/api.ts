import { createClient } from "pexels";
import {
  checkFavoritesArray,
  checkFavoriteSingle,
} from "../favorite/utils";
import { normalizePexelsPhoto } from "./helpers";
import { ZodError } from "zod";
import {
  Endpoint,
  PexelsPhotoList,
  pexelsListSchema,
  pexelsGetSchema,
} from "./types";

const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY as string);

export async function pexelsList(endpoint: Endpoint, params: { page?: number, query?: string }, userId?: string) {
  const page = params.page || 1;

  try {
    let response: PexelsPhotoList;
    switch (endpoint) {
      case "curated":
        const rawCuratedResponse = await client.photos.curated({
          per_page: 40,
          page,
        });

        const parsedCurated = pexelsListSchema.safeParse(rawCuratedResponse);
        if (!parsedCurated.success) {
          throw new ZodError(parsedCurated.error.issues);
        }
        response = parsedCurated.data;
        break;
      case "search":
        if (!params.query) {
          throw new Error("Query parameter is required for search endpoint");
        }
        const rawSearchResponse = await client.photos.search({
          query: params.query,
          per_page: 40,
          page,
        });

        const parsedSearch = pexelsListSchema.safeParse(rawSearchResponse);
        if (!parsedSearch.success) {
          throw new ZodError(parsedSearch.error.issues);
        }
        response = parsedSearch.data;
        break;

      default:
        throw new Error(`Unsupported endpoint for LIST photos: ${endpoint}`);
    }

    let normalizedPhotos = response.photos.map(normalizePexelsPhoto);

    if (userId) {
      normalizedPhotos = await checkFavoritesArray(normalizedPhotos, userId);
    }

    return {
      ...response,
      photos: normalizedPhotos,
    };

  } catch (error) {
    if (error instanceof ZodError) {
      console.error(`❌ Zod validation error validating photos array:`, error.issues);
    } else if (error instanceof Error) {
      console.error(
        error.message
          ? `❌ Error occurred fetching data from Pexels: ${error.message}`
          : `❌ Unexpected error fetching from Pexels: ${error}`
      );
    } else {
      console.error(`❌ Unexpected error: ${String(error)}`);
    }
    return null;
  }
}

export async function pexelsGet(params: { id: number }, userId?: string) {
  if (!params.id) {
    throw new Error("Missing photo ID for 'show' endpoint");
  }

  try {
    const response = await client.photos.show({ id: params.id });

    const parsed = pexelsGetSchema.safeParse(response);
    if (!parsed.success) {
      throw new ZodError(parsed.error.issues);
    }

    let normalizedPhoto = normalizePexelsPhoto(parsed.data);

    if (userId) {
      normalizedPhoto = await checkFavoriteSingle(normalizedPhoto, userId);
    }

    return normalizedPhoto;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        `❌ Zod validation error validating single photo:`,
        error.issues
      );
    } else if ( error instanceof Error ) {
      console.error(
        error.message
          ? `❌ Error occurred fetching data from Pexels: ${error.message}`
          : `❌ Unexpected error fetching from Pexels: ${error}`
      );
    } else {
      console.error(`❌ Unexpected error: ${String(error)}`);
    }
    return null;
  }
}
