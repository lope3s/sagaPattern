package server

import (
    "log"
    "net/http"
    "os"
)

func Serve() {
    port := os.Getenv("PORT")
    if port == "" {
        log.Fatal("PORT environment variable is empty")
    }

    loadRoutes()

    log.Fatal(http.ListenAndServe(":" + port,nil)) 
}
