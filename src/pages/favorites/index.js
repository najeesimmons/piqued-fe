"use client";
import dynamic from "next/dynamic";
import { getFavorites } from "../../../lib/favorite";
import Navigation from "@/components/Navigation/Navigation";
import { useEffect, useState } from "react";

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

  const getFirstFavorites = async () => {
    const { favorites, count } = await getFavorites(start, end); //0,6
    setFavorites(favorites);
    setHasMore(end + 1 < count);
    setStart(end + 1);
  };

  const getNextFavorites = async () => {
    const end = start + LIMIT - 1;

    const { favorites: nextFavorites, count } = await getFavorites(start, end);

    setFavorites((prev) => [...prev, ...nextFavorites]);
    setStart(end + 1);
    setHasMore(end + 1 < count);
  };

  useEffect(() => {
    getFirstFavorites();
  }, []);

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
