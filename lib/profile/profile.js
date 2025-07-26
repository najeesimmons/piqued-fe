import { supabase } from "../supabase/supabase";

export async function getOwnProfile(user_id) {
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  console.log(profile);
  return profile;
}
