import type { Directory } from "../types/directory";
import { parseDirectory } from "./directoryValidation";

export interface DirectoryFetchResult {
  directory: Directory;
  errorMessage?: string;
}

const emptyDirectory: Directory = [];

export const fetchDirectory = async (id: string): Promise<DirectoryFetchResult> => {
  try {
    const apiUrl = `https://studi.dostsausc.org/api/${id}`;
    const response = await fetch(apiUrl, {
      headers: { 'x-api-key': import.meta.env.API_KEY }
    });

    if (!response.ok) {
      console.error("API Fetch Error:");
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

    return { directory: parsed.value };
  } catch (error) {
    console.error("API Fetch Error:", error);
    return {
      directory: emptyDirectory,
      errorMessage: "Connection error: Unable to reach the API.",
    };
  }
};