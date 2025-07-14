"use client";
import dynamic from "next/dynamic";
import { getFavorites } from "../../../lib/favorite";
import Navigation from "@/components/Navigation/Navigation";
import { useCallback, useEffect, useState } from "react";

const DynamicPhotoMasonry = dynamic(
  () => import("@/components/Masonry/PhotoMasonry"),
  {
    ssr: false,
    //component relies on uses browser-only APIs
  }
);

function Favorites() {
  const [, setPhoto] = useState();
  const [hasMore, setHasMore] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [start, setStart] = useState(0);

  const LIMIT = 7;
  const end = start + LIMIT - 1;

  const getFirstFavorites = useCallback(async () => {
    const result = await getFavorites(0, LIMIT - 1); //0,6
    if (!result) return;

    const { favorites, count } = result;
    setFavorites(favorites);
    setHasMore(LIMIT < count); // 7 < count
    setStart(LIMIT); // 7
  }, []);

  const getNextFavorites = useCallback(async () => {
    const end = start + LIMIT - 1;
    const result = await getFavorites(start, end);
    if (!result) return;

    const { favorites: nextFavorites, count } = result;

    setFavorites((prev) => [...prev, ...nextFavorites]);
    setStart(end + 1);
    setHasMore(end + 1 < count);
  }, [start]);

  useEffect(() => {
    getFirstFavorites();
  }, [getFirstFavorites]);

  return (
    <>
      <Navigation />
      <DynamicPhotoMasonry
        getNextPhotos={getNextFavorites}
        hasMore={hasMore}
        photos={favorites}
        setPhoto={setPhoto}
      />
    </>
  );
}

export default Favorites;
