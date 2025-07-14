"use client";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { LiaMountainSolid } from "react-icons/lia";

function Navigation() {
  const { user, setUser } = useAuth();

  const router = useRouter();
  const isFavoritesPage = router.asPath.includes("/favorites");

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign-out failed:", error.message);
        return;
      }
      setUser(null);
      console.log("Sign-out successful");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <nav className="py-2 flex flex-row items-center justify-between font-semibold text-sm">
      <Link href="/" className="flex items-center gap-1 font-semibold">
        <LiaMountainSolid />
        <span>piqued</span>
      </Link>

      <ul className="flex flex-row gap-2">
        {!user && (
          <>
            <li className="after:content-['|'] after:mx-2 last:after:content-none font-semibold">
              <Link href={"/login"}>log in</Link>
            </li>
            <li className="font-semibold">
              <Link href={"/signup"}>sign up</Link>
            </li>
          </>
        )}
        {user && !isFavoritesPage && (
          <>
            <li className="font-semibold">
              <Link href={"/favorites"}>favorites</Link>
            </li>
            <li
              className="font-semibold cursor-pointer"
              onClick={handleSignOut}
            >
              sign out
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
