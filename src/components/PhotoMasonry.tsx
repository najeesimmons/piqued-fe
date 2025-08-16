import Loader from "./Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Photo from "./Photo";
import EndOfResultsView from "./Views/EndOfResultsView";
import { type NormalizedPhotoGet } from "../../utils.js/api";

interface PhotoMasonryProps {
  getFirstPhotos?: () => void;
  getNextPhotos: () => void;
  hasMore: boolean;
  masonryPhotos: NormalizedPhotoGet[];
  setDisplayPhoto: (displayPhoto: NormalizedPhotoGet) => void;
}

export default function PhotoMasonry({
  getFirstPhotos,
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
        refreshFunction={getFirstPhotos}
        pullDownToRefresh={!!getFirstPhotos}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        }
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
