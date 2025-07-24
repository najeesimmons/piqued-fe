import { supabase } from "../supabase/supabase";

export async function getCommentsByPexelsId(pexels_id) {
  const { data: comments, error } = await supabase
    .from("comment")
    .select("*, profile(username, first_name, last_name)")
    .eq("pexels_id", pexels_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return null;
  }

  const enrichedComments = comments.map((comment) => ({
    ...comment,
    display_name: comment.profile?.username || "Anonymous",
  }));

  return enrichedComments;
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
  const { data: comment, error } = await supabase
    .from("comment")
    .insert([{ pexels_id, text }])
    .select("*, profile(username, first_name, last_name)")
    .maybeSingle();

  if (error) {
    console.error("Error inserting comment:", error);
    return null;
  }

  const enrichedComment = {
    ...comment,
    display_name: comment.profile?.username || "Anonymous",
  };

  return enrichedComment;
}
