import { supabase } from "../../../../lib/supabase/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log("Successfully signed out!");
    return res.status(200).json({ message: "Successfully signed out!" });
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong during sign out." });
  }
}
