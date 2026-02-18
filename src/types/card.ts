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

export type SortBy = "title" | "created" | "updated" | "size";
export type SortOrder = "asc" | "desc";
