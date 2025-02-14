import { createClient } from "pexels";

const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY);

export async function fetchPexels(endpoint, params) {
  try {
    let response;
    switch (endpoint) {
      case "curated":
        response = await client.photos.curated({ per_page: 80 });
      case "search":
        response = await client.photos.search({
          query: params.query,
          per_page: 80,
        });
        break;
      case "show":
        response = await client.photos.show({ id: params.id });
        break;
      default:
        throw new Error(`Unsupported endpoint: ${endpoint}`);
    }
    return response;
  } catch (error) {
    console.error("Problem fetching from Pexels:", error);
    return null;
  }
}
