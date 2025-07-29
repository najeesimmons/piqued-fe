import Section from "@/components/Section/Section";
import { supabase } from "../../../../lib/supabase/supabase";
import { useState } from "react";

export default function Signup({ setAuthMode }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAuthError(false);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setIsAuthError(true);
      setError(error.message);
      return;
    }

    const user = data?.user;

    if (!user) {
      setIsAuthError(true);
      return;
    }

    const { error: profileError } = await supabase.from("profile").insert([
      {
        user_id: user.id,
        username,
      },
    ]);

    if (profileError) {
      console.error("Profile creation failed:", profileError);
      setIsAuthError(true);
      return;
    }

    setPassword("");
    setIsAuthSuccess(true);
  };

  return (
    <Section>
      <div
        className="flex h-screen items-center justify-center overflow-y-auto"
        style={{ height: "calc(100vh - 35.99px)" }}
      >
        <div className="flex flex-col bg-gray-200 p-6 md:w-1/2 w-3/4">
          <h1 className="font-bold text-center text-2xl">piqued</h1>
          <h2 className="mt-1 text-center text-xl">create your account</h2>
          <form
            className="mt-2 mx-auto space-y-2 w-3/4"
            onSubmit={handleSubmit}
          >
            <div className="text-sm">
              <label className="block">email</label>
              <input
                className="w-full h-8 border"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                value={email}
                required
                style={{ textIndent: "8px" }}
              />
            </div>
            <div className="text-sm">
              <label className="block">username</label>
              <input
                className="w-full h-8 border"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                value={username}
                required
                style={{ textIndent: "8px" }}
              />
            </div>
            <div className="text-sm">
              <label className="block">password</label>
              <input
                className="w-full h-8 border"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                value={password}
                required
                style={{ textIndent: "8px" }}
              />
            </div>
            {isAuthError && (
              <p className="mt-3 text-red-500 font-center">
                `There was an error creating your account: ${error}. Please try
                again.`
              </p>
            )}
            {isAuthSuccess && (
              <p className="mt-3 text-sm font-bold">
                Success! Close this window and enjoy Piqued!
              </p>
            )}
            <button
              className="bg-black font-semibold !mt-6 mx-auto p-2 text-white w-full"
              type="submit"
            >
              sign up
            </button>
            <p className="text-sm mt-2 text-center">
              Already have an account?{" "}
              <button
                className="hover:underline font-semibold"
                onClick={() => setAuthMode("login")}
              >
                Login.
              </button>
            </p>
          </form>
        </div>
      </div>
    </Section>
  );
}
