import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createTask } from "../api";
import "./Form.css";
import Navbar from "./Navbar";

const CreateTask = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("Not Started");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const task = {
      title,
      description,
      project_id: parseInt(id, 10),
      assigned_to: parseInt(assignedTo, 10),
      status,
    };
    await createTask(task);
    navigate(`/projects/${id}`);
  };

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <div className="container form-container">
        <h2>Create Task</h2>
        <form onSubmit={handleCreateTask}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          <div>
            <label>Assigned To (User ID):</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
