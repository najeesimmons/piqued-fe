import Image from "next/image";
import Masonry from "@/Masonry/Masonry";
import { createClient } from "pexels";
require("dotenv").config();
import { use, useEffect, useState } from "react";

export default function Home() {
  const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY);
  const getPhotos = async () => {
    try {
      const response = await client.photos.curated({ per_page: 20 });
      setphotos(response.photos);
      console.log(response);
    } catch (error) {
      throw Error(error.message) || console.log("problem getting photos");
    }
  };

  const [photos, setphotos] = useState();

  useEffect(() => {
    getPhotos();
  }, []);

  return (
    <>
      <Masonry photos={photos} />
    </>
  );
}
