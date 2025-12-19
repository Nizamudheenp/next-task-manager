"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/login");
    } else {
      setToken(t);
    }
  }, []);

  const fetchTasks = async () => {
    if (!token) return;

    const res = await fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const addTask = async (e) => {
    e.preventDefault();

    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await fetch("/api/tasks", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, completed: !completed }),
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    fetchTasks();
  };

  if (!token) {
    return <p className="text-center mt-10">Checking auth...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={title}
          placeholder="New task"
          className="border p-2 rounded"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-blue-600 text-white p-2 rounded">Add</button>
      </form>

      <ul className="w-64">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span
              onClick={() => toggleTask(task._id, task.completed)}
              className={
                task.completed
                  ? "line-through cursor-pointer"
                  : "cursor-pointer"
              }
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-600 text-sm"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
