import { IoIosSearch } from "react-icons/io";
import { useEffect } from "react";

function SearchBar({ getSearchPhotos, isDisabled, searchTerm, setSearchTerm }) {
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (isDisabled) return;
      if (e.key === "Enter" && searchTerm !== "") {
        await getSearchPhotos();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [getSearchPhotos, isDisabled, searchTerm]);

  return (
    <div className="flex h-8 mb-4">
      <input
        className="mb-4 border-2 p-4 flex-grow bg-inherit"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="w-1/12 flex py-4 items-center justify-center border-2 border-l-0"
        onClick={() => {
          if (searchTerm !== "" && !isDisabled) getSearchPhotos();
        }}
      >
        <IoIosSearch size={25} />
      </button>
    </div>
  );
}

export default SearchBar;
