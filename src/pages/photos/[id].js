import { useRouter } from "next/router";
import { createClient } from "pexels";
import Image from "next/image";
import { useState, useEffect } from "react";
import Section from "@/components/Section/Section";
import Comments from "@/components/Comments/Comments";

export default function ShowPhoto() {
  const router = useRouter();
  const { id } = router.query;
  const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (!id) return;
    const getPhoto = async () => {
      try {
        const response = await client.photos.show({ id });
        setPhoto(response);
      } catch (error) {
        console.error("Problem getting photo:", error);
      }
    };
    getPhoto();
  }, [id]);

  if (!photo) return <p>Loading...</p>;

  return (
    <Section>
      <div className="w-full md:max-h-[90vh] flex flex-col md:flex-row mt-4 mx-auto">
        <div
          className="flex items-center justify-center w-full md:w-1/2"
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
        <div className="w-full md:w-1/2">
          <Comments
            name={photo.photographer}
            pexelPhotogPageUrl={photo.photographer_url}
            pexelShowPageUrl={photo.url}
          />
        </div>
      </div>
    </Section>
  );
}
