mod auth;

use crate::auth::{login_emailpassword, signup_emailpassword};
use std::fs;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rangel!", name)
}

#[tauri::command]
fn load_notes() -> String {
    // This is a placeholder for loading notes.
    // In a real application, you would load notes from a database or file.
    let notes_path = "./init_value_yoopta_editor.json";
    match fs::read_to_string(notes_path) {
        Ok(contents) => contents,
        Err(_) => String::from("Could not load notes."),
    }
}

#[tauri::command]
fn save_notes(notes: String) -> String {
    // This is a placeholder for saving notes.
    // In a real application, you would save notes to a database or file.
    let notes_path = "./init_value_yoopta_editor.json";
    match fs::write(notes_path, notes) {
        Ok(_) => String::from("Notes saved successfully."),
        Err(_) => String::from("Could not save notes."),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            load_notes,
            save_notes,
            signup_emailpassword,
            login_emailpassword
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
