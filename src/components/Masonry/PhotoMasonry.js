import Loader from "../Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Photo from "../Photo/Photo";
import ErrorView from "../Views/ErrorView";
import NoResultsView from "../Views/NoResultsView";

export default function PhotoMasonry({
  getFirstPhotos,
  getNextPhotos,
  hasMore,
  isError,
  isEmpty,
  isLoading,
  photos,
  setPhoto,
}) {
  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ErrorView retry={getFirstPhotos} />;
  }

  if (isEmpty) {
    return <NoResultsView />;
  }
  return (
    <>
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
    </>
  );
}
