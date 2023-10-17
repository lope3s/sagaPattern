package server

import (
	"cartService/database"
	"net/http"
)

type apiHandlers struct {
    * database.Queries
}

// handlers should be methods of this structure to have access to the database.

func handleAddCartItem(w http.ResponseWriter, r *http.Request) {

}
