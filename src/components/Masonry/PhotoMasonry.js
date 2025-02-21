import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Photo from "../Photo/Photo";
import { useEffect } from "react";

export default function PhotoMasonry({
  photos,
  setPhoto,
  getNextPhotos,
  hasMore,
}) {
  useEffect(() => {
    console.log("re-rendered PhotoMasonry 📸");
  }, []);

  return (
    <InfiniteScroll
      dataLength={photos.length}
      endMessage={<p>No More!</p>}
      hasMore={hasMore}
      loader={<h4>Loading</h4>}
      next={getNextPhotos}
    >
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
    </InfiniteScroll>
  );
}
