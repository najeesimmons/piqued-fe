"use client";
import Image from "next/image";
import { useRouter } from "next/router";

function Photo({ photo, priority, setDisplayPhoto }) {
  const router = useRouter();
  const openPhotoModal = () => {
    const liveQuery = { ...router.query, show: "true", id: photo.pexels_id };
    router.replace({ pathname: router.pathname, query: liveQuery }, undefined, {
      shallow: true,
    });
  };
  return (
    <Image
      src={photo.url}
      alt={photo.alt || ""}
      width={photo.width}
      height={photo.height}
      className="w-full h-auto cursor-pointer"
      sizes="(max-width: 350px) 100vw, (max-width: 750px) 50vw, 33.33vw"
      {...(priority && { priority })}
      onClick={() => {
        setDisplayPhoto(photo);
        openPhotoModal();
      }}
    />
  );
}

export default Photo;
