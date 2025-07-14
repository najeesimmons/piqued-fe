import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useEffect } from "react";

function PhotoView({ photo }) {
  useEffect(() => {
    console.log("in photoView 🖼️");
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <button
        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
        aria-label="Favorite"
        onClick={() =>
          handleFavorite({
            pexel_id: photo.id,
            url: photo.src.original || photo.url,
          })
        }
      >
        <FaHeart color="white" size={20} />
      </button>
      <Image
        src={photo.src.original || photo.url}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
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
