use axum::Router;
use axum::routing::get_service;
use tower_http::services::ServeDir;

pub fn routes() -> Router {
    Router::new().fallback_service(get_service(ServeDir::new("./")))
}