const express = require("express");
const app = express();

app.use(express.json());

// Fake database (temporary)
let tasks = [];

// Test route
app.get("/", (req, res) => {
  res.send("Personal AI OS backend running ✅");
});

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Add a new task
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

// Start server
app.listen(3001, () => {
  console.log("Server running on port 3001");
});