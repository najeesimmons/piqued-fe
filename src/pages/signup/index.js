"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Section from "@/components/Section";
import { LiaMountainSolid } from "react-icons/lia";
import { useState } from "react";
import { supabase } from "../../../lib/supabase/supabase";

function Signup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");

  const [isAuthError, setIsAuthError] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAuthError(false);
    setError(false);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsAuthError(true);
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

  // useEffect(() => {
  //   if (user) router.push("/");
  // }, [user, router]);

  return (
    <>
      <Navigation />
      <Section>
        <div
          className="flex h-screen items-center justify-center overflow-y-auto"
          style={{ height: "calc(100vh - 35.99px)" }}
        >
          <div className="flex flex-col bg-gray-200 p-6 md:w-1/2 w-3/4 text-black">
            <h1 className="font-bold text-center text-2xl flex items-center justify-center gap-2">
              <LiaMountainSolid size={25} />
              piqued
            </h1>
            <form
              className="mt-2 mx-auto space-y-2 w-3/4 md:w-1/2"
              onSubmit={handleSubmit}
            >
              <div className="text-base md:text-sm mt-4">
                <input
                  className="w-full h-10 border"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                  value={email}
                  required
                  style={{ textIndent: "8px" }}
                  autoComplete="email"
                />
              </div>
              <div className="text-base md:text-sm">
                <input
                  className="w-full h-10 border"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  value={username}
                  required
                  style={{ textIndent: "8px" }}
                  autoComplete="username"
                />
              </div>
              <div className="text-base md:text-sm relative">
                <input
                  className="w-full h-10 border"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  value={password}
                  required
                  style={{ textIndent: "8px" }}
                  type={showPassword ? "text" : "password"}
                  a
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
                  `There was an error creating your account: ${error}. Please
                  try again.`
                </p>
              )}
              {isAuthSuccess && (
                <p className="mt-3 text-sm font-bold">
                  Success! Go find some Piques you love!
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
                <Link className="hover:underline font-semibold" href={"/login"}>
                  Login.
                </Link>
              </p>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}

export default Signup;
