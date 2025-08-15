"use client";
import { BeatLoader } from "react-spinners";
import { useEffect, useState } from "react";

export default function LoaderWithTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handleChange = (e) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="flex justify-center items-center">
      <BeatLoader loading={true} color={isDark ? "white" : "black"} />
    </div>
  );
}
