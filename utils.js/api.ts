import { createClient } from "pexels";
import {
  checkFavoritesArray,
  checkFavoriteSingle,
} from "../lib/favorite/utils";
import { transformPhoto } from "./helpers";
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
export const pexelsListSchema = z.object({
  photos: z.array(pexelsGetSchema),
  page: z.number().optional(),
  per_page: z.number().optional(),
  total_results: z.number().optional(),
  next_page: z.string().optional(),
  prev_page: z.string().optional(),
});

export type Endpoint = "curated" | "search" | "show";
export type PexelsGet = z.infer<typeof pexelsGetSchema>;
export type PexelsList = z.infer<typeof pexelsListSchema>;
export type PexelsResponse = PexelsList | PexelsGet | { error: string };
export type TransformedPhotoGet = {
  pexels_id: number;
  width: number;
  height: number;
  url: string;
  urlLarge2x: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
  isFavorited?: boolean; // Added by checkFavoritesArray
};
export type TransformedPhotoList = {
  photos: TransformedPhotoGet[];
  page?: number;
  per_page?: number;
  total_results?: number;
  next_page?: string;
  prev_page?: string;
};

export async function pexelsList(endpoint: Endpoint, params: { page?: number, query?: string }, userId?: number) {
  const page = params.page || 1;

  try {
    let response: PexelsList;
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

    let transformedPhotos: TransformedPhotoGet[] = response.photos.map(transformPhoto);

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
        error.issues
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

export async function pexelsGet(params: { id: number }, userId?: number) {
  if (!params.id) {
    throw new Error("Missing photo ID for 'show' endpoint");
  }

  try {
    const response = await client.photos.show({ id: params.id });


    const parsed = pexelsGetSchema.safeParse(response);
    if (!parsed.success) {
      throw new ZodError(parsed.error.issues);
    }

    let transformedPhoto = transformPhoto(parsed.data);

    if (userId) {
      transformedPhoto = await checkFavoriteSingle(transformedPhoto, userId);
    }

    return transformedPhoto;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        `❌ Zod validation error validating single photo:`,
        error.issues
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
