import { supabase } from "../../../../lib/supabase/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and Password are required" });
  }

  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("...login failed 🤦🏾‍♂️", error.message);
    return res.status(400).json({ error: error.message });
  }

  console.log("login succeded 🙆🏾‍♂️", user);
  return res.status(200).json({ user });
}
