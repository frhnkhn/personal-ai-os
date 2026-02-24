require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Temporary in-memory tasks
let tasks = [];

// Home route
app.get("/", (req, res) => {
  res.send("Personal AI OS (Gemini) running ✅");
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Add a task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: Date.now(),
    title,
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// 🧠 AI Planner using Gemini
app.get("/ai-plan", async (req, res) => {
  try {
    if (tasks.length === 0) {
      return res.json({
        plan: "You have no tasks. Add some tasks first 🙂",
      });
    }

    const taskText = tasks.map((t, i) => `${i + 1}. ${t.title}`).join("\n");

    const prompt = `
You are a smart productivity assistant.

Here are my tasks:
${taskText}

Tell me:
- Which task I should do first
- Why
- Keep the answer short and clear
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ plan: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gemini AI failed" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});