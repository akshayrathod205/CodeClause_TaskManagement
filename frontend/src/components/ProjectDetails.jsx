import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectDetails, getTasks, updateTask } from "../api";
import "./Form.css"; // Import common CSS
import Navbar from "./Navbar";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all' or 'assigned'
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
    const fetchProjectDetails = async () => {
      const projectDetails = await getProjectDetails(id);
      setProject(projectDetails);
    };
    fetchProjectDetails();

    const fetchTasks = async () => {
      const response = await getTasks(id);
      console.log(response);
      setTasks(response.tasks || []);
      setUserId(response.userId || null); // Set the user ID from the response
    };
    fetchTasks();
  }, [id]);

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find((task) => task.id === taskId);
    task.status = newStatus;
    const response = await updateTask(taskId, task);
    if (response) {
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } else {
      alert("Failed to update task status!");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.assigned_to === userId;
  });

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Project Details</h2>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <h4>Team Members:</h4>
        <ul>
          {(project.team_members || []).map((member) => (
            <li key={member.id}>
              {member.name} ({member.role})
            </li>
          ))}
        </ul>
        <br />
        {(role === "Manager" || role === "Team Lead") && (
          <div>
            <Link to={`/projects/${id}/add-team-members`}>
              Add Team Members
            </Link>
            <br />
            <Link to={`/projects/${id}/create-task`}>Create Task</Link>
            <br />
          </div>
        )}

        <div className="tasks-container">
          <h3>Tasks</h3>
          <button onClick={() => setFilter("all")}>All Tasks</button>
          <button onClick={() => setFilter("assigned")}>My Tasks</button>
          <ul>
            {(filteredTasks || []).map((task) => (
              <li key={task.id} className="task-item">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                {role === "Team Member" && task.assigned_to === userId && (
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
