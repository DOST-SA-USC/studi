import type { Directory, fetchResult } from "../types/directory";
import { parseDirectory } from "./directoryValidation";

const emptyDirectory: Directory = [];

export const cache = new Map<string, { data: fetchResult; expiry: number }>();
const CACHE_TTL = 1000 * 60 * 5;

export const fetchDirectory = async (id: string): Promise<fetchResult> => {
  const now = Date.now();

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
        folderName: "",
        entries: emptyDirectory,
        errorMessage: `Catalog request failed (Status: ${response.status}).`,
      };
    }

    const data: unknown = await response.json();
    const parsed = parseDirectory(data);

    if (!parsed.ok) {
      return {
        folderName: "",
        entries: emptyDirectory,
        errorMessage: "The data received from the server was invalid.",
      };
    }

    const result = parsed.value;

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
      folderName: "",
      entries: emptyDirectory,
      errorMessage: "Connection error: Unable to reach the API.",
    };
  }
};
