"use client";
import Link from "next/link";
import { supabase } from "../../../lib/supabase/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { LiaMountainSolid } from "react-icons/lia";

function Navigation() {
  const { user, setUser } = useAuth();

  const router = useRouter();
  const isLoginPage = router.asPath.includes("/login");

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign-out failed:", error.message);
        return;
      }
      setUser(null);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <nav className="py-2 flex flex-row items-center justify-between font-semibold text-sm">
      <Link href="/" className="flex items-center gap-1 font-semibold">
        <LiaMountainSolid size={20} />
        <span className="text-lg">piqued</span>
      </Link>

      <ul className="flex flex-row gap-4">
        <li className="font-semibold flex items-center">
          <Link href={"/"}>home</Link>
        </li>
        {!user && !isLoginPage && (
          <li className="after:content-['|'] after:mx-2 last:after:content-none font-semibold">
            <Link
              className="bg-black text-white px-4 py-2 hover:bg-gray-800"
              href={"/login"}
            >
              log in
            </Link>
          </li>
        )}
        {user && (
          <>
            <li className="font-semibold flex items-center">
              <Link href={"/favorites"}>favorites</Link>
            </li>

            <li className="font-semibold flex items-center">
              <Link href={"/profile"}>my profile</Link>
            </li>
          </>
        )}
        {user && (
          <li className="font-semibold">
            <button
              onClick={handleSignOut}
              className="cursor-pointer bg-black text-white px-4 py-2 hover:bg-gray-800"
            >
              sign out
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
