"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import SearchBar from "@/components/SearchBar/SearchBar";
import Section from "@/components/Section/Section";
import dynamic from "next/dynamic";
import PhotoModal from "@/components/Modals/PhotoModal";
import { fetchPexels } from "../../utils.js/api";

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
      props: { initPhotos: response.photos, initNextPage: response.page + 1 },
      revalidate: 3600,
    };
  }
  return { props: { initPhotos: [] }, revalidate: 3600 };
}

export default function Home({ initPhotos, initNextPage }) {
  const [hasMore, setHasMore] = useState(true);
  const [isError, setIsError] = useState(false);
  const [nextPage, setNextPage] = useState(initNextPage);
  const [photo, setPhoto] = useState();
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { show } = router.query;

  const getSearchPhotos = useCallback(async () => {
    try {
      const response = await fetchPexels("search", { query: searchTerm });
      setPhotos(response.photos);
    } catch (error) {
      setIsError(true);
    }
  }, [searchTerm]);

  const getNextPhotos = useCallback(async () => {
    try {
      const response = await fetchPexels("curated", { page: nextPage });
      setPhotos((prevPhotos) => [...prevPhotos, ...response.photos]);
      setNextPage((prevPage) => prevPage + 1);
      setHasMore(!!response.next_page);
    } catch (error) {
      setIsError(true);
    }
  }, [nextPage]);

  useEffect(() => {
    console.log("home re-rendered 🏠");
  }, []);

  useEffect(() => {
    if (!initPhotos) {
      return;
    }
    setPhotos(initPhotos);
  }, [initPhotos]);

  if (isError) return <h1>Error loading photos</h1>;

  return (
    <>
      <Section>
        <SearchBar
          getSearchPhotos={getSearchPhotos}
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
