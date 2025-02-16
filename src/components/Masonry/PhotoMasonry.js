import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Photo from "../Photo/Photo";

export default function PhotoMasonry({ photos, setPhoto }) {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
      <Masonry>
        {photos.map((photo, index) => {
          const isPriority = index >= 0 && index <= 6;
          return (
            <Photo
              key={index}
              photo={photo}
              priority={isPriority ? true : undefined}
              setPhoto={setPhoto}
            />
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
}
