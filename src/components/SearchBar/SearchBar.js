import { useState } from "react";
import { IoIosSearch } from "react-icons/io";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const handleClick = () => {
    console.log("i was clicked");
    // doSearch(searchQuery);
  };

  return (
    <div className="flex h-8">
      <input
        className="mb-4 border-2 p-4 flex-grow"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        className="w-1/12 flex items-center justify-center border-2 border-l-0"
        onClick={handleClick}
      >
        <IoIosSearch size={25} />
      </button>
    </div>
  );
}

export default SearchBar;
