import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function PhotoMasonry({ photos }) {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
      <Masonry>
        {photos.map((photo, index) => {
          return (
            <div key={index} style={{ position: "relative" }}>
              <img src={photo.src.original} alt={photo.photographer} />
              {/* <Image
                src={photo.src.original}
                alt={photo.photographer}
                blurData={photo.src.original}
                width={100}
                height={200}
              /> */}
            </div>
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
}
