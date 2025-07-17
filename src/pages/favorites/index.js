"use client";
import dynamic from "next/dynamic";
import Section from "@/components/Section/Section";
import { getFavorites } from "../../../lib/favorites/favorite";
import Navigation from "@/components/Navigation/Navigation";
import PhotoModal from "@/components/Modals/PhotoModal/PhotoModal";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/components/Loader/Loader";
import NoResultsView from "@/components/Views/NoResultsView";
import ErrorView from "@/components/Views/ErrorView";

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
  const [favorites, setFavorites] = useState([]);
  const [start, setStart] = useState(0);
  const [isLoading, setIsLoading] = useState();
  const [isError, setIsError] = useState();
  const [isEmpty, setIsEmpty] = useState();

  const LIMIT = 12;
  const end = start + LIMIT - 1;

  const router = useRouter();
  const { show } = router.query || {};

  const getFirstFavorites = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setIsEmpty(false);
    setFavorites([]);
    setHasMore(false);
    setStart(0);

    const result = await getFavorites(0, LIMIT - 1);

    if (!result) {
      setIsError(true);
    } else if (result.favorites.length === 0) {
      setIsEmpty(true);
    } else {
      const { favorites, count } = result;
      setFavorites(favorites);
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

    setFavorites((prev) => {
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
        photos={favorites}
        setPhoto={setDisplayPhoto}
      />
    );
  }

  return (
    <>
      <Section>
        <Navigation />
      </Section>
      <Section>{renderContent()}</Section>
      {show === "true" && (
        <PhotoModal
          displayPhoto={displayPhoto}
          setDiplayPhoto={setDisplayPhoto}
          show={show}
          photos={favorites}
          setPhotos={setFavorites}
        />
      )}
    </>
  );
}

export default Favorites;
