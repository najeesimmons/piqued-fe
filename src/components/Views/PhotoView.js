import Image from "next/image";
import { FaHeart } from "react-icons/fa";

function PhotoView({ displayPhoto, handleFavorite }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <button
        className={`absolute top-2 right-2 text-white bg-black rounded-full p-2 hover:bg-opacity-60 z-10 ${
          displayPhoto.isFavorited ? "bg-opacity-10" : "bg-opacity-50"
        }`}
        aria-label="Favorite"
        onClick={() => handleFavorite(displayPhoto)}
      >
        <FaHeart color={displayPhoto.isFavorited ? "red" : "white"} size={20} />
      </button>
      <Image
        src={displayPhoto.url}
        alt={displayPhoto.alt}
        width={displayPhoto.width}
        height={displayPhoto.height}
        priority
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}

export default PhotoView;
