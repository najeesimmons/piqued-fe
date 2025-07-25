import Section from "@/components/Section/Section";
import { supabase } from "../../../../lib/supabase/supabase";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Login({ setAuthMode, setIsShowAuthCta }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAuthError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsAuthError(true);
      return;
    }

    setPassword("");
    setUser(data.user);
    setIsShowAuthCta(false);
  };

  return (
    <Section>
      <div
        className="flex h-screen items-center justify-center overflow-y-auto"
        style={{ height: "calc(100vh - 35.99px)" }}
      >
        <div className="flex flex-col bg-gray-200 p-6 md:w-1/2 w-3/4">
          <h1 className="font-bold text-center text-2xl">piqued</h1>
          <h2 className="mt-1 text-center text-xl">login to your account</h2>
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
                There was an error creating your account. Please try again.
              </p>
            )}
            <button
              className="bg-black font-semibold !mt-6 mx-auto p-2 text-white w-full"
              type="submit"
            >
              log in
            </button>
            <p className="text-sm mt-2 text-center">
              New here?{" "}
              <button
                className="hover:underline font-semibold"
                onClick={() => setAuthMode("signup")}
              >
                Sign Up.
              </button>
            </p>
          </form>
        </div>
      </div>
    </Section>
  );
}
