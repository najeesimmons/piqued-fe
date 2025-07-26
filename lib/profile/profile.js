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

export async function updateOwnProfile(profileForm, user_id) {
  const { data: updatedProfile, error } = await supabase
    .from("profile")
    .update({
      first_name: profileForm.first_name,
      last_name: profileForm.last_name,
      username: profileForm.username,
    })
    .eq("user_id", user_id)
    .select()
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return updatedProfile;
}
