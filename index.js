const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const multer = require("multer");
const S3TodoRepository = require("./repositories/s3TodoRepository");
const OpenAIService = require("./src/api/OpenAIService");
const openAIService = new OpenAIService(process.env.OPENAI_API_KEY);

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
require("dotenv").config();

// To switch to another database, implement a new repository with the same methods as the TodoRepository interface; no need to change the routes or server logic.
// Example: const todoRepository = new MongoTodoRepository();
const todoRepository = new S3TodoRepository();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ** Endpoint to generate interview preparation tasks **
app.post("/generateInterviewTasks", async (req, res) => {
  const { interviewDate, position, experienceLevel } = req.body;

  try {
    // Generate tasks using OpenAIService
    const tasks = await openAIService.generateInterviewTasks(
      interviewDate,
      position,
      experienceLevel
    );
    console.log(tasks);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error generating interview tasks." });
  }
});

// ** Endpoint to upload and analyze a resume file **
app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded." });
  }

  try {
    // Analyze the uploaded resume using OpenAIService
    const recommendations = await openAIService.analyzeResume(req.file.buffer);

    // const recommendations = {
    //   positiveAspects:
    //     "Strong technical skills: The applicant showcases proficiency in a variety of technologies and languages such as JavaScript, React, Vue.js, Node.js, MySQL, and more. Practical experience: The candidate provides detailed information about their previous projects and the technologies used, demonstrating hands-on experience. Educational achievements: The applicant holds a diploma in Software Practical Engineering with distinction, showcasing their dedication and expertise in the field.",
    //   areasForImprovement:
    //     "Structure and formatting: The resume lacks clear section headers or bullet points, making it slightly challenging to navigate and read. Organizing information into distinct sections with bullet points can improve readability. Quantifying achievements: It would be beneficial to quantify the impact of the projects mentioned, such as mentioning the number of users, efficiency improvements, or any measurable outcomes to demonstrate the candidate's contributions effectively. Additional context: Providing more context about the scope and scale of projects, the applicant's specific role and responsibilities, and any challenges overcome would paint a clearer picture of their capabilities and achievements.",
    // };

    // Return the analysis results
    res.status(200).send({
      positiveAspects: recommendations.positiveAspects,
      areasForImprovement: recommendations.areasForImprovement,
    });
    //  setTimeout(() => {
    //    res.status(200).send({
    //      positiveAspects: recommendations.positiveAspects,
    //      areasForImprovement: recommendations.areasForImprovement,
    //    });
    //  }, 1000);
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send({ message: "Error processing file." });
  }
});

// ** Endpoint to retrieve todos with pagination **
app.get("/todos", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  console.log("todos");

  try {
    const result = await todoRepository.getPaginatedTodos(page); // Fetch paginated todos
    const { todos, currentPage, totalPages } = result;
    // Respond with todos and pagination details
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

// ** Endpoint to find a specific todo by ID **
app.get("/todos/:id", async (req, res) => {
  const { id } = req.params; // Extract todo ID from request parameters
  try {
    const todo = await todoRepository.fetchTodoById(id); // Retrieve the todo
    res.json(todo); // Send the retrieved todo as the response
  } catch (error) {
    console.error("Error fetching todo:", error);
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message }); 
    } else {
      res.status(500).json({ error: "Failed to retrieve todo" });
    }
  }
});

// ** Endpoint to create a new todo **
app.post("/todos", async (req, res) => {
  const newTodo = req.body; // Get new todo details from request body
  console.log(newTodo);
  try {
    const addedTodo = await todoRepository.addTodo(newTodo); // Add new todo to repository
    res.status(201).json(addedTodo);
  } catch (error) {
    console.error("Error adding todo:", error);
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// ** Endpoint to delete a todo by ID **
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params; // Extract the todo ID from parameters

  try {
    const result = await todoRepository.deleteTodo(id); // Delete the todo by ID
    res.json(result); // Respond with deletion result
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// ** Start the server **
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
