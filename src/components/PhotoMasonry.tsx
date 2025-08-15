import Loader from "./Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Photo from "./Photo";
import EndOfResultsView from "./Views/EndOfResultsView";
import { type TransformedPhotoGet } from "../../utils.js/api";

interface PhotoMasonryProps {
  getNextPhotos: () => void;
  hasMore: boolean;
  masonryPhotos: TransformedPhotoGet[];
  setDisplayPhoto: (displayPhoto: TransformedPhotoGet) => void;
}

export default function PhotoMasonry({
  getNextPhotos,
  hasMore,
  masonryPhotos,
  setDisplayPhoto,
}: PhotoMasonryProps) {
  return (
    <>
      <InfiniteScroll
        dataLength={masonryPhotos.length}
        endMessage={<EndOfResultsView />}
        hasMore={hasMore}
        loader={<Loader />}
        next={getNextPhotos}
      >
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry>
            {masonryPhotos.map((photo, index) => {
              const isPriority = index >= 0 && index <= 6;
              return (
                <Photo
                  key={`${index}-${photo.pexels_id}`}
                  photo={photo}
                  priority={isPriority}
                  setDisplayPhoto={setDisplayPhoto}
                />
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      </InfiniteScroll>
    </>
  );
}
