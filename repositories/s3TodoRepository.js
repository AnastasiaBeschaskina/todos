const { s3, BUCKET_NAME } = require("../config");
const { v4: uuidv4 } = require("uuid");
const { Buffer } = require("buffer");

const todosFileKey = "todos.json";

class S3TodoRepository {
  constructor() {
    this.todosCache = new Map(); // Using Map for caching
    this.todoList = [];
    this.pageSize = 10; // Number of todos per page for pagination
  }

  // Method to load todos from S3 into cache and list
  async loadTodos() {
    if (this.todosCache.size === 0) {
      // Check if the cache is empty
      const data = await this.getAllTodos(); // Load todos
      this.todosList = data.todos; // Copy todos to the list for display

      // Fill the Map for quick lookups
      this.todosList.forEach((todo) => {
        this.todosCache.set(todo.id, todo);
        console.log("Todo added to cache:", todo); // Print each todo as it's added to the cache
      });

      // Print the full cache after all todos are added
      console.log("Full todosCache:", this.todosCache);
    }

    // Convert the Map to an array and sort todos by due date
    const sortedTodos = Array.from(this.todosCache.values()).sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA - dateB; // Sort in ascending order by date
    });

    return sortedTodos; // Return the sorted todos
  }

  // Method to retrieve paginated todos
  getPaginatedTodos(page = 1) {
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = page * this.pageSize;

    const paginatedTodos = this.todosList.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.todosList.length / this.pageSize);

    return {
      currentPage: page,
      totalPages,
      todos: paginatedTodos,
    };
  }

  // Method to retrieve all todos from S3
  async getAllTodos() {
    try {
      const data = await s3.getObject({
        Bucket: BUCKET_NAME,
        Key: todosFileKey,
      });

      const bodyContent = await this.streamToString(data.Body);

      if (!bodyContent || bodyContent.trim() === "") {
        console.warn("Todos file is empty.");
        return { todos: [] };
      }

      return JSON.parse(bodyContent); // Parse JSON and return
    } catch (error) {
      if (error.name === "NoSuchKey") {
        return { todos: [] }; // If the file doesn't exist, return an empty array
      }
      throw error; // Rethrow other errors
    }
  }

  // Method to fetch a todo by ID
  async fetchTodoById(todoId) {
    if (!this.todosCache || this.todosCache.size === 0) {
      console.error("Todos cache is empty");
      throw new Error("No todos available");
    }

    // Get the todo by ID using the Map
    const todo = this.todosCache.get(todoId);
    if (!todo) {
      console.error(`Todo with ID ${todoId} not found in cache`);
      throw new Error(`Todo with ID ${todoId} not found`);
    }

    console.log("Found todo:", todo); // Log the found todo
    return todo;
  }

  // Method to add a new todo
  async addTodo(newTodo) {
    await this.loadTodos(); // Load existing todos

    const id = newTodo.id ? String(newTodo.id) : uuidv4(); // Generate an ID
    const todoWithId = {
      id,
      title: newTodo.title,
      description: newTodo.description,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate,
      completed: newTodo.completed || false,
    };

    // Add the new todo to the beginning of the list
    this.todosList.unshift(todoWithId);

    // Update the cache (Map)
    this.todosCache.set(id, todoWithId);

    // Save the todos to S3
    await this.saveTodos();

    return todoWithId; // Return the added todo
  }

  // Method to delete a todo
  async deleteTodo(id) {
    console.log("dele");
    if (this.todosCache.size === 0) {
      await this.loadTodos(); // Load todos if they are not loaded
    }

    if (!this.todosCache.has(id)) {
      throw new Error(`Todo with ID ${id} not found`);
    }

    // Remove the todo from the cache (Map)
    this.todosCache.delete(id);

    // Remove the todo from the list
    this.todosList = this.todosList.filter((todo) => todo.id !== id);

    // Save changes to S3
    await this.saveTodos();

    return { message: "Todo successfully deleted" };
  }

  // Method to save todos to S3
  async saveTodos() {
    const todosToSave = Array.from(this.todosCache.values()); // Convert Map to an array
    const params = {
      Bucket: BUCKET_NAME,
      Key: todosFileKey,
      Body: JSON.stringify({ todos: todosToSave }), // Save the array of todos
      ContentType: "application/json",
    };
    await s3.putObject(params); // Upload the updated todos to S3
  }

  // Utility function to convert a stream to a string
  async streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk); // Collect chunks of data
    }
    return Buffer.concat(chunks).toString("utf-8"); // Combine and convert to string
  }
}

module.exports = S3TodoRepository;
