import Image from "next/image";
import Link from "next/link";
import { usePhoto } from "@/context/PhotoContext";
// import { useRouter } from "next/router";

function Photo({ photo, priority }) {
  const { setActivePhoto } = usePhoto();
  // const router = useRouter();
  // const handleClick = () => {
  //   router.push({ pathname: `/photos/${id}`, query: { id: id } });
  // };
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
        onClick={() => setActivePhoto(photo)}
      />
    </Link>
  );
}

export default Photo;
