import { useRouter } from "next/router";
import { createClient } from "pexels";
import Image from "next/image";
import { useState, useEffect } from "react";
import Section from "@/components/Section/Section";

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
      <div className="flex flex-col md:flex-row mt-8 border-2 border-black dark:border-white max-w-[650px] mx-auto">
        <div className="flex items-center justify-center md:w-1/2">
          <Image
            src={photo.src.original}
            alt={photo.createClient}
            width={400} // Set a fixed width
            height={0} // Don't set height, will adjust automatically
            className="object-contain w-full"
          />
        </div>
        <div className=" w-1/2 pl-8">
          <div className="flex items-center mt-8">
            <div className="w-18 h-18 overflow-hidden rounded-full">
              <Image
                src="https://img.freepik.com/free-vector/cartoon-style-robot-vectorart_78370-4103.jpg?t=st=1739226198~exp=1739229798~hmac=21e8a0b296706e840d3d3b90e31b3707eefe34c058c533b248f9233e2bf75d39&w=1060"
                alt="placeholder robot"
                width={50}
                height={50}
                className="object-cover"
              />
            </div>
            <h2 className="ml-4">{photo.photographer}</h2>
          </div>
        </div>
      </div>
    </Section>
  );
}
