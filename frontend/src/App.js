import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  // Fetch tasks from backend
  const loadTasks = async () => {
    const res = await fetch("http://localhost:3001/tasks");
    const data = await res.json();
    setTasks(data);
  };

  // Run once when page loads
  useEffect(() => {
    loadTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!title) return;

    await fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    loadTasks();
  };

  // Ask AI
  const askAI = async () => {
    const res = await fetch("http://localhost:3001/ai-plan");
    const data = await res.json();
    setAiResponse(data.plan);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>🧠 Personal AI OS</h1>

      <input
        placeholder="Enter a task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: 8, width: "70%" }}
      />
      <button onClick={addTask} style={{ padding: 8, marginLeft: 10 }}>
        Add Task
      </button>

      <h3>📋 Tasks</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>

      <button onClick={askAI} style={{ padding: 10, marginTop: 10 }}>
        🤖 Ask AI What To Do
      </button>

      {aiResponse && (
        <div style={{ marginTop: 20, background: "#eee", padding: 10 }}>
          <strong>AI says:</strong>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default App;