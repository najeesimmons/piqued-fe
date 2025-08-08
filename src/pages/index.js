// @ts-nocheck
"use client";
import dynamic from "next/dynamic";
import ErrorView from "@/components/Views/SearchResults/ErrorView";
import Link from "next/link";
import Loader from "@/components/Loader/Loader";
import LoginOrSignupModal from "@/components/Modals/LoginOrSignupModal/LoginOrSignupView";
import Navigation from "@/components/Navigation/Navigation";
import NoResultsView from "@/components/Views/SearchResults/NoResultsView";
import PhotoModal from "@/components/Modals/PhotoModal/PhotoModal";
import SearchBar from "@/components/SearchBar/SearchBar";
import Section from "@/components/Section/Section";
import { checkFavoritesArray } from "../../lib/favorite/utils";
import { fetchPexels } from "../../utils.js/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
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
  const [displayPhoto, setDisplayPhoto] = useState(null);
  const [fetchMode, setFetchMode] = useState("curated");
  const [hasMore, setHasMore] = useState(initHasMore);
  const [masonryPhotos, setMasonryPhotos] = useState(initPhotos);
  const [nextPage, setNextPage] = useState(initNextPage);
  const [searchTerm, setSearchTerm] = useState("");

  const [isEmpty, setIsEmpty] = useState(initIsEmpty);
  const [isError, setIsError] = useState(initIsError);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowAuthCta, setIsShowAuthCta] = useState(false);

  const router = useRouter();

  const { show } = router.query || {};
  const { search } = router.query || {};
  const { user } = useAuth();

  const getFirstPhotos = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);
    setFetchMode("curated");
    setIsEmpty(false);

    const response = await fetchPexels("curated", undefined, user?.id);
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

  useEffect(() => {
    if (!user) {
      setMasonryPhotos((prevPhotos) => {
        const hasAnyFavorited = prevPhotos.some((p) => "isFavorited" in p);
        if (!hasAnyFavorited) return prevPhotos;

        return prevPhotos.map(({ isFavorited, ...rest }) => rest);
      });
    }
  }, [user]);

  function renderContent() {
    if (isLoading) return <Loader />;
    if (isError) return <ErrorView entity={"photos"} retry={getFirstPhotos} />;
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
      <Navigation setIsShowAuthCta={setIsShowAuthCta} />
      <Section>
        <SearchBar
          getFirstPhotos={getFirstPhotos}
          getSearchPhotos={getFirstSearchPhotos}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          isDisabled={show || isShowAuthCta}
        />
      </Section>

      <Link href="https://www.pexels.com" className="flex items-center mb-3">
        <span className="font-semibold">Photos provided by</span>
        <Image
          src="https://images.pexels.com/lib/api/pexels.png"
          alt="pexels logo"
          width={100} // ✅ use numbers (in pixels)
          height={100}
          style={{ objectFit: "contain", marginLeft: 10 }} // ✅ objectFit goes inside `style`
        />
      </Link>
      <Section>{renderContent()}</Section>
      {show && (
        <PhotoModal
          displayPhoto={displayPhoto}
          setDisplayPhoto={setDisplayPhoto}
          masonryPhotos={masonryPhotos}
          setMasonryPhotos={setMasonryPhotos}
        />
      )}
      {isShowAuthCta && (
        <LoginOrSignupModal setIsShowAuthCta={setIsShowAuthCta} />
      )}
    </>
  );
}
