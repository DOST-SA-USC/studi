export interface DirectoryEntry {
  id: string;
  name: string;
  type: string;
  fullSlug: string;
  parentPath: string;
  href?: string;
  viewLink?: string;
  targetId?: string;
  targetType?: string;
}

export type Directory = DirectoryEntry[];

export type fetchResult = {
  folderName: string;
  entries: Directory;
  errorMessage?: string;
};
