"use client";
import Comments from "../Comments/Comments";
import { fetchPexels } from "../../../utils.js/api";
import Image from "next/image";
import Section from "../Section/Section";
import { useEffect } from "react";
import { useRouter } from "next/router";

function PhotoModal({ photo, setPhoto }) {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (photo) {
      console.log(photo);
      return;
    } else {
      console.log("no photo in context...yet 🎆");
    }
    if (!id) return;
    async function getPhoto() {
      console.log("doing an API call 📞");
      const response = await fetchPexels("show", { id });
      setPhoto(response);
    }
    getPhoto();
  }, [id, photo, setPhoto]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        router.replace("/", undefined, { shallow: true });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  if (!photo) return <p>Loading...</p>;

  return (
    <Section>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center">
        <div className="flex p-4 w-[90vw] h-[90vh] shadow-lg bg-white">
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
            <Comments />
          </div>
        </div>
      </div>
    </Section>
  );
}

export default PhotoModal;
