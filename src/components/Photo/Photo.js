import Image from "next/image";
import Link from "next/link";

function Photo({ photo, priority, setPhoto }) {
  return (
    <Link href={`/?show=true&id=${photo.id}`}>
      <Image
        src={photo.src.original}
        alt={photo.alt}
        width={0}
        height={0}
        className="w-full h-auto cursor-pointer"
        //   sizes will need to change if breakpoints change in Masonry
        sizes="(max-width: 350px) 100vw, (max-width: 750px) 50vw, 33.33vw"
        {...(priority && { priority })}
        onClick={() => setPhoto(photo)}
      />
    </Link>
  );
}

export default Photo;
