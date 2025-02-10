import { useRouter } from "next/router";
import { createClient } from "pexels";
import { useState, useEffect } from "react";

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

  return <img src={photo.src.original} alt={photo.id} />;
}
