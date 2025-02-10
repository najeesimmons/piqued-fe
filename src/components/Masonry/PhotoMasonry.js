import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Photo from "../Photo/Photo";

export default function PhotoMasonry({ photos }) {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
      <Masonry>
        {photos.map((photo, index) => {
          const isPriority = index >= 0 && index <= 6; // Conditionally set priority for index 0-6 "above fold"
          return (
            <Photo
              key={index}
              src={photo.src.original}
              alt={photo.alt}
              priority={isPriority ? true : undefined}
            />
          );
          // return <Photo key={index} src={photo.src.original} alt={photo.alt} />;
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
}
