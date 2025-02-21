import { createClient } from "pexels";

const client = createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY);

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
    return response;
  } catch (error) {
    console.error("Problem fetching from Pexels 🙅🏾‍♂️:", error);
    return null;
  }
}
