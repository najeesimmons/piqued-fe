import { supabase } from "../supabase/supabase";

const getCommentsByPexelsId = async (pexels_id) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("pexels_id", pexels_id)
    .order("created_at", { ascending: true }); // optional ordering

  if (error) {
    console.error("Error fetching comments:", error);
    return null;
  }

  return data;
};

const getOwnComments = async (user_id) => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false }); // most recent first

  if (error) {
    console.error("Error fetching own comments:", error);
    return null;
  }

  return data;
};

export async function insertComment({
  pexels_id,
  user_id,
  comment_text,
  created_at = new Date().toISOString(),
}) {
  const { data, error } = await supabase
    .from("comments")
    .insert([{ pexels_id, user_id, comment_text, created_at }]);

  if (error) {
    console.error("Error inserting comment:", error);
    return { success: false, error };
  }

  return { success: true, data };
}
