import { createClient } from "pexels";

const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY);

function handleApiError(response, endpoint) {
  if (response.error) {
    throw new Error(`Pexels API Error [${endpoint}]: ${response.error}`);
  }

  if (
    (endpoint === "curated" || endpoint === "search") &&
    (!response ||
      !Array.isArray(response.photos) ||
      response.photos.length === 0)
  ) {
    throw new Error(
      `Pexels API Error [${endpoint}]: Invalid or empty photo list`
    );
  }

  if (endpoint === "show" && (!response || !response.id)) {
    throw new Error(
      `Pexels API Error [${endpoint}]: Invalid response for photo ID`
    );
  }
}

export async function fetchPexels(endpoint, params = {}) {
  const page = params.page || 1;

  try {
    let response;
    switch (endpoint) {
      case "curated":
        response = await client.photos.curated({
          per_page: 40,
          page,
        });
        console.log("🐶 just fetched CURATED page", page);
        break;
      case "search":
        response = await client.photos.search({
          query: params.query,
          per_page: 40,
          page,
        });
        console.log("🐶 just fetched SEARCH page", page);
        break;
      case "show":
        response = await client.photos.show({ id: params.id });
        break;
      default:
        throw new Error(`Unsupported endpoint: ${endpoint}`);
    }

    handleApiError(response, endpoint);

    if (endpoint === "search" || endpoint === "curated") {
      const { photos } = response;

      return {
        ...response,
        photos: photos.map((photo) => ({
          pexel_id: photo.id,
          width: photo.width,
          height: photo.height,
          url: photo.src.original,
          photographer: photo.photographer,
          photographer_url: photo.photographer_url,
          photographer_id: photo.photographer_id,
          avg_color: photo.avg_color,
          src: photo.src,
          alt: photo.alt,
        })),
      };
    } else {
      const photo = response;

      return {
        pexel_id: photo.id,
        width: photo.width,
        height: photo.height,
        url: photo.src.original,
        photographer: photo.photographer,
        photographer_url: photo.photographer_url,
        photographer_id: photo.photographer_id,
        avg_color: photo.avg_color,
        src: photo.src,
        alt: photo.alt,
      };
    }
  } catch (error) {
    if (error.message) {
      console.error(
        `❌ Error occurred fetching data from Pexels: ${error.message}`
      );
    } else {
      console.error(`❌ Unexpected error fetching from Pexels 🙅🏾‍♂️: ${error}`);
    }
  }

  return null;
}
