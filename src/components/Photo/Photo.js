import Image from "next/image";
import { useRouter } from "next/router";

function Photo({ src, alt, id, priority }) {
  const router = useRouter();
  const handleClick = () => {
    router.push({ pathname: `/photos/${id}`, query: { id: id } });
  };
  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      className="w-full h-auto cursor-pointer"
      //   sizes will need to change if breakpoints change in Masonry
      sizes="(max-width: 350px) 100vw, (max-width: 750px) 50vw, 33.33vw"
      {...(priority && { priority })}
      onClick={handleClick}
    />
  );
}

export default Photo;
