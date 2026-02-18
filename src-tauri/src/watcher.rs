use std::path::Path;
use std::sync::Mutex;

use notify::{Config, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use tauri::{AppHandle, Emitter};

use crate::models::{FileEvent, FileEventKind};
use crate::scanner::parse_single_file;

pub struct WatcherState(pub Mutex<Option<RecommendedWatcher>>);

pub fn start_watching(
    app: &AppHandle,
    dir: &str,
    state: &WatcherState,
) -> Result<(), String> {
    let app_handle = app.clone();

    let mut watcher = RecommendedWatcher::new(
        move |res: Result<Event, notify::Error>| {
            if let Ok(event) = res {
                handle_event(&app_handle, &event);
            }
        },
        Config::default(),
    )
    .map_err(|e| format!("Failed to create watcher: {}", e))?;

    watcher
        .watch(Path::new(dir), RecursiveMode::Recursive)
        .map_err(|e| format!("Failed to watch directory: {}", e))?;

    let mut guard = state.0.lock().map_err(|e| e.to_string())?;
    *guard = Some(watcher);

    Ok(())
}

fn handle_event(app: &AppHandle, event: &Event) {
    for path in &event.paths {
        if path.extension().and_then(|e| e.to_str()) != Some("md") {
            continue;
        }

        let path_str = path.to_string_lossy().to_string();

        let (kind, card) = match &event.kind {
            EventKind::Create(_) => {
                (FileEventKind::Created, parse_single_file(&path_str))
            }
            EventKind::Modify(_) => {
                (FileEventKind::Modified, parse_single_file(&path_str))
            }
            EventKind::Remove(_) => (FileEventKind::Deleted, None),
            _ => continue,
        };

        let _ = app.emit(
            "fs-event",
            FileEvent {
                kind,
                path: path_str,
                card,
            },
        );
    }
}
