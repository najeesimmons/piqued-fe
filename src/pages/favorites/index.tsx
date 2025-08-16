"use client";
import ErrorView from "@/components/Views/ErrorView";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import LoginOrSignupModal from "@/components/LoginOrSignupModal";
import Navigation from "@/components/Navigation";
import NoResultsView from "@/components/Views/NoResultsView";
import PhotoModal from "@/components/PhotoModal";
import Section from "@/components/Section";
import { getFavorites } from "../../../lib/favorite/favorite";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NormalizedPhotoGet } from "../../../lib/pexels/types";

const DynamicPhotoMasonry = dynamic(
  () => import("@/components/PhotoMasonry"),
  {
    ssr: false,
    //component relies on uses browser-only APIs
  }
);

function Favorites() {
  const [displayPhoto, setDisplayPhoto] = useState<NormalizedPhotoGet | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [masonryPhotos, setMasonryPhotos] = useState<NormalizedPhotoGet[]>([]);
  const [start, setStart] = useState<number>(0);

  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowAuthCta, setIsShowAuthCta] = useState(false);

  const { user } = useAuth();

  const router = useRouter();
  const { show } = router.query || {};

  const LIMIT = 12;

  const getFirstFavorites = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setIsEmpty(false);
    setMasonryPhotos([]);
    setHasMore(false);
    setStart(0);

    const result = await getFavorites(0, LIMIT - 1);

    if (!result) {
      setIsError(true);
    } else {
      const { favorites, count } = result;
      if (favorites.length === 0) {
        setIsEmpty(true);
      } else {
        setMasonryPhotos(favorites);
        setHasMore(LIMIT < count!);
        setStart(LIMIT);
      }
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
    setHasMore(end + 1 < count!);
  }, [start]);

  useEffect(() => {
    if (!user) return;
    getFirstFavorites();
  }, [getFirstFavorites, user]);

  function renderContent() {
    if (isLoading) return <Loader />;
    if (isError)
      return <ErrorView entity={"favorites"} retry={getFirstFavorites} />;
    if (isEmpty) return <NoResultsView type="favorites" />;
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
        <Navigation setIsShowAuthCta={setIsShowAuthCta} />
      </Section>
      {user ? (
        <>
          <Section>{renderContent()}</Section>
          {show === "true" && (
            <PhotoModal
              displayPhoto={displayPhoto}
              setDisplayPhoto={setDisplayPhoto}
              setMasonryPhotos={setMasonryPhotos}
            />
          )}
        </>
      ) : (
        <Section>
          <p className="text-center mt-32">
            Please{" "}
            <button
              className="font-semibold"
              onClick={() => setIsShowAuthCta(true)}
            >
              login or signup
            </button>{" "}
            to view or save favorites.
          </p>
        </Section>
      )}
      {isShowAuthCta && (
        <LoginOrSignupModal setIsShowAuthCta={setIsShowAuthCta} />
      )}
    </>
  );
}

export default Favorites;
