import type { Directory } from "../types/directory";
import { parseDirectory } from "./directoryValidation";

export interface DirectoryFetchResult {
  directory: Directory;
  errorMessage?: string;
}

const emptyDirectory: Directory = [];

const cache = new Map<string, { data: DirectoryFetchResult; expiry: number }>();
const CACHE_TTL = 1000 * 60 * 5;

export const fetchDirectory = async (
  id: string,
): Promise<DirectoryFetchResult> => {
  const now = Date.now();

  //debugging
  console.log("(" + id + ")");

  const cached = cache.get(id);
  if (cached && now < cached.expiry) {
    console.log(`[Cache Hit] Serving ${id} from memory`);
    return cached.data;
  }

  try {
    const apiUrl = `https://studi.dostsausc.org/api/${id}`;
    const response = await fetch(apiUrl, {
      headers: { "x-api-key": import.meta.env.API_KEY },
    });

    if (!response.ok) {
      console.error("API Fetch Error: Response not OK");
      return {
        directory: emptyDirectory,
        errorMessage: `Catalog request failed (Status: ${response.status}).`,
      };
    }

    const data: unknown = await response.json();
    const parsed = parseDirectory(data);

    if (!parsed.ok) {
      return {
        directory: emptyDirectory,
        errorMessage: "The data received from the server was invalid.",
      };
    }

    const result = { directory: parsed.value };

    cache.set(id, {
      data: result,
      expiry: now + CACHE_TTL,
    });

    return result;
  } catch (error) {
    if (cached) {
      console.warn(
        `[Cache Stale] API unreachable, serving expired data for ${id}`,
      );
      return cached.data;
    }

    console.error("API Fetch Error:", error);
    return {
      directory: emptyDirectory,
      errorMessage: "Connection error: Unable to reach the API.",
    };
  }
};
