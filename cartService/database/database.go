package database

import (
	"context"
	"database/sql"
	"errors"
	"os"
)

type DBExecutor interface {
    QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error)
    QueryRowContext(ctx context.Context, query string, args ...any) *sql.Row
    ExecContext (ctx context.Context, query string, args ...any) (sql.Result, error)
}

type Queries struct {
    db DBExecutor
}

func StartDB() (Queries, error) {
    dbConnString := os.Getenv("DB_CONN_STRING")

    if dbConnString == "" {
        return Queries{}, errors.New("DB_CONN_STRING is empty")
    }

    db, err := sql.Open("postgres", dbConnString)

    q := Queries{db}

    return q, err
}
