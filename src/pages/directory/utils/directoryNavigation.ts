import {
  cache,
  fetchDirectory,
} from "@/pages/directory/utils/directoryServer.ts";
import type { DirectoryEntry } from "../types/directory";
import Breadcrumb from "@/components/Breadcrumb.astro";

interface Breadcrumb {
  label: string;
  href: string;
}

interface DirectoryContext {
  entries: DirectoryEntry[];
  breadcrumbs: Breadcrumb[];
  errorMessage?: string;
}

const buildEntryData = (
  entries: DirectoryEntry[],
  pathSegments: string[],
): DirectoryEntry[] => {
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

  pathSegments.forEach((segment) => {
    if (!segment) return;
    accumulatedPath += `/${segment}`;

    const cacheItem = cache.get(segment);

    const label =
      cacheItem === undefined ? segment : cacheItem.data.folder_name;
    breadcrumbs.push({
      label: label,
      href: accumulatedPath,
    });
  });

  return breadcrumbs;
};

export const buildDirectoryContext = async (
  pathSegments: string[],
  errorMessage?: string,
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
  const data = result.directory;

  if (!data) {
    return {
      entries: [],
      breadcrumbs: buildBreadcrumbs(pathSegments),
      errorMessage:
        errorMessage ?? "Error: there was an error fetching this folder",
    };
  }

  return {
    entries: buildEntryData(data, pathSegments),
    breadcrumbs: buildBreadcrumbs(pathSegments),
  };
};
