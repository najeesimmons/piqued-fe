import Loader from "../Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Photo from "../Photo/Photo";
import { useEffect } from "react";

export default function PhotoMasonry({
  getNextPhotos,
  hasMore,
  isError,
  photos,
  setPhoto,
}) {
  useEffect(() => {
    console.log("re-rendered PhotoMasonry 📸");
  }, []);

  // TODO: what do I really want to happen if there's an error.
  // I can still show the photos that were already loaded -- so
  // I should display some message in a popup modal saying there
  // was an issue geting photos then turn is Error off when user
  // clicks out. That way it will be set again if they click out

  return (
    <InfiniteScroll
      dataLength={photos.length}
      endMessage={<p>No More!</p>}
      hasMore={hasMore}
      loader={<Loader />}
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
