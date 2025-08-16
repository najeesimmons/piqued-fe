import { z } from "zod";

export const favoriteGetSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  pexels_id: z.number(),
  width: z.number(),
  height: z.number(),
  url: z.string(),
  urlLarge2x: z.string(),
  photographer: z.string(),
  photographer_url: z.string(),
  photographer_id: z.number(),
  avg_color: z.string(),
  src: z.object({
    original: z.string(),
    large2x: z.string(),
    large: z.string(),
    medium: z.string(),
    small: z.string(),
    portrait: z.string(),
    landscape: z.string(),
    tiny: z.string(),
  }),
  alt: z.string(),
  created_at: z.string(),
  isFavorited: z.boolean(),
});

export const favoritesListSchema = z.object({
  favorites: z.array(favoriteGetSchema),
  count: z.number(),
});

export const ToggleFavoriteSuccessSchema = z.object({
  action: z.enum(["insert", "remove"]),
  success: z.literal(true),
});

export const ToggleFavoriteErrorSchema = z.object({
  message: z.string(),
  details: z.string().optional(),
  hint: z.string().optional(),
  code: z.string().optional(),
});

export const ToggleFavoriteResponseSchema = z.union([
  ToggleFavoriteSuccessSchema,
  ToggleFavoriteErrorSchema,
]);

export type FavoritePhoto = z.infer<typeof favoriteGetSchema>;
export type ListFavoritesResponse = z.infer<typeof favoritesListSchema>;
export type ToggleFavoriteSuccess = z.infer<typeof ToggleFavoriteSuccessSchema>;
export type ToggleFavoriteError = z.infer<typeof ToggleFavoriteErrorSchema>;
export type ToggleFavoriteResponse = z.infer<typeof ToggleFavoriteResponseSchema>;
