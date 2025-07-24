import { supabase } from "../supabase/supabase";

export async function getOwnProfile(user_id) {
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error("Error fetching comments:", error);
    return null;
  }

  return profile;
}

export async function insertProfile(first_name, last_name, username, user_id) {
  const { data: existing } = await supabase
    .from("profile")
    .select("id")
    .eq("id", user_id)
    .maybeSingle();

  if (existing) {
    console.log("there's already a profile for this user");
    return;
  } else {
    const { data, error } = await supabase
      .from("profile")
      .insert([
        {
          first_name,
          last_name,
          username,
          user_id,
        },
      ])
      .select();

    if (error) {
      console.error("Insert error:", error);
      return { error };
    }

    return { data };
  }
}
