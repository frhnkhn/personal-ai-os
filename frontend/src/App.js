import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const loadTasks = async () => {
    const res = await fetch("http://localhost:3001/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

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

  const askAI = async () => {
    const res = await fetch("http://localhost:3001/ai-plan");
    const data = await res.json();
    setAiResponse(data.plan);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          🧠 Personal AI OS
        </h1>

        {/* Add Task */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter a task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <h3 className="font-semibold mb-2">📋 Tasks</h3>
        <ul className="mb-4 space-y-2">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="bg-gray-50 border rounded-lg px-3 py-2"
            >
              {t.title}
            </li>
          ))}
        </ul>

        {/* Ask AI */}
        <button
          onClick={askAI}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
        >
          🤖 Ask AI What To Do
        </button>

        {/* AI Response */}
        {aiResponse && (
          <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
            <strong>AI says:</strong>
            <p className="mt-1">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;