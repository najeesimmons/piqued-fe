"use client";
import Comments from "../Comments/Comments";
import { fetchPexels } from "../../../utils.js/api";
import Image from "next/image";
import { IoCloseSharp } from "react-icons/io5";
import ReactDOM from "react-dom";
import Section from "../Section/Section";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

function PhotoModal({ photo, setPhoto, show }) {
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
      console.log("...doing fetch from PhotoModal 🐶");
      const response = await fetchPexels("show", { id });
      setPhoto(response);
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
  }, [router, handleClose]);

  if (!photo) return <h1>Loading....</h1>;

  return ReactDOM.createPortal(
    <Section>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center z-[9999]">
        <div className="flex p-4 w-[90vw] h-[90vh] shadow-lg bg-white">
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
