import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Form.css";

const CreateProject = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const project = {
      name,
      description,
    };

    // Call API to create the project
    const response = await fetch("http://localhost:8080/api/projects/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(project),
    });
    if (response.ok) {
      navigate("/projects");
    } else {
      alert("Failed to create project!");
    }
  };

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <div className="container form-container">
        <h2>Create Project</h2>
        <form onSubmit={handleCreateProject}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Project</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
