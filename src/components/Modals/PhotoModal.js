"use client";
import Comments from "../Comments/Comments";
import { fetchPexels } from "../../../utils.js/api";
import Image from "next/image";
import { IoCloseSharp } from "react-icons/io5";
import Loader from "../Loader/Loader";
import ReactDOM from "react-dom";
import Section from "../Section/Section";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

function PhotoModal({ photo, setPhoto, show }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const handleClose = useCallback(() => {
    const { id, show, ...restQuery } = router.query;
    router.replace({ pathname: router.pathname, query: restQuery }, undefined, {
      shallow: true,
    });
  }, [router]);

  const getPhoto = useCallback(async () => {
    setIsLoading(true);
    console.log("...doing fetch from PhotoModal 🐶");
    const response = await fetchPexels("show", { id });
    if (response) {
      setPhoto(response);
    } else {
      setIsError(true);
    }
    setIsLoading(false);
  }, [id, setPhoto]);

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
    if (photo) return;
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

  return ReactDOM.createPortal(
    <Section>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center z-[9999]">
        <div className="flex flex-col md:flex-row p-4 w-[90vw] h-auto md:h-[90vh] shadow-lg bg-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 text-3xl z-[10000]"
            aria-label="Close Modal"
          >
            <IoCloseSharp color="white" size={35} />
          </button>

          {isLoading || !photo ? (
            <div className="w-full h-full flex justify-center items-center mt-32">
              <Loader />
            </div>
          ) : (
            <>
              <div
                className="flex items-center justify-center w-full md:w-1/2 h-full"
                style={{
                  backgroundColor: isError ? "white" : photo.avg_color,
                }}
              >
                {!isError ? (
                  <Image
                    src={photo.src.original}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    priority
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <div className="flex flex-col p-4 w-[50vw] h-auto bg-white">
                    <h1 className="mx-auto text-xl font-bold">Oops! 🙈</h1>
                    <h2 className="mt-2">
                      We ran into a little trouble loading your photo. Please
                      click the button to try again.
                    </h2>
                    <button
                      className="mt-4 mx-auto px-2 py-2 w-1/2 md:w-1/4 bg-red-500 text-white font-semibold border border-red-700 hover:bg-red-600 transition duration-200"
                      onClick={getPhoto}
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center w-full md:w-1/2 h-full">
                <Comments photo={photo} />
              </div>
            </>
          )}
        </div>
      </div>
    </Section>,
    document.getElementById("modal-root")
  );
}

export default PhotoModal;
