const { s3, BUCKET_NAME } = require("../config"); // Import S3 configuration and bucket name from config
const { Buffer } = require("buffer"); // Import Buffer for handling binary data
const TodoRepository = require("./todoRepository"); // Import abstract TodoRepository class to extend
const { v4: uuidv4 } = require("uuid"); // Import UUID for generating unique IDs

const todosFileKey = "Anastasia/todos.json"; // Define the S3 key for the todos JSON file

// Class that interacts with S3 to manage todos
class S3TodoRepository extends TodoRepository {
  constructor() {
    super(); // Call the constructor of the parent class (TodoRepository)
    this.todosCache = null; // Initialize the cache for storing todos locally
  }

  // Load todos, either from cache or from S3
  async loadTodos() {
    if (!this.todosCache) {
      // Check if the cache is empty
      this.todosCache = await this.getAllTodos(); // If empty, fetch todos from S3
    }
    return this.todosCache; // Return the cached todos
  }

  // Retrieve all todos from S3 and cache them
  async getAllTodos() {
    if (this.todosCache) {
      return this.todosCache; // Return cached todos if available
    }

    try {
      // Fetch the todos file from S3
      const data = await s3.getObject({
        Bucket: BUCKET_NAME,
        Key: todosFileKey,
      });

      // Convert the stream from S3 to a string and parse the JSON
      const bodyContent = await this.streamToString(data.Body);
      this.todosCache = JSON.parse(bodyContent); // Parse and cache the todos
      return this.todosCache; // Return the parsed todos
    } catch (error) {
      // Handle case when the todos file does not exist
      if (error.name === "NoSuchKey") {
        this.todosCache = []; // Set cache to an empty array if file not found
        return this.todosCache; // Return the empty array
      }
      throw error; // Throw error for any other issues
    }
  }

  // Fetch a single todo by its ID
  async fetchTodoById(todoId) {
    const todos = await this.loadTodos(); // Load todos from cache
    const todo = todos.find((todo) => todo.id === todoId); // Find the todo with the specified ID
    if (!todo) {
      throw new Error(`Todo with ID ${todoId} not found`); // Throw error if not found
    }
    return todo; // Return the found todo
  }

  // Save the current state of todos back to S3
  async saveTodos() {
    const params = {
      Bucket: BUCKET_NAME,
      Key: todosFileKey, // Specify the key for the todos file
      Body: JSON.stringify(this.todosCache), // Stringify the cached todos for storage
      ContentType: "application/json", // Specify the content type
    };
    await s3.putObject(params); // Upload the updated todos to S3
  }

  // Add a new todo to the repository
  async addTodo(newTodo) {
    await this.loadTodos(); // Ensure the todos are loaded into cache

    // Generate a new ID if one is not provided
    const id = newTodo.id ? String(newTodo.id) : uuidv4(); // Ensure the ID is a string
    const todoWithId = {
      id, // Set the ID for the new todo
      title: newTodo.title, // Set the title
      description: newTodo.description, // Set the description
      priority: newTodo.priority, // Set the priority
      dueDate: newTodo.dueDate, // Set the due date
      completed: newTodo.completed || false, // Set completed status (default to false)
    };

    this.todosCache.todos[id] = todoWithId; // Add the new todo to the cached todos
    await this.saveTodos(); // Save the updated todos back to S3

    return todoWithId; // Return the newly added todo
  }

  // Delete a todo by its ID
  async deleteTodo(id) {
    await this.loadTodos(); // Ensure the todos are loaded into cache

    if (!this.todosCache.todos[id]) {
      throw new Error("Todo not found"); // Throw error if the todo does not exist
    }

    delete this.todosCache.todos[id]; // Remove the todo from the cached todos
    await this.saveTodos(); // Save the updated todos back to S3

    return { message: "Todo deleted successfully" }; // Return success message
  }

  // Utility method to convert a stream into a string
  async streamToString(stream) {
    const chunks = []; // Initialize an array to hold chunks of data
    for await (const chunk of stream) {
      chunks.push(chunk); // Push each chunk into the array
    }
    return Buffer.concat(chunks).toString("utf-8"); // Combine chunks and convert to a string
  }
}

module.exports = S3TodoRepository; // Exporting the S3TodoRepository class for use in other modules
