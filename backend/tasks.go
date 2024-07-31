package main

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
)

func createTask(w http.ResponseWriter, r *http.Request) {
	claims, err := validateToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Check if user is a Manager
	if claims.Role == "Team Member" {
		http.Error(w, "You are not authorized to create a task", http.StatusUnauthorized)
		return
	}

	var task Task
	err = json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	res, err := db.Exec("INSERT INTO tasks (title, description, project_id, assigned_to, status) VALUES (?, ?, ?, ?, ?)", task.Title, task.Description, task.ProjectID, task.AssignedTo, task.Status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	taskID, err := res.LastInsertId()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	task.ID = int(taskID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	claims, err := validateToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	projectID := vars["id"]

	// If user is not a Manager, check if they are part of the project
	if claims.Role != "Manager" {
		var count int
		err := db.QueryRow("SELECT COUNT(*) FROM project_members WHERE project_id = ? AND user_id = ?", projectID, claims.ID).Scan(&count)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if count == 0 {
			http.Error(w, "You are not part of this project", http.StatusUnauthorized)
			return
		}
	}

	rows, err := db.Query("SELECT id, title, description, project_id, assigned_to, status FROM tasks WHERE project_id = ?", projectID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var task Task
		err = rows.Scan(&task.ID, &task.Title, &task.Description, &task.ProjectID, &task.AssignedTo, &task.Status)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		tasks = append(tasks, task)
	}

	type Response struct {
		Tasks  []Task `json:"tasks"`
		UserID int    `json:"userId"`
	}

	response := Response{
		Tasks:  tasks,
		UserID: claims.ID,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func updateTask(w http.ResponseWriter, r *http.Request) {
	claims, err := validateToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	taskID := vars["id"]

	var task Task
	err = json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if user is the assigned user
	var assignedTo int
	err = db.QueryRow("SELECT assigned_to FROM tasks WHERE id = ?", taskID).Scan(&assignedTo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if assignedTo != claims.ID {
		http.Error(w, "You are not assigned to this task", http.StatusUnauthorized)
		return
	}

	_, err = db.Exec("UPDATE tasks SET title = ?, description = ?, assigned_to = ?, status = ? WHERE id = ?", task.Title, task.Description, task.AssignedTo, task.Status, taskID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Task updated successfully!"})
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	claims, err := validateToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	taskID := vars["id"]

	// Check if user is Manager, if yes then allow to delete
	if claims.Role == "Team Member" {
		http.Error(w, "You are not authorized to delete a task", http.StatusUnauthorized)
		return
	}

	_, err = db.Exec("DELETE FROM tasks WHERE id = ?", taskID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
