import {
  cache,
  fetchDirectory,
} from "@/pages/directory/utils/directoryServer.ts";
import type { Directory } from "../types/directory";
import Breadcrumb from "@/components/Breadcrumb.astro";

interface Breadcrumb {
  label: string;
  href: string;
}

interface DirectoryContext {
  entries: Directory;
  breadcrumbs: Breadcrumb[];
  errorMessage?: string;
}

const buildEntryData = (
  entries: Directory,
  pathSegments: string[],
): Directory => {
  const baseHref = `/directory/${pathSegments.join("/")}`;

  return entries.map((entry) => {
    const navigationId = entry.type === "shortcut" ? entry.targetId : entry.id;

    return {
      ...entry,
      href:
        entry.type === "file"
          ? entry.viewLink
          : `${baseHref}/${navigationId}`.replace(/\/+$/, ""),
    };
  });
};

// temporary
const buildBreadcrumbs = (pathSegments: string[]): Breadcrumb[] => {
  const breadcrumbs: Breadcrumb[] = [
    { label: "directory", href: "/directory" },
  ];

  let accumulatedPath = "/directory";
  const now = Date.now(); 

  pathSegments.forEach((segment) => {
    if (!segment) return;
    accumulatedPath += `/${segment}`;

    const cacheItem = cache.get(segment);
    
    const isCacheValid = cacheItem !== undefined && now < cacheItem.expiry;

    const label = isCacheValid ? cacheItem.data.folderName : segment;

    breadcrumbs.push({
      label: label,
      href: accumulatedPath,
    });
  });

  return breadcrumbs;
};

export const buildDirectoryContext = async (
  pathSegments: string[]
): Promise<DirectoryContext> => {
  if (pathSegments.length <= 1) {
    return {
      entries: [],
      breadcrumbs: buildBreadcrumbs(pathSegments),
      errorMessage: undefined,
    };
  }

  const pathLength = pathSegments.length;
  const currentId = pathSegments[pathLength - 1];

  const result = await fetchDirectory(currentId);
  const data = result.entries;

  if (result.errorMessage) {
    return {
      entries: [],
      breadcrumbs: buildBreadcrumbs(pathSegments),
      errorMessage: result.errorMessage, 
    };
  }

  return {
    entries: buildEntryData(data, pathSegments),
    breadcrumbs: buildBreadcrumbs(pathSegments),
  };
};
