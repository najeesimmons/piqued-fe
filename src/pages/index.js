"use client";
import dynamic from "next/dynamic";
import { fetchPexels } from "../../utils.js/api";
import PhotoModal from "@/components/Modals/PhotoModal/PhotoModal";
import Navigation from "@/components/Navigation/Navigation";
import SearchBar from "@/components/SearchBar/SearchBar";
import Section from "@/components/Section/Section";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
require("dotenv").config();

const DynamicPhotoMasonry = dynamic(
  () => import("@/components/Masonry/PhotoMasonry"),
  {
    ssr: false,
    //component relies on uses browser-only APIs
  }
);

export async function getStaticProps() {
  const response = await fetchPexels("curated");

  if (response) {
    const { photos, page, next_page } = response;
    return {
      props: {
        initPhotos: photos,
        initNextPage: page + 1,
        initHasMore: !!next_page,
      },
      revalidate: 3600,
    };
  }
  return { props: { initPhotos: [] }, revalidate: 3600 };
}

export default function Home({ initHasMore, initPhotos, initNextPage }) {
  const [fetchMode, setFetchMode] = useState("curated");
  const [hasMore, setHasMore] = useState(initHasMore);
  const [isError, setIsError] = useState(false);
  const [nextPage, setNextPage] = useState(initNextPage);
  const [photo, setPhoto] = useState();
  const [photos, setPhotos] = useState(initPhotos || []);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { show } = router.query || {};
  const { search } = router.query || {};

  const getFirstSearchPhotos = useCallback(async () => {
    setNextPage(1);

    const response = await fetchPexels("search", { query: searchTerm });
    if (response) {
      const { photos: firstSearchPhotos, next_page } = response;

      setPhotos(firstSearchPhotos);
      setNextPage((prevPage) => prevPage + 1);
      setHasMore(!!next_page);
      setFetchMode("search");
      router.push(`/?search=${searchTerm}`, undefined, { shallow: true });
    } else {
      setIsError(true);
    }
  }, [router, searchTerm]);

  const getNextPhotos = useCallback(async () => {
    const response = await fetchPexels(fetchMode, {
      ...(nextPage && { page: nextPage }),
      ...(fetchMode === "search" && { query: searchTerm }),
    });
    if (response) {
      setPhotos((prevPhotos) => [...prevPhotos, ...response.photos]);
      setNextPage((prevPage) => prevPage + 1);
      setHasMore(!!response.next_page);
    } else {
      setIsError(true);
    }
  }, [nextPage, fetchMode, searchTerm]);

  useEffect(() => {
    console.log("home re-rendered 🏠");
  }, []);

  useEffect(() => {
    console.log("fetchMode:", fetchMode);
  }, [fetchMode]);

  return (
    <>
      <Navigation />
      <Section>
        <SearchBar
          getSearchPhotos={getFirstSearchPhotos}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
      </Section>
      <Section>
        <DynamicPhotoMasonry
          getNextPhotos={getNextPhotos}
          hasMore={hasMore}
          isError={isError}
          photos={photos}
          setPhoto={setPhoto}
        />
      </Section>
      {show === "true" && (
        <PhotoModal photo={photo} setPhoto={setPhoto} show={show} />
      )}
    </>
  );
}
