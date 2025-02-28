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
    async function getPhoto() {
      setIsLoading(true);
      console.log("...doing fetch from PhotoModal 🐶");
      const response = await fetchPexels("show", { id });
      if (response) {
        setPhoto(response);
      } else {
        setIsError(true);
      }
      setIsLoading(false);
    }
    getPhoto();
  }, [id, photo, setPhoto]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  if (!photo || isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center mt-32">
        <Loader />
      </div>
    );

  if (isError) return <h1>error 📣</h1>;
  //provide opportunity to attempt to refetch if error.
  //when that is clicked, turn isError off

  return ReactDOM.createPortal(
    <Section>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center z-[9999]">
        <div className="flex flex-col md:flex-row p-4 w-[90vw] h-auto md:h-[90vh] shadow-lg bg-white">
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 text-3xl"
            aria-label="Close Modal"
          >
            <IoCloseSharp color="white" size={35} />
          </button>
          <div
            className="flex items-center justify-center w-full md:w-1/2 h-full"
            style={{
              backgroundColor: photo.avg_color,
            }}
          >
            {!isLoading ? (
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
              <Loader />
            )}
          </div>
          <div className="flex items-center justify-center w-full md:w-1/2 h-full">
            <Comments photo={photo} />
          </div>
        </div>
      </div>
    </Section>,
    document.getElementById("modal-root")
  );
}

export default PhotoModal;
