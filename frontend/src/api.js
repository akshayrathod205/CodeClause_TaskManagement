// src/api.js
const API_URL = "http://localhost:8080/api"; // Replace with your backend URL

const headers = {
  "Content-Type": "application/json",
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers,
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers,
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  return data;
};

export const getProjects = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/projects`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const getProjectDetails = async (projectId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const addTeamMembers = async (projectId, members) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/projects/${projectId}/team`, {
    method: "POST",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(members),
  });
  return response.json();
};

export const getTasks = async (projectId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks/${projectId}`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const createTask = async (taskData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks/create`, {
    method: "POST",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const getUsers = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const updateTask = async (taskId, taskData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/tasks/${taskId}/update`, {
    method: "PUT",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  return response;
};
