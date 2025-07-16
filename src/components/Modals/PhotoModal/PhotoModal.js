"use client";
import Comments from "@/components/Comments/Comments";
import { fetchPexels } from "../../../../utils.js/api";
import { IoCloseSharp } from "react-icons/io5";
import Loader from "@/components/Loader/Loader";
import ReactDOM from "react-dom";
import Section from "@/components/Section/Section";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toggleFavorite } from "../../../../lib/favorite";
import ErrorView from "@/components/Views/ErrorView";
import PhotoView from "@/components/Views/PhotoView";
import { useAuth } from "@/context/AuthContext";

function PhotoModal({ photo, setPhoto, show }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const handleClose = useCallback(() => {
    const { id, show, ...restQuery } = router.query;
    router.replace({ pathname: router.pathname, query: restQuery }, undefined, {
      shallow: true,
    });
  }, [router]);

  const handleFavorite = async ({ photo }) => {
    const { action, success } = await toggleFavorite({ photo });

    if (!success) return;
    // need ui indication of problem
    else if (action === "insert") {
      setPhoto((prev) => ({ ...prev, isFavorited: true }));
    } else {
      setPhoto((prev) => ({ ...prev, isFavorited: false }));
    }
    console.log(action, "favorite successful! ❤️");
  };

  const getPhoto = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchPexels("show", { id }, user?.id);
    if (error) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const fetchedPhoto = data;
    if (fetchedPhoto) {
      setPhoto(fetchedPhoto);
    } else {
      setIsError(true);
    }
    setIsLoading(false);
  }, [id, setPhoto, user]);

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
    if (photo) {
      //see if photo.pexels_id is in favroites table
      return;
    }

    getPhoto();
  }, [id, getPhoto, photo]);

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
  const photoIsValid = !!photo?.url;

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
        <PhotoView photo={photo} handleFavorite={handleFavorite} />
        <div className="flex items-center justify-center w-full md:w-1/2 h-full">
          <Comments photo={photo} />
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
