"use client";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "@/context/AuthContext";

function Navigation() {
  const { user, setUser } = useAuth();

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
      <span className="fond-semibold">
        <Link href={"/"}>piqued</Link>
      </span>
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
        {user && (
          <li className="font-semibold" onClick={handleSignOut}>
            sign out
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
