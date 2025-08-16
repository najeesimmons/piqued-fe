import { supabase } from "../supabase/supabase";
import { 
  favoritesListSchema, 
  ToggleFavoriteResponseSchema,
} from "./types";
import { ZodError } from "zod";
import { normalizeFavoritePhoto } from "../normalizers";
import { NormalizedPhotoGet } from "../pexels/types";

export async function getFavorites(start: number, end: number) {
  try {
    const {
      data,
      count,
    } = await supabase
      .from("favorite")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, end);

    // Validate the raw data against favoritesListSchema
    const rawResult = { favorites: data || [], count: count || 0 };
    favoritesListSchema.parse(rawResult);

    const normalizedFavorites: NormalizedPhotoGet[] = data?.map(normalizeFavoritePhoto) || [];
    
    // Return the normalized structure that matches what the UI expects
    return { favorites: normalizedFavorites, count };
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("❌ Zod validation error in getFavorites:", error.issues);
    } else if (error instanceof Error) {
      console.error("❌ Error in getFavorites:", error.message);
    } else {
      console.error("❌ Unexpected error in getFavorites:", error);
    }
    return null;
  }
}

export async function toggleFavorite(photo: NormalizedPhotoGet) {
  try {
    const {
      pexels_id,
      width,
      height,
      url,
      urlLarge2x,
      photographer,
      photographer_url,
      photographer_id,
      avg_color,
      src,
      alt,
    } = photo;
    
    const { data: existingFavorite } = await supabase
      .from("favorite")
      .select("id")
      .eq("pexels_id", pexels_id);

    if (existingFavorite && existingFavorite.length > 0) {
      await supabase
        .from("favorite")
        .delete()
        .eq("pexels_id", pexels_id);

      const result = { action: "remove", success: true };
      ToggleFavoriteResponseSchema.parse(result);
      return result;
    } else {
      await supabase.from("favorite").insert({
        pexels_id,
        width,
        height,
        url,
        urlLarge2x,
        photographer,
        photographer_url,
        photographer_id,
        avg_color,
        src,
        alt,
      });

      const result = { action: "insert", success: true };
      ToggleFavoriteResponseSchema.parse(result);
      return result;
    }
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("❌ Zod validation error in toggleFavorite:", error.issues);
    } else if (error instanceof Error) {
      console.error("❌ Error in toggleFavorite:", error.message);
    } else {
      console.error("❌ Unexpected error in toggleFavorite:", error);
    }
    return null;
  }
}
