package server

import (
	"fmt"
	"net/http"
)

func loadRoutes() {
    http.HandleFunc("/healthz", func (w http.ResponseWriter, r *http.Request) {
        fmt.Printf("ok1\n")
        fmt.Fprintf(w, "ok2\n")
    })

    http.HandleFunc("/add-cart-item", func (w http.ResponseWriter, r *http.Request) {

    })
}
