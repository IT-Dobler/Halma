# Holy Rust :o

Run backend with hot reload: `cargo watch -q -c -w src/ -w .cargo/ -x run`

Run frontend with hot reload: `cargo watch -q -c -w examples/ -x "run --example quick_dev"`

Starting the DB:
```sh
docker run --rm --name pg -p 5432:5432 -e POSTGRES_PASSWORD=welcome postgres:17
```