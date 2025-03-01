"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation/Navigation";
import Section from "@/components/Section/Section";

function Signup() {
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
            <form className="mt-2 mx-auto space-y-2 w-3/4">
              <div className="text-sm">
                <label className="block">email</label>
                <input
                  className="w-full h-8 border"
                  placeholder="email"
                  style={{ textIndent: "8px" }}
                />
              </div>
              <div className="text-sm">
                <label className="block">password</label>
                <input
                  className="w-full h-8 border"
                  placeholder="password"
                  style={{ textIndent: "8px" }}
                />
              </div>
              <button className="bg-black font-semibold !mt-6 mx-auto p-2 text-white w-full">
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
        </div>
      </Section>
    </>
  );
}

export default Signup;
