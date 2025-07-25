// @ts-nocheck
"use client";
import dynamic from "next/dynamic";
import { fetchPexels } from "../../utils.js/api";
import PhotoModal from "@/components/Modals/PhotoModal/PhotoModal";
import Loader from "@/components/Loader/Loader";
import Navigation from "@/components/Navigation/Navigation";
import NoResultsView from "@/components/Views/SearchResults/NoResultsView";
import ErrorView from "@/components/Views/SearchResults/ErrorView";
import SearchBar from "@/components/SearchBar/SearchBar";
import Section from "@/components/Section/Section";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { checkFavoritesArray } from "../../lib/favorite/utils";
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
  const {
    next_page,
    page,
    per_page,
    photos = [],
    total_results,
    error,
  } = response;

  const props = {
    initPhotos: [],
    initHasMore: false,
    initNextPage: null,
    initIsEmpty: false,
    initIsError: false,
  };

  if (!response) {
    props.initIsError = true;
  } else if (photos.length > 0) {
    props.initPhotos = photos;
    props.initNextPage = page + 1;
    props.initHasMore = !!next_page;
  } else {
    props.isEmpty = true;
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
  const [displayPhoto, setDisplayPhoto] = useState();
  const [masonryPhotos, setMasonryPhotos] = useState(initPhotos);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { show } = router.query || {};
  const { search } = router.query || {};

  const { user } = useAuth();

  const getFirstPhotos = useCallback(async () => {
    setIsLoading(true);
    setFetchMode("curated");
    setIsError(false);
    setIsEmpty(false);

    const response = await fetchPexels("curated", user?.id || null);
    const {
      next_page,
      page,
      per_page,
      photos = [],
      total_results,
      error,
    } = response;

    if (!response) {
      setIsError(true);
    } else if (photos.length > 0) {
      setMasonryPhotos(photos);
      setNextPage(2);
      setHasMore(!!next_page);
    } else {
      setMasonryPhotos(photos);
      setHasMore(false);
      setIsEmpty(true);
    }
    setIsLoading(false);
  }, [user]);

  const getFirstSearchPhotos = useCallback(async () => {
    setIsLoading(true);
    setFetchMode("search");
    setIsError(false);
    setIsEmpty(false);
    setNextPage(1);

    const response = await fetchPexels(
      "search",
      { query: searchTerm },
      user?.id || null
    );
    const {
      next_page,
      page,
      per_page,
      photos = [],
      total_results,
      error,
    } = response;

    if (!response) {
      setIsError(true);
    } else if (photos.length > 0) {
      setMasonryPhotos(photos);
      setNextPage(2);
      setHasMore(!!next_page);
      setIsEmpty(false);
      router.push(`/?search=${searchTerm}`, undefined, { shallow: true });
    } else {
      setMasonryPhotos(photos);
      setHasMore(false);
      setIsEmpty(true);
    }
    setIsLoading(false);
  }, [router, searchTerm, user]);

  const getNextPhotos = useCallback(async () => {
    const response = await fetchPexels(
      fetchMode,
      {
        ...(nextPage && { page: nextPage }),
        ...(fetchMode === "search" && { query: searchTerm }),
      },
      user?.id || null
    );

    const {
      next_page,
      page,
      per_page,
      photos = [],
      total_results,
      error,
    } = response;

    if (error) {
      setIsError(true);
      return;
    }

    if (photos.length > 0) {
      setMasonryPhotos((prevPhotos) => [...prevPhotos, ...photos]);
      setNextPage((prevPage) => prevPage + 1);
      setHasMore(!!next_page);
    } else {
      setHasMore(false);
    }
  }, [nextPage, fetchMode, searchTerm, user]);

  useEffect(() => {
    if (!user || !masonryPhotos || masonryPhotos.length === 0) return;

    if (!Object.hasOwn(masonryPhotos[0], "isFavorited")) {
      (async () => {
        const updatedPhotos = await checkFavoritesArray(masonryPhotos, user.id);
        setMasonryPhotos(updatedPhotos);
      })();
    }
  }, [user, masonryPhotos]);

  function renderContent() {
    if (isLoading) return <Loader />;
    if (isError) return <ErrorView retry={getFirstPhotos} />;
    if (isEmpty) return <NoResultsView />;
    return (
      <DynamicPhotoMasonry
        getFirstPhotos={getFirstPhotos}
        getNextPhotos={getNextPhotos}
        hasMore={hasMore}
        masonryPhotos={masonryPhotos}
        setDisplayPhoto={setDisplayPhoto}
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
        <PhotoModal
          displayPhoto={displayPhoto}
          setDisplayPhoto={setDisplayPhoto}
          show={show}
          masonryPhotos={masonryPhotos}
          setMasonryPhotos={setMasonryPhotos}
        />
      )}
    </>
  );
}
