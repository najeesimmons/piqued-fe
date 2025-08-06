import Image from "next/image";
import Loader from "../Loader/Loader";
import { FaHeart } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";

function PhotoView({ displayPhoto, handleClose, handleFavorite }) {
  const [isReadyToRender, setIsReadyToRender] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!isReadyToRender && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70">
          <span>
            <Loader />
          </span>
        </div>
      )}
      <button
        className={`absolute bottom-2 md:bottom-auto md:top-2 right-2 text-white bg-black rounded-full p-2 hover:bg-opacity-60 z-10 ${
          displayPhoto.isFavorited ? "bg-opacity-10" : "bg-opacity-50"
        }`}
        aria-label="Favorite"
        onClick={() => handleFavorite(displayPhoto)}
      >
        <FaHeart color={displayPhoto.isFavorited ? "red" : "white"} size={20} />
      </button>
      <button
        onClick={handleClose}
        className="absolute bottom-2 md:bottom-auto md:top-2 left-4 text-3xl bg-black rounded-full bg-opacity-10 hover:bg-opacity-60 z-[10000]"
        aria-label="Close Modal"
      >
        <IoCloseSharp size={30} />
      </button>
      <Image
        src={displayPhoto.urlLarge2x}
        alt={displayPhoto.alt}
        width={displayPhoto.width}
        height={displayPhoto.height}
        priority
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          opacity: isReadyToRender ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
        }}
        onLoad={() => setIsReadyToRender(true)}
      />
    </div>
  );
}

export default PhotoView;
