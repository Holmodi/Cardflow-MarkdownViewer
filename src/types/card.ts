export interface CardMeta {
  path: string;
  title: string;
  tags: string[];
  created: string | null;
  updated: string | null;
  preview: string;
  size: number;
}

export interface ScanBatch {
  cards: CardMeta[];
  scanned_so_far: number;
}

export interface ScanComplete {
  total_files: number;
  duration_ms: number;
}

export type FileEventKind = "Created" | "Modified" | "Deleted";

export interface FileEvent {
  kind: FileEventKind;
  path: string;
  card: CardMeta | null;
}

export type SortBy = "title_asc" | "title_desc" | "created_asc" | "created_desc" | "updated_asc" | "updated_desc" | "size_asc" | "size_desc";
export type SortOrder = "asc" | "desc";
