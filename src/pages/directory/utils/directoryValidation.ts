// src/utils/catalogValidation.ts
import type { 
  Directory, 
  DirectoryEntry, 
} from "../types/directory";

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const isDirectoryEntry = (value: unknown): value is DirectoryEntry => {
  if (!isRecord(value)) return false;

  if (!isString(value.id) || !isString(value.name) || !isString(value.type)) {
    return false;
  }

  if (!isString(value.fullSlug) || !isString(value.parentPath)) {
    return false;
  }

  if (value.type === "file" && !isString(value.viewLink)) {
    return false;
  }

  if (value.type === "shortcut" && !isString(value.targetId)) {
    return false;
  }

  return true;
};

const isDirectory = (value: unknown): value is Directory => {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every(isDirectoryEntry);
};

export const parseDirectory = (value: unknown): ParseResult<Directory> => {
  if (!isDirectory(value)) {
    return {
      ok: false,
      error: "API response is invalid: Expected a list of valid folders, files, or shortcuts.",
    };
  }

  return { ok: true, value };
};