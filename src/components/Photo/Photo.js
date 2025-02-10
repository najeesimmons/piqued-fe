import Image from "next/image";

function Photo({ src, alt, priority }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      className="w-full h-auto"
      //   sizes will need to change if breakpoints change in Masonry
      sizes="(max-width: 350px) 100vw, (max-width: 750px) 50vw, 33.33vw"
      {...(priority && { priority })}
    />
  );
}

export default Photo;
