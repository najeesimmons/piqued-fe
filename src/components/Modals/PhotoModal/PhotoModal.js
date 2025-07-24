"use client";
import Comments from "@/components/Comments/Comments";
import { fetchPexels } from "../../../../utils.js/api";
import { IoCloseSharp } from "react-icons/io5";
import Loader from "@/components/Loader/Loader";
import ReactDOM from "react-dom";
import Section from "@/components/Section/Section";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toggleFavorite } from "../../../../lib/favorite/utils";
import ErrorView from "@/components/Views/ErrorView";
import PhotoView from "@/components/Views/PhotoView";
import { useAuth } from "@/context/AuthContext";

function PhotoModal({ displayPhoto, setDisplayPhoto, show, setMasonryPhotos }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthLoading } = useAuth();

  const handleClose = useCallback(() => {
    const { id, show, ...restQuery } = router.query;
    router.replace({ pathname: router.pathname, query: restQuery }, undefined, {
      shallow: true,
    });
  }, [router]);

  const handleFavorite = async (displayPhoto) => {
    if (!user) {
      alert("Create an account to start making favorites.");
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
    if (show === "true") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  useEffect(() => {
    if (displayPhoto || isAuthLoading) return;

    getPhoto();
  }, [id, isAuthLoading, getPhoto, displayPhoto]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

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
        <ErrorView retry={getPhoto} />
      </div>
    );
  } else if (photoIsValid) {
    content = (
      <>
        <PhotoView
          displayPhoto={displayPhoto}
          handleFavorite={handleFavorite}
        />
        <div className="flex items-center justify-center w-full md:w-1/2 h-full">
          <Comments displayPhoto={displayPhoto} />
        </div>
      </>
    );
  }

  return ReactDOM.createPortal(
    <Section>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center z-[9999]">
        <div className="flex flex-col md:flex-row p-4 w-[90vw] h-auto md:h-[90vh] shadow-lg bg-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 text-3xl z-[10000]"
            aria-label="Close Modal"
          >
            <IoCloseSharp color="black" size={35} />
          </button>
          {content}
        </div>
      </div>
    </Section>,
    document.getElementById("modal-root")
  );
}

export default PhotoModal;
