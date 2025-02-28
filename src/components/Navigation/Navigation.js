"use client";
import Link from "next/link";

function Navigation() {
  return (
    <nav className="flex flex-row items-center justify-between font-semibold">
      <span>homeLogo</span>
      <ul className="flex flex-row gap-2">
        <li>
          <Link href={"/login"}>login</Link>
        </li>
        <li>
          <Link href={"/login"}>sign up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
