import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const loadTasks = async () => {
    const res = await fetch("http://localhost:3001/tasks");
    setTasks(await res.json());
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
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          🧠 Personal AI OS
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="Add a task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 rounded-lg"
          >
            Add
          </button>
        </div>

        <h3 className="font-semibold mb-2">📋 Tasks</h3>
        <ul className="space-y-2 mb-4">
          {tasks.map((t) => (
            <li key={t.id} className="border rounded-lg px-3 py-2">
              {t.title}
            </li>
          ))}
        </ul>

        <button
          onClick={askAI}
          className="w-full bg-purple-600 text-white py-2 rounded-lg"
        >
          🤖 Ask AI
        </button>

        {aiResponse && (
          <div className="mt-4 bg-purple-50 p-3 rounded-lg">
            <pre className="whitespace-pre-wrap">{aiResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;