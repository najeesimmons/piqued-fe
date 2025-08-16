import { supabase } from "../supabase/supabase";
import { 
  favoritesListSchema, 
  ToggleFavoriteResponseSchema 
} from "./types";

export async function getFavorites(start, end) {
  const {
    data: asFetchedFavorites,
    count,
    error,
  } = await supabase
    .from("favorite")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    console.error(error.message);
    return null;
  } else {
    const favorites = asFetchedFavorites.map((asFetchedFavorite) => ({
      ...asFetchedFavorite,
      isFavorited: true,
    }));
    
    const result = { favorites, count };
    
    try {
      favoritesListSchema.parse(result);
      return result;
    } catch (validationError) {
      console.error("Validation error in getFavorites:", validationError);
      return null;
    }
  }
}

export async function toggleFavorite(photo) {
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
  const { data: existingFavorite, error: fetchError } = await supabase
    .from("favorite")
    .select("id")
    .eq("pexels_id", pexels_id);

  if (fetchError) {
    console.error(
      "Error checking whether photo is already favorited:",
      fetchError
    );
    return fetchError;
  } else if (existingFavorite.length > 0) {
    const { error: deleteError } = await supabase
      .from("favorite")
      .delete()
      .eq("pexels_id", pexels_id);

    if (deleteError) {
      console.error("Error deleting existing favorite:", deleteError);
      return deleteError;
    } else {
      const result = { action: "remove", success: true };
      
      try {
        ToggleFavoriteResponseSchema.parse(result);
        return result;
      } catch (validationError) {
        console.error("Validation error in toggleFavorite (remove):", validationError);
        return deleteError;
      }
    }
  } else {
    const { error: insertError } = await supabase.from("favorite").insert({
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

    if (insertError) {
      console.error("Error adding new favorite:", insertError);
      return insertError;
    } else {
      const result = { action: "insert", success: true };
      
      try {
        ToggleFavoriteResponseSchema.parse(result);
        return result;
      } catch (validationError) {
        console.error("Validation error in toggleFavorite (insert):", validationError);
        return insertError;
      }
    }
  }
}
