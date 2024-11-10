const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const multer = require("multer");
const S3TodoRepository = require("./repositories/s3TodoRepository");
const OpenAIService = require("./src/api/OpenAIService");
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY);
// const { types } = require("sass");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
require("dotenv").config();

// To switch to another database, simply write a new repository that implements the same methods of the TodoRepository interface, no need to modify routes or server logic.
// Example: const todoRepository = new MongoTodoRepository();

const todoRepository = new S3TodoRepository();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/generateInterviewTasks", async (req, res) => {
  const { interviewDate, position, experienceLevel } = req.body;

  try {
    const tasks = await openAIService.generateInterviewTasks(
      interviewDate,
      position,
      experienceLevel
    );
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error generating interview tasks." });
  }
});


app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  try {
    // Pass the buffer to OpenAIService for processing
    const recommendations = await openAIService.analyzeResume(req.file.buffer);

    // Send the generated feedback as a response
    res.status(200).send({
      positiveAspects: recommendations.positiveAspects,
      areasForImprovement: recommendations.areasForImprovement,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send({ message: "Error processing file." });
  }
});

// Endpoint to get all todos
app.get("/todos", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no page query is provided

  try {
    const result = await todoRepository.getPaginatedTodos(page); // Get paginated todos
    // Destructure todos and totalPages from result
    const { todos, currentPage, totalPages } = result; // Деструктурируем ответ из репозитория

    res.json({
      todos: todos,
      currentPage: currentPage,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching paginated todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Endpoint to find a todo by its ID
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params; // Get the todo ID from the request parameters
  try {
    const todo = await todoRepository.fetchTodoById(id); // Fetch todo from the repository
    res.json(todo); // Send the found todo as the response
  } catch (error) {
    console.error("Error fetching todo:", error);
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message }); // Send a 404 error if not found
    } else {
      res.status(500).json({ error: "Failed to retrieve todo" }); // General error response
    }
  }
});

// Endpoint to create a new todo
app.post("/todos", async (req, res) => {
  const newTodo = req.body; // Get the new todo data from the request body
  try {
    // Add the new todo using the repository and respond with the added todo
    const addedTodo = await todoRepository.addTodo(newTodo);
    res.status(201).json(addedTodo); // Respond with a 201 status for created resource
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// Endpoint to delete a todo by its ID
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
    // Attempt to delete the todo with the specified ID
    const result = await todoRepository.deleteTodo(id);
    res.json(result); // Respond with the result of the deletion
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
