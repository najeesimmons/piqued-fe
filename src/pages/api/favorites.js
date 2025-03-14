import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, photo } = req.body;

  if ((!user_id, !photo)) {
    return res.status(400).json({ error: "User and photo are required" });
  }

  const {
    id,
    alt,
    image_small,
    image_original,
    image_large,
    image_medium,
    photographer,
  } = photo;

  const { favorite, error } = await supabase.from("favorites").insert([
    {
      user_id,
      photo_id: id,
      alt,
      image_small,
      image_original,
      image_large,
      image_medium,
      photographer,
    },
  ]);

  if (error) {
    console.log("...favorite create failed 🤦🏾‍♂️", error.message);
    return res.status(400).json({ error: error.message });
  }

  console.log("favorite create succeded 🙆🏾‍♂️", favorite);
  return res.status(200).json({ favorite });
}
