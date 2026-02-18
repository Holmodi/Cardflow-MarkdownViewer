use std::path::Path;
use std::time::Instant;

use ignore::WalkBuilder;
use tauri::{AppHandle, Emitter};

use crate::frontmatter::parse_card;
use crate::models::{CardMeta, ScanBatch, ScanComplete};

const BATCH_SIZE: usize = 200;

pub fn scan_directory(app: &AppHandle, dir: &str) {
    let start = Instant::now();
    let mut batch: Vec<CardMeta> = Vec::with_capacity(BATCH_SIZE);
    let mut total: usize = 0;

    let walker = WalkBuilder::new(dir)
        .hidden(true)
        .git_ignore(true)
        .build();

    for entry in walker.flatten() {
        let path = entry.path();
        if !path.is_file() {
            continue;
        }
        if path.extension().and_then(|e| e.to_str()) != Some("md") {
            continue;
        }

        if let Some(card) = parse_card(path) {
            batch.push(card);
            total += 1;

            if batch.len() >= BATCH_SIZE {
                let _ = app.emit(
                    "scan-batch",
                    ScanBatch {
                        cards: batch.clone(),
                        scanned_so_far: total,
                    },
                );
                batch.clear();
            }
        }
    }

    // Emit remaining cards
    if !batch.is_empty() {
        let _ = app.emit(
            "scan-batch",
            ScanBatch {
                cards: batch,
                scanned_so_far: total,
            },
        );
    }

    let duration = start.elapsed();
    let _ = app.emit(
        "scan-complete",
        ScanComplete {
            total_files: total,
            duration_ms: duration.as_millis() as u64,
        },
    );
}

pub fn parse_single_file(path: &str) -> Option<CardMeta> {
    parse_card(Path::new(path))
}
