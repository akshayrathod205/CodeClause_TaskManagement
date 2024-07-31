import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUsers, addTeamMembers } from "../api";
import "./Members.css";
import Navbar from "./Navbar";

const AddTeamMembers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await getUsers();
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const handleAddMembers = async (e) => {
    e.preventDefault();
    const response = await addTeamMembers(id, selectedUsers);
    if (response && response.message) {
      navigate(`/projects/${id}`);
    } else {
      alert("Failed to add team members!");
    }
  };

  const handleUserChange = (e) => {
    const options = e.target.options;
    const selected = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => {
        // Find the user object with the selected id
        return users.find((user) => user.id === parseInt(option.value, 10)); // Convert option.value to number if needed
      });
    setSelectedUsers(selected);
    console.log(selectedUsers);
  };

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <div className="container form-container">
        <h2>Add Team Members</h2>
        <form onSubmit={handleAddMembers}>
          <div>
            <label>Users:</label>
            <select multiple onChange={handleUserChange}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={selectedUsers.length === 0}>
            Add Members
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMembers;
