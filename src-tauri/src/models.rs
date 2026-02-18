use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CardMeta {
    pub path: String,
    pub title: String,
    pub tags: Vec<String>,
    pub created: Option<String>,
    pub updated: Option<String>,
    pub preview: String,
    pub size: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanBatch {
    pub cards: Vec<CardMeta>,
    pub scanned_so_far: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanComplete {
    pub total_files: usize,
    pub duration_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum FileEventKind {
    Created,
    Modified,
    Deleted,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileEvent {
    pub kind: FileEventKind,
    pub path: String,
    pub card: Option<CardMeta>,
}
