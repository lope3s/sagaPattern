package database

import "time"

type Cart struct {
    ID int
    PoductID int
    ProductAmount int
    CreatedAt time.Time
    DeletedAt time.Time
}
