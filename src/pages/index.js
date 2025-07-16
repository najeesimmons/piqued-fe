// @ts-nocheck
"use client";
import dynamic from "next/dynamic";
import { fetchPexels } from "../../utils.js/api";
import PhotoModal from "@/components/Modals/PhotoModal/PhotoModal";
import Loader from "@/components/Loader/Loader";
import Navigation from "@/components/Navigation/Navigation";
import NoResultsView from "@/components/Views/NoResultsView";
import ErrorView from "@/components/Views/ErrorView";
import SearchBar from "@/components/SearchBar/SearchBar";
import Section from "@/components/Section/Section";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
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
  } else {
    props.initIsError = true;
  }

  return { props, revalidate: 3600 };
}

export default function Home({
  initHasMore,
  initPhotos,
  initNextPage,
  initIsError,
  initIsEmpty,
}) {
  const [fetchMode, setFetchMode] = useState("curated");
  const [hasMore, setHasMore] = useState(initHasMore);
  const [isEmpty, setIsEmpty] = useState(initIsEmpty);
  const [isError, setIsError] = useState(initIsError);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(initNextPage);
  const [photo, setPhoto] = useState();
  const [photos, setPhotos] = useState(initPhotos);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { show } = router.query || {};
  const { search } = router.query || {};

  const { user, setUser } = useAuth();

  const getFirstPhotos = useCallback(async () => {
    setIsLoading(true);
    setFetchMode("curated");
    setIsError(false);
    setIsEmpty(false);
    const { data, error } = await fetchPexels("curated", user?.id || null);
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
      //regard empty array as an uncaught error
      setIsError(true);
      setPhotos([]);
      setHasMore(false);
      setIsEmpty(false);
    }
    setIsLoading(false);
  }, [user]);

  const getFirstSearchPhotos = useCallback(async () => {
    setIsLoading(true);
    setFetchMode("search");
    setIsError(false);
    setIsEmpty(false);
    setNextPage(1);

    const { data, error } = await fetchPexels(
      "search",
      { query: searchTerm },
      user?.id || null
    );
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
      setIsEmpty(false);
      router.push(`/?search=${searchTerm}`, undefined, { shallow: true });
    } else {
      //regard empty array as an uncaught error
      setIsError(true);
      setPhotos([]);
      setHasMore(false);
      setIsEmpty(false);
    }
    setIsLoading(false);
  }, [router, searchTerm, user]);

  const getNextPhotos = useCallback(async () => {
    const { data, error } = await fetchPexels(fetchMode, {
      ...(nextPage && { page: nextPage }),
      ...(fetchMode === "search" && { query: searchTerm }),
      userId: user?.id || null,
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
  }, [nextPage, fetchMode, searchTerm, user]);

  function renderContent() {
    if (isLoading) return <Loader />;
    if (isError) return <ErrorView retry={getFirstPhotos} />;
    if (isEmpty) return <NoResultsView />;
    return (
      <DynamicPhotoMasonry
        getFirstPhotos={getFirstPhotos}
        getNextPhotos={getNextPhotos}
        hasMore={hasMore}
        photos={photos}
        setPhoto={setPhoto}
      />
    );
  }

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
      <Section>{renderContent()}</Section>
      {show === "true" && (
        <PhotoModal photo={photo} setPhoto={setPhoto} show={show} />
      )}
    </>
  );
}
