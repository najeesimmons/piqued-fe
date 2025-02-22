"use client";
import Image from "next/image";
import { useRouter } from "next/router";
// TODO: shallow routing from Link which caused soft navigation to home component
// import Link from "next/link";

function Photo({ photo, priority, setPhoto }) {
  const router = useRouter();
  const openPhotoModal = () => {
    const liveQuery = { ...router.query, show: "true", id: photo.id };
    router.replace({ pathname: router.pathname, query: liveQuery }, undefined, {
      shallow: true,
    });
  };
  return (
    // <Link href={`/?show=true&id=${photo.id}`}>
    <Image
      src={photo.src.original}
      alt={photo.alt}
      width={0}
      height={0}
      className="w-full h-auto cursor-pointer"
      // TODO: sizes prop must change if breakpoints change in PhotoMasonry
      sizes="(max-width: 350px) 100vw, (max-width: 750px) 50vw, 33.33vw"
      {...(priority && { priority })}
      onClick={() => {
        setPhoto(photo);
        openPhotoModal();
        // router.replace(`/?show=true&id=${photo.id}`, undefined, {
        //   shallow: true,
        // });
      }}
    />
    // </Link>
  );
}

export default Photo;
