"use client";
import { fetchPexels } from "../../../utils.js/api";
import Image from "next/image";
import Link from "next/link";
import Section from "../Section/Section";
import { useEffect } from "react";
import { usePhoto } from "@/context/PhotoContext";
import { useRouter } from "next/router";
import Comments from "../Comments/Comments";

function PhotoModal({ photo }) {
  const { setActivePhoto } = usePhoto();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id || photo) return;
    async function getPhoto() {
      const response = await fetchPexels("show", { id });
      setActivePhoto(response);
    }
    getPhoto();
  }, [id, photo, setActivePhoto]);

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
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
          <div className="flex items-center justify-center w-full md:w-1/2 h-full">
            <Comments />
            {/* <Link
              href="/"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Close
            </Link> */}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default PhotoModal;
