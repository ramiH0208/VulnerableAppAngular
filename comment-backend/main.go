// main.go — backend Go avec vulnérabilité IDOR sur DELETE /comments/:id
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"
)

// Comment structure
type Comment struct {
	ID        int       `json:"id"`
	Author    string    `json:"author"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

var (
	comments   = []Comment{}
	commentsMu sync.Mutex
	idCounter  = 1
)

func enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
	}
}

func main() {
	http.HandleFunc("/comments", commentsHandler)
	http.HandleFunc("/comments/", commentByIDHandler) // pour DELETE avec IDOR

	log.Println("API running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func commentsHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions {
		return
	}
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		commentsMu.Lock()
		defer commentsMu.Unlock()
		json.NewEncoder(w).Encode(comments)

	case http.MethodPost:
		var c Comment
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}
		commentsMu.Lock()
		c.ID = idCounter
		idCounter++
		c.CreatedAt = time.Now()
		comments = append(comments, c)
		commentsMu.Unlock()
		json.NewEncoder(w).Encode(c)

	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func commentByIDHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions {
		return
	}
	w.Header().Set("Content-Type", "application/json")
	idStr := strings.TrimPrefix(r.URL.Path, "/comments/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	commentsMu.Lock()
	defer commentsMu.Unlock()

	for i, c := range comments {
		if c.ID == id {
			switch r.Method {
			case http.MethodGet:
				json.NewEncoder(w).Encode(c)
				return

			case http.MethodDelete:
				// Vuln cloisonnement : l'utilisateur envoie lui-même le nom de l'auteur à supprimer
				type DeleteRequest struct {
					RequestedBy string `json:"requested_by"`
				}

				var req DeleteRequest
				if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
					http.Error(w, "invalid delete payload", http.StatusBadRequest)
					return
				}

				fmt.Printf("[IDOR] Suppression demandée pour commentaire %d par %s (commentaire original de %s)", id, req.RequestedBy, c.Author)

				// Protection ajoutée : refuse si requested_by ≠ author
				if req.RequestedBy != c.Author {
					msg := fmt.Sprintf("unauthorized delete: %s tried to delete comment by %s", req.RequestedBy, c.Author)
					http.Error(w, msg, http.StatusForbidden)
					return
				}

				// Autorisé (mais toujours vulnérable si client contrôle requested_by)
				comments = append(comments[:i], comments[i+1:]...)
				w.WriteHeader(http.StatusNoContent)
				return

			default:
				http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
				return
			}
		}
	}

	http.Error(w, "comment not found", http.StatusNotFound)
}
