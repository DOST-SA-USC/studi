export type CatalogItemType = "file" | "pdf" | "mp3";

export interface CatalogItem {
  id: string;
  name: string;
  type: CatalogItemType;
}

export interface CatalogNoteFolder {
  id: string;
  name: string;
  type: "folder";
  items: CatalogItem[];
}

export interface CatalogCourse {
  id: string;
  name: string;
  type: "folder";
  notes: CatalogNoteFolder[];
}

export interface CatalogProgram {
  id: string;
  name: string;
  type: "folder";
  courses: CatalogCourse[];
}

export type Catalog = CatalogProgram[];
