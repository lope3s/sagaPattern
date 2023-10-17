-- +goose Up
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    product_amount INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT (NOW()),
    deleted_at TIMESTAMP
);

-- +goose Down
DROP TABLE cart;
