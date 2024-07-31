package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

var db *sql.DB

func initDB() {
	var err error

	err = godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")

	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUser, dbPassword, dbHost, dbName)
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MySQL database")
}

func main() {
	initDB()
	defer db.Close()

	router := mux.NewRouter()

	router.HandleFunc("/api/register", registerUser).Methods("POST")
	router.HandleFunc("/api/login", loginUser).Methods("POST")
	router.HandleFunc("/api/users", getUsers).Methods("GET")

	router.HandleFunc("/api/projects", getProjects).Methods("GET")
	router.HandleFunc("/api/projects/{id}", getSingleProject).Methods("GET")
	router.HandleFunc("/api/projects/create", createProject).Methods("POST")
	router.HandleFunc("/api/projects/{id}/team", addTeamMembers).Methods("POST")
	router.HandleFunc("/api/projects/{id}/delete", deleteProject).Methods("DELETE")
	router.HandleFunc("/api/projects/{id}/update", updateProject).Methods("PUT")

	router.HandleFunc("/api/tasks/{id}", getTasks).Methods("GET")
	router.HandleFunc("/api/tasks/create", createTask).Methods("POST")
	router.HandleFunc("/api/tasks/{id}/update", updateTask).Methods("PUT")
	router.HandleFunc("/api/tasks/{id}/delete", deleteTask).Methods("DELETE")

	corsHeaders := handlers.AllowedHeaders([]string{"Content-Type", "Authorization"})
	corsOrigins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
	corsMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})

	// Apply CORS middleware
	corsRouter := handlers.CORS(corsHeaders, corsOrigins, corsMethods)(router)

	fmt.Println("HTTP server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", corsRouter))
}
