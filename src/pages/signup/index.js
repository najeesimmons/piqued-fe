"use client";
import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation/Navigation";
import Section from "@/components/Section/Section";
import { supabase } from "../../../lib/supabase";

function Signup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // setUser(data.user); don't set user here unless deactiveate email confirmation, user won't be signed in at successful sign up
    console.log("Logged in as:", data.user);
    setSuccess(true);
  };

  return (
    <>
      <Navigation />
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
              <button
                className="bg-black font-semibold !mt-6 mx-auto p-2 text-white w-full"
                type="submit"
              >
                sign up
              </button>
              <p className="text-sm mt-2 text-center">
                Already have an account?{" "}
                <Link className="hover:underline font-semibold" href={"/login"}>
                  Sign In.
                </Link>
              </p>
            </form>
          </div>
          {error && <p className="mt-3 text-red-500 text-center">{error}</p>}
          {success && (
            <p className="mt-3 text-green-500 text-center">
              Sign-up successful! Confirm via email to activate...
            </p>
          )}
        </div>
      </Section>
    </>
  );
}

export default Signup;
