"use client";
import dynamic from "next/dynamic";
import ErrorView from "@/components/Views/ErrorView";
import Link from "next/link";
import Loader from "@/components/Loader/Loader";
import LoginOrSignupModal from "@/components/Modals/LoginOrSignupModal/LoginOrSignupView";
import Navigation from "@/components/Navigation/Navigation";
import NoResultsView from "@/components/Views/NoResultsView";
import PhotoModal from "@/components/Modals/PhotoModal/PhotoModal";
import SearchBar from "@/components/SearchBar/SearchBar";
import Section from "@/components/Section/Section";
import { checkFavoritesArray } from "../../lib/favorite/utils";
import { pexelsList } from "../../utils.js/api";
import { SiPexels } from "react-icons/si";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useCallback, useState } from "react";
import type { TransformedPhotoGet, TransformedPhotoList, Endpoint } from "../../utils.js/api";
require("dotenv").config();

const DynamicPhotoMasonry = dynamic(
  () => import("@/components/Masonry/PhotoMasonry"),
  {
    ssr: false,
    //component relies on uses browser-only APIs
  }
);

type ListEndpoint = Exclude<Endpoint, "show">;

export async function getStaticProps() {
  const response: TransformedPhotoList | null = await pexelsList("curated", {});
  
  const props = {
    initPhotos: [] as TransformedPhotoGet[],
    initHasMore: false,
    initNextPage: null as number | null,
    initIsEmpty: false,
    initIsError: false,
  };

  if (!response) {
    props.initIsError = true;
  } else {
    const {
      next_page,
      page,
      photos = [],
    } = response;

    if (photos.length > 0) {
      props.initPhotos = photos;
      props.initNextPage = (page || 0) + 1;
      props.initHasMore = !!next_page;
    } else {
      props.initIsEmpty = true;
    }
  }

  return { props, revalidate: 3600 };
}

export default function Home({
  initHasMore,
  initPhotos,
  initNextPage,
  initIsError,
  initIsEmpty,
}: {
  initHasMore: boolean;
  initPhotos: TransformedPhotoGet[];
  initNextPage: number | null;
  initIsError: boolean;
  initIsEmpty: boolean;
}) {
  const [displayPhoto, setDisplayPhoto] = useState<TransformedPhotoGet | null>(null);
  const [fetchMode, setFetchMode] = useState<ListEndpoint>("curated");
  const [hasMore, setHasMore] = useState<boolean>(initHasMore);
  const [masonryPhotos, setMasonryPhotos] = useState<TransformedPhotoGet[] | []>(initPhotos);
  const [nextPage, setNextPage] = useState<number | undefined>(initNextPage || undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isEmpty, setIsEmpty] = useState<boolean>(initIsEmpty);
  const [isError, setIsError] = useState<boolean>(initIsError);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowAuthCta, setIsShowAuthCta] = useState<boolean>(false);

  const router = useRouter();

  const { show } = router.query || {};
  const { search } = router.query || {};
  const { user } = useAuth();

  const getFirstPhotos = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);
    setFetchMode("curated");
    setIsEmpty(false);

    const response: TransformedPhotoList | null = await pexelsList("curated", {}, user?.id);

    if (!response) {
      setIsError(true);
    } else {
      const {
        next_page,
        photos = [],
      } = response;

      if (photos.length > 0) {
        setMasonryPhotos(photos);
        setNextPage(2);
        setHasMore(!!next_page);
      } else {
        setMasonryPhotos(photos);
        setHasMore(false);
        setIsEmpty(true);
      }
    }
    setIsLoading(false);
  }, [user]);

  const getFirstSearchPhotos = useCallback(async () => {
    setIsLoading(true);
    setFetchMode("search");
    setIsError(false);
    setIsEmpty(false);
    setNextPage(1);

    const response: TransformedPhotoList | null = await pexelsList(
      "search",
      { query: searchTerm },
      user?.id
    );

    if (!response) {
      setIsError(true);
    } else {
      const {
        next_page,
        photos = [],
      } = response;

      if (photos.length > 0) {
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
    }
    setIsLoading(false);
  }, [router, searchTerm, user]);

  const getNextPhotos = useCallback(async () => {
    const response: TransformedPhotoList | null = await pexelsList (
      fetchMode,
      {
        ...(nextPage && { page: nextPage }),
        ...(fetchMode === "search" && { query: searchTerm }),
      },
      user?.id
    );

    if (!response) {
      setIsError(true);
      return;
    }

    const {
      next_page,
      photos = [],
    } = response;

    if (photos.length > 0) {
      setMasonryPhotos((prevPhotos) => [...prevPhotos, ...photos]);
      setNextPage((prevPage) => (prevPage || 0) + 1);
      setHasMore(!!next_page);
    } else {
      setHasMore(false);
    }
  }, [nextPage, fetchMode, searchTerm, user]);

  useEffect(() => {
    if (!user || !masonryPhotos || masonryPhotos.length === 0) return;

    if (!Object.prototype.hasOwnProperty.call(masonryPhotos[0], "isFavorited")) {
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
      <Section>
        <div className="flex items-center mb-3">
          <span className="font-base text-sm">Photos provided by</span>
          <Link
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center ml-2"
          >
            <SiPexels size={30} color="#01a081" />
            <span className="font-semibold ml-2">Pexels</span>
          </Link>
        </div>
      </Section>
      <Section>{renderContent()}</Section>
      {show && (
        <PhotoModal
          displayPhoto={displayPhoto}
          setDisplayPhoto={setDisplayPhoto}
          setMasonryPhotos={setMasonryPhotos}
        />
      )}
      {isShowAuthCta && (
        <LoginOrSignupModal 
          setIsShowAuthCta={setIsShowAuthCta} 
        />
      )}
    </>
  );
}
