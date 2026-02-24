require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

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

    const taskText = tasks
      .map((t, i) => `${i + 1}. ${t.title}`)
      .join("\n");

    const prompt = `
You are an expert productivity planner.

Here are my tasks:
${taskText}

Do the following:
1. Assign a priority score (1–10) to each task
2. Sort tasks from highest to lowest priority
3. Explain briefly why the top task should be done first
4. Create a simple plan for today

Respond in this format ONLY:

PRIORITY LIST:
- Task: <task name> | Score: <number>

TOP TASK REASON:
<short explanation>

TODAY PLAN:
- Step 1:
- Step 2:
- Step 3:
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