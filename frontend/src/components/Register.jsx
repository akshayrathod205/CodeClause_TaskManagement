import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";
import "./Form.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Team Member");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await registerUser({ name, email, password, role });
    if (response.id) {
      navigate("/login");
    } else {
      alert("Registration failed!");
    }
  };

  return (
    <div className="form-container">
      <h2>WorkMate</h2>
      <p style={{ textAlign: "center" }}>
        Join our platform to collaborate with your team and manage tasks
        efficiently.
      </p>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{ fontWeight: "bold" }}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label style={{ fontWeight: "bold" }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email address"
          />
        </div>
        <div className="form-group">
          <label style={{ fontWeight: "bold" }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a strong password"
          />
        </div>
        <div className="form-group">
          <label style={{ fontWeight: "bold" }}>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Team Member">Team Member</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">
          Register
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
