import Section from "@/components/Section/Section";
import { IoCloseSharp } from "react-icons/io5";
import { LiaMountainSolid } from "react-icons/lia";
import { supabase } from "../../../../lib/supabase/supabase";
import { AuthError, Session, User } from '@supabase/supabase-js';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

interface LoginProps {
  setAuthMode: Dispatch<SetStateAction<"login" | "signup">>
  setDisableComment: Dispatch<SetStateAction<boolean>>
  setIsShowAuthCta: Dispatch<SetStateAction<boolean>>
}
export default function Login({
  setAuthMode,
  setDisableComment,
  setIsShowAuthCta,
}: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [isAuthError, setIsAuthError] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAuthError(false);
    setError("");

    // Types are inferred from Supabase's TypeScript definitions
    const { data, error } = await supabase.auth.signInWithPassword({
      email: isGuest ? "piquedguest@gmail.com" : email,
      password: isGuest
        ? process.env.NEXT_PUBLIC_PUBLIC_DEMO_PASSWORD || ""
        : "",
    });

    if (error) {
      setError(error.message);
      setIsAuthError(true);
      return;
    }

    setPassword("");
    if (data?.user) {
      setUser(data.user);
    }
    setDisableComment?.(false);
    setIsShowAuthCta(false);

    const redirectPath = router.query.redirect;

    if (typeof redirectPath === "string") {
      await router.push(redirectPath);
      router.replace(redirectPath, undefined, { shallow: true });
    }
  };

  return (
    <Section>
      <div className="flex items-center justify-center overflow-y-auto">
        <div className="flex flex-col bg-gray-200 p-6 md:w-1/2 w-full text-black relative">
          <button
            onClick={() => {
              setIsShowAuthCta(false);
              setDisableComment?.(false);
              const { redirect, ...rest } = router.query;
              const newQuery = new URLSearchParams(rest as Record<string, string>).toString();
              const newUrl = `${router.pathname}${
                newQuery ? `?${newQuery}` : ""
              }`;

              router.replace(newUrl, undefined, { shallow: true });
            }}
            className="absolute top-2 left-2 text-3xl z-[10000]"
            aria-label="Close Modal"
          >
            <IoCloseSharp color="black" size={25} />
          </button>
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
                required={!isGuest}
                style={{ textIndent: "8px" }}
                autoComplete="email"
              />
            </div>
            <div className="text-base md:text-sm relative">
              <input
                className="w-full h-10 border pr-12"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                value={password}
                required={!isGuest}
                style={{ textIndent: "8px" }}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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
