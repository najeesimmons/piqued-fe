import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

function PhotoMasonry({ photos }) {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
      gutterBreakpoints={{ 350: "12px", 750: "16px", 900: "24px" }}
    >
      {/* need fallback image for empty array */}
      <Masonry>
        {photos.map((photo, index) => (
          <img key={index} src={photo.src.original} alt={photo.photographer} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}

export default PhotoMasonry;
