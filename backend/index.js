require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// In-memory tasks (MVP)
let tasks = [];

// Health check
app.get("/", (req, res) => {
  res.send("Personal AI OS Backend Running ✅");
});

// Get tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Add task
app.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });

  const task = {
    id: Date.now(),
    title,
  };

  tasks.push(task);
  res.json(task);
});

// AI planner
app.get("/ai-plan", async (req, res) => {
  try {
    if (tasks.length === 0) {
      return res.json({ plan: "No tasks found." });
    }

    const taskText = tasks.map((t, i) => `${i + 1}. ${t.title}`).join("\n");

    const prompt = `
You are an expert productivity planner.

Here are my tasks:
${taskText}

Do ALL of the following:
1. Assign a priority score (1–10) to each task
2. Sort tasks by priority (highest first)
3. Explain why the top task should be done first
4. Create a simple plan for today

Respond EXACTLY in this format:

PRIORITY LIST:
- Task: <task> | Score: <number>

TOP TASK REASON:
<short explanation>

TODAY PLAN:
- Step 1:
- Step 2:
- Step 3:
`;

    const result = await model.generateContent(prompt);
    res.json({ plan: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});