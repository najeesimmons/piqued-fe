"use client";
import { IoChevronBackSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function SearchBar({
  getFirstPhotos,
  getSearchPhotos,
  isDisabled,
  searchTerm,
  setSearchTerm,
}) {
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (isDisabled) return;
      if (e.key === "Enter" && searchTerm.trim() !== "") {
        await getSearchPhotos();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getSearchPhotos, isDisabled, searchTerm]);

  const router = useRouter();

  return (
    <div className="flex h-8 mb-4">
      {searchTerm && (
        <button
          className="w-1/12 flex py-4 items-center justify-center border-2 border-r-0"
          onClick={async () => {
            router.push("/");
            console.log("now how do I get curated photos back?");
            await getFirstPhotos();
          }}
        >
          <IoChevronBackSharp size={25} />
        </button>
      )}

      <input
        className="mb-4 border-2 p-4 flex-grow bg-inherit"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
      />
      <button
        className="w-1/12 flex py-4 items-center justify-center border-2 border-l-0"
        onClick={() => {
          if (searchTerm.trim() !== "" && !isDisabled) getSearchPhotos();
        }}
      >
        <IoIosSearch size={25} />
      </button>
    </div>
  );
}

export default SearchBar;
