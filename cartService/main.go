package main

import (
	"cartService/database"
	"cartService/services/server"
	"log"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

const QUEUE_NAME string = "cartQueue"

func main() {
    godotenv.Load(".env")

    db, err := database.StartDB()

    if err != nil  {
        log.Fatal("error connecting to database ", err)
    }

    server.Serve()
}
