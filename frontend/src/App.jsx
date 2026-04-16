import { useState, useEffect } from "react";
import api from "../src/lib/axios.js";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [taskInput, setTaskInput] = useState({
    title: "",
    description: "",
  });

  const [editingTaskId, setEditingTaskId] = useState(null);

  // REGISTER
  const handleRegister = async () => {
    try {
      await api.post("/users/register", form);
      alert("Registered successfully");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // LOGIN
  const handleLogin = async () => {
    try {
      const res = await api.post("/users/login", {
        identifier: form.username,
        password: form.password,
      });
      setUser(res.data.data.user);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // GET TASKS
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // CREATE or UPDATE TASK
  const handleSubmitTask = async () => {
    try {
      if (editingTaskId) {
        // UPDATE
        await api.put(`/tasks/${editingTaskId}`, taskInput);
        setEditingTaskId(null);
      } else {
        // CREATE
        await api.post("/tasks", taskInput);
      }

      setTaskInput({ title: "", description: "" });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  // TOGGLE COMPLETE
  const toggleTask = async (task) => {
    await api.put(`/tasks/${task._id}`, {
      completed: !task.completed,
    });
    fetchTasks();
  };

  // START EDIT
  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setTaskInput({
      title: task.title,
      description: task.description,
    });
  };

  // ================= UI =================

  if (!user) {
    return (
      <div className="container">
        <h2>Register / Login</h2>

        <input
          placeholder="username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          placeholder="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Welcome {user.username}</h2>

      <h3>{editingTaskId ? "Edit Task" : "Create Task"}</h3>

      <input
        placeholder="Title"
        value={taskInput.title}
        onChange={(e) => setTaskInput({ ...taskInput, title: e.target.value })}
      />

      <input
        placeholder="Description"
        value={taskInput.description}
        onChange={(e) =>
          setTaskInput({ ...taskInput, description: e.target.value })
        }
      />

      <button onClick={handleSubmitTask}>
        {editingTaskId ? "Update" : "Add"}
      </button>

      <ul>
        {tasks.map((task) => (
          <li className="task" key={task._id}>
            <div>
              <span
                className={task.completed ? "completed" : ""}
                onClick={() => toggleTask(task)}
                style={{ cursor: "pointer", fontWeight: "bold" }}
              >
                {task.title}
              </span>

              <p>{task.description}</p>
            </div>

            <div>
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
