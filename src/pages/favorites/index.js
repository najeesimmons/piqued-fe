"use client";
import dynamic from "next/dynamic";
import { getFavorites } from "../../../lib/favorite";
import Navigation from "@/components/Navigation/Navigation";
import { useEffect, useState } from "react";

const DynamicPhotoMasonry = dynamic(
  () => import("@/components/Masonry/PhotoMasonry"),
  {
    ssr: false,
    // can't use ssr b/c component relies on uses browser-only APIs (e.g., window, document etc.)
  }
);

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [photo, setPhoto] = useState();
  const [hasMore, sethasMore] = useState();
  const [startRange, setstartRange] = useState(0);
  const [limit] = useState(9);
  const [endRange, setEndRange] = useState(limit);

  const getFirstFavorites = async () => {
    const response = await getFavorites(startRange, limit);
    setFavorites(response);
    //importnant edgecase needs to be caught here, what if we end on a set of 10 but there happen t0 be no more photos after?
    if (favorites.length < limit) {
      sethasMore(true);
    } else {
      sethasMore(false);
    }
  };

  const getNextFavorites = async () => {
    const response = await getFavorites(startRange, endRange);
    console.log("second reponse", response);
    setFavorites((prev) => [...prev, ...response]);
    setstartRange((prev) => prev + favorites.length);
    setEndRange((prev) => prev + limit);
    if (response.length < limit) {
      sethasMore(false);
    } else {
      sethasMore(true);
    }
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
