// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use dotenv::dotenv;

mod auth;
fn main() {
    dotenv::dotenv().ok(); // Load variables from .env file

    // Initialize the Tauri application
    zettanotes_lib::run();
}
