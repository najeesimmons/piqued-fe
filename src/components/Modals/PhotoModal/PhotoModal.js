"use client";
import Comments from "@/components/Comments/Comments";
import ErrorView from "@/components/Views/SearchResults/ErrorView";
import Loader from "@/components/Loader/Loader";
import LoginOrSignupModal from "../LoginOrSignupModal/LoginOrSignupView";
import PhotoView from "@/components/Views/PhotoView";
import ReactDOM from "react-dom";
import Section from "@/components/Section/Section";
import { checkFavoriteSingle } from "../../../../lib/favorite/utils";
import { fetchPexels } from "../../../../utils.js/api";
import { IoCloseSharp } from "react-icons/io5";
import { toggleFavorite } from "../../../../lib/favorite/utils";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

function PhotoModal({ displayPhoto, setDisplayPhoto, setMasonryPhotos }) {
  const [disableComment, setDisableComment] = useState(false);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowAuthCta, setIsShowAuthCta] = useState(false);

  const { user, isAuthLoading } = useAuth();

  const router = useRouter();
  const { id } = router.query;

  const handleClose = useCallback(() => {
    const { id, show, ...restQuery } = router.query;
    router.replace({ pathname: router.pathname, query: restQuery }, undefined, {
      shallow: true,
    });
  }, [router]);

  const handleFavorite = async (displayPhoto) => {
    if (!user) {
      setIsShowAuthCta(true);
      return;
    }

    const { action, success } = await toggleFavorite(displayPhoto);

    if (!success) return;
    const isFavorited = action === "insert";

    setDisplayPhoto((prev) => ({ ...prev, isFavorited: isFavorited }));

    setMasonryPhotos((prev) =>
      prev.map((p) =>
        p.pexels_id === displayPhoto.pexels_id
          ? { ...p, isFavorited: isFavorited }
          : p
      )
    );
  };

  const getPhoto = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    const fetchedPhoto = await fetchPexels("show", { id }, user?.id);
    if (!fetchedPhoto) {
      setIsError(true);
      setIsLoading(false);
      return;
    } else {
      setDisplayPhoto(fetchedPhoto);
    }

    setIsLoading(false);
  }, [id, setDisplayPhoto, user]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (displayPhoto || isAuthLoading) return;

    getPhoto();
  }, [id, isAuthLoading, getPhoto, displayPhoto]);

  useEffect(() => {
    if (user && displayPhoto) {
      const updateDisplayPhotoIfNeeded = async () => {
        if (!("isFavorited" in displayPhoto)) {
          const updatedPhoto = await checkFavoriteSingle(displayPhoto, user.id);
          setDisplayPhoto(updatedPhoto);
        }
      };

      updateDisplayPhotoIfNeeded();
    }
  }, [displayPhoto, setDisplayPhoto, user]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isShowAuthCta) return;
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, isShowAuthCta]);

  let content;
  const photoIsValid = !!displayPhoto?.url;

  if (isLoading) {
    content = (
      <div className="w-full h-full flex justify-center items-center mt-1">
        <Loader />
      </div>
    );
  } else if (isError) {
    content = (
      <div className="w-full h-full flex justify-center items-center mt-1">
        <ErrorView entity={"photo"} retry={getPhoto} />
      </div>
    );
  } else if (photoIsValid) {
    content = (
      <div className="flex flex-col md:flex-row mt-2 md:mt-0">
        <PhotoView
          displayPhoto={displayPhoto}
          handleClose={handleClose}
          handleFavorite={handleFavorite}
        />
        <div className="flex items-center justify-center w-full md:w-1/2 h-full">
          <Comments
            displayPhoto={displayPhoto}
            setIsShowAuthCta={setIsShowAuthCta}
            disableComment={disableComment}
            setDisableComment={setDisableComment}
          />
        </div>
      </div>
    );
  }

  return ReactDOM.createPortal(
    <>
      <Section>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 w-full flex items-center justify-center z-[9999]">
          <div className="flex p-4 md:w-[90vw] w-[100vw] md:h-[90vh] h-[100vh] overflow-y-auto shadow-lg bg-white dark:bg-black">
            {content}
          </div>
        </div>
      </Section>
      {isShowAuthCta && (
        <LoginOrSignupModal
          isOverflowRestoreDelayed={true}
          setIsShowAuthCta={setIsShowAuthCta}
          disableComment={disableComment}
          setDisableComment={setDisableComment}
        />
      )}
    </>,
    document.getElementById("modal-root")
  );
}

export default PhotoModal;
