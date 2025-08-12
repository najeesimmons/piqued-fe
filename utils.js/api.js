import { createClient } from "pexels";
import {
  checkFavoritesArray,
  checkFavoriteSingle,
} from "../lib/favorite/utils";
import { transformPhotoArray, transformPhotoSingle } from "./helpers";
import z, { ZodError } from "zod";

const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY);

export const pexelsGetSchema = z.object({
  id: z.number(),
  width: z.number(),
  height: z.number(),
  url: z.url(),
  photographer: z.string(),
  photographer_url: z.url(),
  photographer_id: z.number(),
  avg_color: z.string().length(7),
  src: z.object({
    original: z.url(),
    large2x: z.url(),
    large: z.url(),
    medium: z.url(),
    small: z.url(),
    portrait: z.url(),
    landscape: z.url(),
    tiny: z.url(),
  }),
  liked: z.boolean(),
  alt: z.string(),
});

export const pexelsListSchema = z.array(pexelsGetSchema);

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

export async function pexelsList(endpoint, params = {}, userId) {
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
      default:
        throw new Error(`Unsupported endpoint for LIST photos: ${endpoint}`);
    }

    handleApiError(response, endpoint);

    const parsed = pexelsListSchema.safeParse(response.photos);
    if (!parsed.success) {
      throw new ZodError(parsed.error.errors);
    }

    let transformedPhotos = transformPhotoArray(parsed.data);

    if (userId) {
      transformedPhotos = await checkFavoritesArray(transformedPhotos, userId);
    }

    return {
      ...response,
      photos: transformedPhotos,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        `❌ Zod validation error validating photos array:`,
        error.errors
      );
    } else {
      console.error(
        error.message
          ? `❌ Error occurred fetching data from Pexels: ${error.message}`
          : `❌ Unexpected error fetching from Pexels: ${error}`
      );
    }
    return null;
  }
}

export async function pexelsGet(params = {}, userId) {
  if (!params.id) {
    throw new Error("Missing photo ID for 'show' endpoint");
  }

  try {
    const response = await client.photos.show({ id: params.id });

    handleApiError(response, "show");

    const parsed = pexelsGetSchema.safeParse(response);
    if (!parsed.success) {
      throw new ZodError(parsed.error.errors);
    }

    let transformedPhoto = transformPhotoSingle(parsed.data);

    if (userId) {
      transformedPhoto = await checkFavoriteSingle(transformedPhoto, userId);
    }

    return transformedPhoto;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        `❌ Zod validation error validating single photo:`,
        error.errors
      );
    } else {
      console.error(
        error.message
          ? `❌ Error occurred fetching data from Pexels: ${error.message}`
          : `❌ Unexpected error fetching from Pexels: ${error}`
      );
    }
    return null;
  }
}
