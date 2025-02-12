import { IoIosSearch } from "react-icons/io";

function SearchBar({ getSearchPhotos, searchTerm, setSearchTerm }) {
  return (
    <div className="flex h-8">
      <input
        className="mb-4 border-2 p-4 flex-grow"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="w-1/12 flex items-center justify-center border-2 border-l-0"
        onClick={getSearchPhotos}
      >
        <IoIosSearch size={25} />
      </button>
    </div>
  );
}

export default SearchBar;
