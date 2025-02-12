import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar/SearchBar";
import Section from "@/components/Section/Section";
import dynamic from "next/dynamic";
import { createClient } from "pexels";

require("dotenv").config();

const DynamicPhotoMasonry = dynamic(
  () => import("@/components/Masonry/PhotoMasonry"),
  {
    ssr: false,
  }
);

export async function getStaticProps() {
  const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY);
  try {
    const response = await client.photos.curated({ per_page: 80 });
    return {
      props: { initPhotos: response.photos },
      revalidate: 3600,
    };
  } catch (error) {
    console.log("ERROR: getStaticProps... nobody can see this 👀");
    return {
      props: { initPhotos: [] },
      revalidate: 3600,
    };
  }
}

export default function Home({ initPhotos }) {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const getSearchPhotos = async () => {
    console.log("in get search photos 👋🏾");
    const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY);
    try {
      const query = searchTerm;
      const response = await client.photos.search({ query, per_page: 20 });
      console.log("we've got photos 🚀:", response.photos[0]);
      setPhotos(response.photos);
    } catch (error) {
      console.log(error.message);
      console.log("no photos 👎🏾");
    }
  };

  useEffect(() => {
    if (!initPhotos) return;
    setPhotos(initPhotos);
  }, [initPhotos]);

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
        <DynamicPhotoMasonry photos={photos} />
      </Section>
    </>
  );
}
