"use client";
import dynamic from "next/dynamic";
import Section from "@/components/Section/Section";
import { getFavorites } from "../../../lib/favorite/favorite";
import Navigation from "@/components/Navigation/Navigation";
import PhotoModal from "@/components/Modals/PhotoModal/PhotoModal";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/components/Loader/Loader";
import NoResultsView from "@/components/Views/SearchResults/NoResultsView";
import ErrorView from "@/components/Views/SearchResults/ErrorView";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const DynamicPhotoMasonry = dynamic(
  () => import("@/components/Masonry/PhotoMasonry"),
  {
    ssr: false,
    //component relies on uses browser-only APIs
  }
);

function Favorites() {
  const [displayPhoto, setDisplayPhoto] = useState();
  const [hasMore, setHasMore] = useState(false);
  const [masonryPhotos, setMasonryPhotos] = useState([]);
  const [start, setStart] = useState(0);
  const [isLoading, setIsLoading] = useState();
  const [isError, setIsError] = useState();
  const [isEmpty, setIsEmpty] = useState();
  const { user } = useAuth();

  const LIMIT = 12;
  const end = start + LIMIT - 1;

  const router = useRouter();
  const { show } = router.query || {};

  const getFirstFavorites = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setIsEmpty(false);
    setMasonryPhotos([]);
    setHasMore(false);
    setStart(0);

    const result = await getFavorites(0, LIMIT - 1);
    const { favorites, count } = result;

    if (!result) {
      setIsError(true);
    } else if (favorites.length === 0) {
      setIsEmpty(true);
    } else {
      setMasonryPhotos(favorites);
      setHasMore(LIMIT < count);
      setStart(LIMIT);
    }

    setIsLoading(false);
  }, []);

  const getNextFavorites = useCallback(async () => {
    const end = start + LIMIT - 1;
    const result = await getFavorites(start, end);

    if (!result) {
      setIsError(true);
      return;
    }
    const { favorites: nextFavorites, count } = result;

    setMasonryPhotos((prev) => {
      const existingIds = new Set(prev.map((fav) => fav.pexels_id));

      const newUniqueFavorites = nextFavorites.filter(
        (fav) => !existingIds.has(fav.pexels_id)
      );

      return [...prev, ...newUniqueFavorites];
    });

    setStart(end + 1);
    setHasMore(end + 1 < count);
  }, [start]);

  useEffect(() => {
    getFirstFavorites();
  }, [getFirstFavorites]);

  function renderContent() {
    if (isLoading) return <Loader />;
    if (isError) return <ErrorView retry={getFirstFavorites} />;
    if (isEmpty) return <NoResultsView />;
    return (
      <DynamicPhotoMasonry
        getFirstPhotos={getFirstFavorites}
        getNextPhotos={getNextFavorites}
        hasMore={hasMore}
        masonryPhotos={masonryPhotos}
        setDisplayPhoto={setDisplayPhoto}
      />
    );
  }

  return (
    <>
      <Section>
        <Navigation />
      </Section>
      {user ? (
        <>
          <Section>{renderContent()}</Section>
          {show === "true" && (
            <PhotoModal
              displayPhoto={displayPhoto}
              setDisplayPhoto={setDisplayPhoto}
              show={show}
              masonryPhotos={masonryPhotos}
              setMasonryPhotos={setMasonryPhotos}
            />
          )}
        </>
      ) : (
        <Section>
          <p className="text-center mt-32">
            Already a member?{" "}
            <Link className="font-semibold" href="/login">
              Log in
            </Link>{" "}
            to view your favorites. New here?{" "}
            <Link className="font-semibold" href="/signup">
              Sign up
            </Link>{" "}
            to get started!
          </p>
        </Section>
      )}
    </>
  );
}

export default Favorites;
