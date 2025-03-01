"use client";
import Link from "next/link";

function Navigation() {
  return (
    <nav className="py-2 flex flex-row items-center justify-between font-semibold text-sm">
      <span className="fond-semibold">
        <Link href={"/"}>piqued</Link>
      </span>
      <ul className="flex flex-row gap-2">
        <li className="after:content-['|'] after:mx-2 last:after:content-none font-semibold">
          <Link href={"/login"}>log in</Link>
        </li>
        <li className="font-semibold">
          <Link href={"/signup"}>sign up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
