"use client";
import { fetchPexels } from "../../../utils.js/api";
import Image from "next/image";
import Link from "next/link";
import Section from "../Section/Section";
import { useEffect } from "react";
import { usePhoto } from "@/context/PhotoContext";
import { useRouter } from "next/router";

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

  return (
    <Section>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto w-full flex items-center justify-center">
        <div className="p-8 border w-[90vw] h-[90vh] shadow-lg bg-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Modal Title</h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-lg text-gray-500">Modal Body</p>
              {photo && photo.src ? (
                <Image
                  src={photo.src.original}
                  alt="test"
                  height={200}
                  width={200}
                />
              ) : (
                <p>Loading photo...</p>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <Link
                href="/"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Close
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default PhotoModal;
