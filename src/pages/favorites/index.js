"use client";
import dynamic from "next/dynamic";
import { getFavorites } from "../../../lib/favorite";
import Navigation from "@/components/Navigation/Navigation";
import PhotoModal from "@/components/Modals/PhotoModal/PhotoModal";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

const DynamicPhotoMasonry = dynamic(
  () => import("@/components/Masonry/PhotoMasonry"),
  {
    ssr: false,
    //component relies on uses browser-only APIs
  }
);

function Favorites() {
  const [photo, setPhoto] = useState();
  const [hasMore, setHasMore] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [start, setStart] = useState(0);

  const LIMIT = 7;
  const end = start + LIMIT - 1;

  const router = useRouter();
  const { show } = router.query || {};

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
      {show === "true" && (
        <PhotoModal photo={photo} setPhoto={setPhoto} show={show} />
      )}
    </>
  );
}

export default Favorites;
