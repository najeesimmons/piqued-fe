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
    const response = await client.photos.curated({ per_page: 50 });
    // console.log("success:", response.photos[0]);
    return {
      props: { photos: response.photos },
      revalidate: 3600, // Regenerates the page at most once per hour
    };
  } catch (error) {
    console.log(
      "problem getting photos in getStaticProps, nobody would even see this"
    );
    return {
      props: { photos: [] }, // Fallback empty array
      revalidate: 3600,
    };
  }
}

export default function Home({ photos }) {
  return (
    <>
      <Section>
        <SearchBar />
      </Section>
      <Section>
        <DynamicPhotoMasonry photos={photos} />
      </Section>
    </>
  );
}
