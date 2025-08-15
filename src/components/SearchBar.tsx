"use client";
import { IoChevronBackSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface SearchBarProps {
  getFirstPhotos: () => Promise<void>;
  getSearchPhotos: () => Promise<void>;
  isDisabled: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

function SearchBar({
  getFirstPhotos,
  getSearchPhotos,
  isDisabled,
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (isDisabled) return;
      if (e.key === "Enter" && searchTerm.trim() !== "") {
        await getSearchPhotos();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getSearchPhotos, isDisabled, searchTerm]);

  const router = useRouter();
  const { search } = router.query;

  return (
    <div className="flex h-10 mb-4">
      {searchTerm !== "" && (
        <button
          className="h-10 w-1/12 flex items-center justify-center transition-all duration-300"
          onClick={async () => {
            if (!search) {
              setSearchTerm("");
              return;
            }
            setSearchTerm("");
            await getFirstPhotos();
            router.push("/");
          }}
        >
          <IoChevronBackSharp size={25} />
        </button>
      )}

      <input
        className={`h-10 p-4 mb-4 border-2 border-r-0 bg-inherit transition-all duration-300 ${
          searchTerm !== "" ? "w-11/12" : "w-full"
        }`}
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.trimStart())}
      />
      <button
        className="h-10 w-1/12 flex py-4 items-center justify-center border-2 border-l-0"
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
