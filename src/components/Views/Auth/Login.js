import Section from "@/components/Section/Section";
import { LiaMountainSolid } from "react-icons/lia";
import { supabase } from "../../../../lib/supabase/supabase";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Login({
  setAuthMode,
  setDisableComment,
  setIsShowAuthCta,
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isAuthError, setIsAuthError] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAuthError("");
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: isGuest ? "piquedguest@gmail.com" : email,
      password: isGuest
        ? process.env.NEXT_PUBLIC_PUBLIC_DEMO_PASSWORD
        : password,
    });

    if (error) {
      setError(error.message);
      setIsAuthError(true);
      return;
    }

    setPassword("");
    setUser(data.user);
    setDisableComment?.(false);
    setIsShowAuthCta(false);
  };

  return (
    <Section>
      <div
        className="flex h-screen items-center justify-center overflow-y-auto"
        style={{ height: "calc(100vh - 35.99px)" }}
      >
        <div className="flex flex-col bg-gray-200 p-6 md:w-1/2 w-3/4">
          <h1 className="font-bold text-center text-2xl flex items-center justify-center gap-2">
            <LiaMountainSolid size={25} />
            piqued
          </h1>
          <h2 className="mt-1 text-center text-base">login to your account</h2>
          <form
            className="mt-2 mx-auto space-y-2 w-3/4"
            onSubmit={handleSubmit}
          >
            <div className="text-sm mt-4">
              <input
                className="w-full h-8 border"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                value={email}
                required={!isGuest}
                style={{ textIndent: "8px" }}
              />
            </div>
            <div className="text-sm relative">
              <input
                className="w-full h-8 border pr-12"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                value={password}
                required={!isGuest}
                style={{ textIndent: "8px" }}
                type={showPassword ? "text" : "password"}
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold"
                >
                  {showPassword ? "hide" : "show"}
                </button>
              )}
            </div>
            {isAuthError && (
              <p className="mt-3 text-red-500 font-center">
                `There was an error logging into your account: ${error}. Please
                try again.`
              </p>
            )}
            <button
              className="bg-black font-semibold !mt-6 mx-auto p-2 text-white w-full"
              type="submit"
            >
              log in
            </button>
            <button
              className="bg-black font-semibold mx-auto p-2 text-white w-full"
              onClick={() => setIsGuest(true)}
              type="submit"
            >
              explore as guest
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
