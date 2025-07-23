import { supabase } from "../supabase/supabase";

export async function getCommentsByPexelsId(pexels_id) {
  const { data: comments, error } = await supabase
    .from("comment")
    .select("*, profiles(username, first_name, last_name)")
    .eq("pexels_id", pexels_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return null;
  }

  return comments;
}

export async function getOwnComments(user_id) {
  const { data: comments, error } = await supabase
    .from("comment")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { descending: true });

  if (error) {
    console.error("Error fetching own comments:", error);
    return null;
  }

  return comments;
}

export async function insertComment({ pexels_id, text }) {
  const { error } = await supabase
    .from("comment")
    .insert([{ pexels_id, text }]);

  if (error) {
    console.error("Error inserting comment:", error);
    return { success: false, error };
  }

  return { success: true };
}
