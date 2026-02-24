// This is our first server
// It will listen and respond

const express = require("express");

// Create the app
const app = express();

// Tell server how to talk in JSON
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("👋 Personal AI OS backend is running!");
});

// Start server
const PORT = 5000;
app.listen(3001, () => {
  console.log("Server started on port 3001");
});