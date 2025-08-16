import z from "zod";

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
export type PexelsPhotoGet = z.infer<typeof pexelsGetSchema>;
export type PexelsPhotoList = z.infer<typeof pexelsListSchema>;
export type PexelsResponse = PexelsPhotoList | PexelsPhotoGet | { error: string };

export type NormalizedPhotoGet = {
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

export type NormalizedPhotoList = {
  photos: NormalizedPhotoGet[];
  page?: number;
  per_page?: number;
  total_results?: number;
  next_page?: string;
  prev_page?: string;
};
