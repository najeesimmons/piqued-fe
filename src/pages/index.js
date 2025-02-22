"use client";
import dynamic from "next/dynamic";
import { fetchPexels } from "../../utils.js/api";
import PhotoModal from "@/components/Modals/PhotoModal";
import SearchBar from "@/components/SearchBar/SearchBar";
import Section from "@/components/Section/Section";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
require("dotenv").config();

const DynamicPhotoMasonry = dynamic(
  () => import("@/components/Masonry/PhotoMasonry"),
  {
    ssr: false,
  }
);

export async function getStaticProps() {
  const response = await fetchPexels("curated");
  if (response) {
    return {
      props: {
        initPhotos: response.photos,
        initNextPage: response.page + 1,
        initHasMore: !!response.next_page,
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

  const getFirstSearchPhotos = useCallback(async () => {
    setNextPage(1);
    try {
      const response = await fetchPexels("search", { query: searchTerm });
      setPhotos(response.photos);
      setNextPage((prevPage) => prevPage + 1);
      setHasMore(!!response.next_page);
      setFetchMode("search");
    } catch (error) {
      setIsError(true);
    }
  }, [searchTerm]);

  const getNextPhotos = useCallback(async () => {
    try {
      const response = await fetchPexels(fetchMode, {
        ...(nextPage && { page: nextPage }),
        ...(fetchMode === "search" && { query: searchTerm }),
      });
      setPhotos((prevPhotos) => [...prevPhotos, ...response.photos]);
      setNextPage((prevPage) => prevPage + 1);
      setHasMore(!!response.next_page);
    } catch (error) {
      setIsError(true);
    }
  }, [nextPage, fetchMode, searchTerm]);

  useEffect(() => {
    console.log("home re-rendered 🏠");
  }, []);

  useEffect(() => {
    console.log(fetchMode);
  }, [fetchMode]);

  if (isError) return <h1>Error loading photos</h1>;

  return (
    <>
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
