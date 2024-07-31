// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Projects from "./components/Projects";
import ProjectDetails from "./components/ProjectDetails";
import AddTeamMembers from "./components/AddTeamMembers";
import CreateTask from "./components/CreateTask";
import CreateProject from "./components/CreateProject";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route
          path="/projects/:id/add-team-members"
          element={<AddTeamMembers />}
        />
        <Route path="/projects/:id/create-task" element={<CreateTask />} />
        <Route path="/create-project" element={<CreateProject />} />
      </Routes>
    </Router>
  );
};

export default App;
