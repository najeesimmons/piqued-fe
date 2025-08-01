"use client";
import Link from "next/link";
import { HiOutlineUser } from "react-icons/hi2";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { LiaMountainSolid } from "react-icons/lia";
import { supabase } from "../../../lib/supabase/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

function Navigation({ setIsShowAuthCta }) {
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
          <Link href={"/"}>
            <IoHomeOutline title="home" size={20} />
          </Link>
        </li>

        <li className="font-semibold flex items-center">
          {user ? (
            <Link href="/favorites">
              <IoMdHeartEmpty title="favorites" size={23} />
            </Link>
          ) : (
            <button
              onClick={() => setIsShowAuthCta(true)}
              className="text-black"
              aria-label="Open auth modal"
            >
              <IoMdHeartEmpty title="favorites" size={23} />
            </button>
          )}
        </li>

        <li className="font-semibold flex items-center">
          {user ? (
            <Link href="/profile">
              <HiOutlineUser title="profile" size={22} />
            </Link>
          ) : (
            <button
              onClick={() => setIsShowAuthCta(true)}
              className="text-black"
              aria-label="Open auth modal"
            >
              <HiOutlineUser title="profile" size={22} />
            </button>
          )}
        </li>

        {!user && !isLoginPage && (
          <li className="font-semibold">
            <button
              className="bg-black text-white px-4 py-2 hover:bg-gray-800"
              onClick={() => {
                setIsShowAuthCta(true);
              }}
            >
              log in
            </button>
          </li>
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
