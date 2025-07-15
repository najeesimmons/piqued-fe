// @ts-nocheck
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
  const { data, error } = await fetchPexels("curated");

  const props = {
    initPhotos: [],
    initHasMore: false,
    initNextPage: null,
    initIsEmpty: false,
    initIsError: false,
  };

  if (error) {
    if (error.message.includes("Invalid or empty photo list")) {
      props.initIsEmpty = true;
    } else {
      props.initIsError = true;
    }
  } else if (data?.photos?.length > 0) {
    const { photos, page, next_page } = data;
    props.initPhotos = photos;
    props.initNextPage = page + 1;
    props.initHasMore = !!next_page;
  }

  return { props, revalidate: 3600 };
}

export default function Home({
  initHasMore,
  initPhotos,
  initNextPage,
  initIsError,
}) {
  const [fetchMode, setFetchMode] = useState("curated");
  const [hasMore, setHasMore] = useState(initHasMore);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isError, setIsError] = useState(initIsError);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(initNextPage);
  const [photo, setPhoto] = useState();
  const [photos, setPhotos] = useState(initPhotos);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { show } = router.query || {};
  const { search } = router.query || {};

  const getFirstPhotos = useCallback(async () => {
    setIsLoading(true);
    setFetchMode("curated");
    setIsError(false);
    setIsEmpty(false);
    const { data, error } = await fetchPexels("curated");
    if (error) {
      if (error.message.includes("Invalid or empty photo list")) {
        setIsEmpty(true);
        setIsError(false);
      } else {
        setIsError(true);
        setIsEmpty(false);
      }
      setPhotos([]);
      setHasMore(false);
    } else if (data.photos.length > 0) {
      setPhotos(data.photos);
      setNextPage(2);
      setHasMore(!!data.next_page);
    } else {
      setIsError(true);
      setPhotos([]);
      setHasMore(false);
      setIsEmpty(false);
    }
    setIsLoading(false);
  }, []);

  const getFirstSearchPhotos = useCallback(async () => {
    setIsLoading(true);
    setFetchMode("search");
    setIsError(false);
    setIsEmpty(false);
    setNextPage(1);

    const { data, error } = await fetchPexels("search", { query: searchTerm });
    if (error) {
      if (error.message.includes("Invalid or empty photo list")) {
        setIsEmpty(true);
        setIsError(false);
      } else {
        setIsError(true);
        setIsEmpty(false);
      }
      setPhotos([]);
      setHasMore(false);
    } else if (data.photos.length > 0) {
      setPhotos(data.photos);
      setNextPage(2);
      setHasMore(!!data.next_page);
      // setFetchMode("search");
      setIsEmpty(false);
      router.push(`/?search=${searchTerm}`, undefined, { shallow: true });
    }
  }, [router, searchTerm]);

  const getNextPhotos = useCallback(async () => {
    const { data, error } = await fetchPexels(fetchMode, {
      ...(nextPage && { page: nextPage }),
      ...(fetchMode === "search" && { query: searchTerm }),
    });

    if (error) {
      setIsError(true);
      return;
    }

    if (data?.photos?.length > 0) {
      setPhotos((prevPhotos) => [...prevPhotos, ...data.photos]);
      setNextPage((prevPage) => prevPage + 1);
      setHasMore(!!data.next_page);
    } else {
      setHasMore(false);
    }
  }, [nextPage, fetchMode, searchTerm]);

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
          getFirstPhotos={getFirstPhotos}
          getNextPhotos={getNextPhotos}
          hasMore={hasMore}
          isEmpty={isEmpty}
          isError={isError}
          isLoading={isLoading}
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
