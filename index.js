const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const S3TodoRepository = require("./repositories/s3TodoRepository");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// To switch to another database, simply write a new repository that implements the same methods of the TodoRepository interface, no need to modify routes or server logic.
// Example: const todoRepository = new MongoTodoRepository();

const todoRepository = new S3TodoRepository();

// Endpoint to get all todos
app.get("/todos", async (req, res) => {

  try {
    const page = parseInt(req.query.page) || 1; 
    // const pageSize = 10;

    await todoRepository.loadTodos();
    // const totalPages = Math.ceil(todos.length / pageSize);
    // const paginatedTodos = todos.slice((page - 1) * pageSize, page * pageSize);

    // res.json({
    //   currentPage: page,
    //   totalPages: totalPages,
    //   todos: paginatedTodos,
    // });

    res.json(todoRepository.todosList);

  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Error fetching todos" });
  }
});

// Route to get a single todo by its ID
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the request parameters

    // Fetch all todos to find the specific one
    const todosObject = await todoRepository.getAllTodos();

    // Retrieve the specific todo based on the extracted ID
    const todo = todoRepository.todosCache.get(id);

    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({ error: "Failed to retrieve todo" });
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
