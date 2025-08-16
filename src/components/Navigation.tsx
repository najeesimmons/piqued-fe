"use client";
import Link from "next/link";
import { HiOutlineUser } from "react-icons/hi2";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { LiaMountainSolid } from "react-icons/lia";
import { supabase } from "../../lib/supabase/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

interface NavigationProps {
  setIsShowAuthCta?: (isShow: boolean) => void;
}

function Navigation({ setIsShowAuthCta }: NavigationProps) {
  const { user, setUser } = useAuth();

  const router = useRouter();

  const isLoginPage = router.asPath.includes("/login");

  const handleClick = (path: string) => {
    if (!setIsShowAuthCta) {
      router.push(`/${path}`);
      return;
    }
  
    if (router.pathname === "/") {
      setIsShowAuthCta(true);
      router.push(`/?redirect=/${path}`);
    } else {
      router.push(`/${path}`);
    }
  };
  
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
    <nav className="py-2 flex flex-row items-center justify-between font-semibold text-base">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <LiaMountainSolid className="w-[25px] h-[25px] md:w-[22px] md:h-[22px]" />
        <span className="text-lg">piqued</span>
      </Link>

      <ul className="flex flex-row gap-2">
        <li className="font-semibold flex items-center mr-1">
          <Link href={"/"}>
            <IoHomeOutline
              title="home"
              className="w-[25px] h-[25px] md:w-[20px] md:h-[20px]"
            />
          </Link>
        </li>

        <li className="font-semibold flex items-center">
          {user ? (
            <Link href="/favorites">
              <IoMdHeartEmpty
                title="favorites"
                className="w-[25px] h-[25px] md:w-[22px] md:h-[22px]"
              />
            </Link>
          ) : (
            <button
              onClick={() => handleClick("favorites")}
              aria-label="Open auth modal"
            >
              <IoMdHeartEmpty
                title="favorites"
                className="w-[25px] h-[25px] md:w-[22px] md:h-[22px]"
              />
            </button>
          )}
        </li>

        <li className="font-semibold flex items-center">
          {user ? (
            <Link href="/profile">
              <HiOutlineUser
                title="profile"
                className="w-[25px] h-[25px] md:w-[22px] md:h-[22px]"
              />
            </Link>
          ) : (
            <button
              onClick={() => handleClick("profile")}
              aria-label="Open auth modal"
            >
              <HiOutlineUser
                title="profile"
                className="w-[25px] h-[25px] md:w-[22px] md:h-[22px]"
              />
            </button>
          )}
        </li>

        <li className="font-semibold flex items-center">
          <a
            href="https://najeesimmons.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <IoIosInformationCircleOutline
              className="inline md:hidden w-[25px] h-[25px] md:w-[22px] md:h-[22px]"
              title="portfolio"
            />
            <span className="hidden md:inline">portfolio</span>
          </a>
        </li>

        {!user && !isLoginPage && (
          <li className="font-semibold md:text-sm">
            <button
              className="ml-2 md:ml-1 bg-black text-white px-2 py-1 hover:bg-gray-800 border border-black dark:border-white"
              onClick={() => {
                if (setIsShowAuthCta) {
                  setIsShowAuthCta(true);
                } else {
                  router.push("/login");
                }
              }}
            >
              log in
            </button>
          </li>
        )}

        {user && (
          <li className="font-semibold md:text-sm">
            <button
              onClick={handleSignOut}
              className="ml-2 md:ml-1 cursor-pointer bg-black text-white px-2 py-1 hover:bg-gray-800 border border-black dark:border-white"
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
