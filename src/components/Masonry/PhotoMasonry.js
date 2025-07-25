import Loader from "../Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Photo from "../Photo/Photo";
import EndOfResultsView from "../Views/SearchResults/EndOfResultsView";

export default function PhotoMasonry({
  getNextPhotos,
  hasMore,
  masonryPhotos,
  setDisplayPhoto,
}) {
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
                  key={index}
                  photo={photo}
                  priority={isPriority ? true : undefined}
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
