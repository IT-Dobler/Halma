use crate::config;
use axum::handler::HandlerWithoutStateExt;
use axum::http::StatusCode;
use axum::routing::{any_service, get_service, MethodRouter};
use axum::Router;
use tower_http::services::ServeDir;

// Note: Here we can just return a MethodRouter rather than a full Router since ServeDir is a service.
pub fn serve_dir() -> MethodRouter {
    async fn handle_404() -> (StatusCode, &'static str) {
        (StatusCode::NOT_FOUND, "Resournce not found.")
    }

    any_service(ServeDir::new(&config().WEB_FOLDER).not_found_service(handle_404.into_service()))
}
