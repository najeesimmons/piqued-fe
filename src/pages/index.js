"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchBar from "@/components/SearchBar/SearchBar";
import Section from "@/components/Section/Section";
import dynamic from "next/dynamic";
import PhotoModal from "@/components/Modals/PhotoModal";
import { fetchPexels } from "../../utils.js/api";

require("dotenv").config();

const DynamicPhotoMasonry = dynamic(
  () => import("@/components/Masonry/PhotoMasonry"),
  {
    ssr: false,
  }
);

export async function getStaticProps() {
  const response = await fetchPexels("curated");
  if (response) {
    return {
      props: { initPhotos: response.photos },
      revalidate: 3600,
    };
  }
  return { props: { initPhotos: [] }, revalidate: 3600 };
}

export default function Home({ initPhotos }) {
  const [isError, setIsError] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [photo, setPhoto] = useState();

  const router = useRouter();
  const { show } = router.query;

  const getSearchPhotos = async () => {
    try {
      const response = await fetchPexels("search", { query: searchTerm });
      setPhotos(response.photos);
    } catch (error) {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!initPhotos) return;
    setPhotos(initPhotos);
  }, [initPhotos]);

  useEffect(() => {
    // TODO: delete console log
    console.log("the modal should be open 🪟:", show);
  }, [show]);

  if (isError) return <h1>Error loading photos</h1>;

  return (
    <>
      <Section>
        <SearchBar
          getSearchPhotos={getSearchPhotos}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
      </Section>
      <Section>
        <DynamicPhotoMasonry photos={photos} setPhoto={setPhoto} />
      </Section>
      {show === "true" && <PhotoModal photo={photo} setPhoto={setPhoto} />}
    </>
  );
}
