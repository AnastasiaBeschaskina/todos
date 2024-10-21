const { s3, BUCKET_NAME } = require("../config");
const { v4: uuidv4 } = require("uuid");
const { Buffer } = require("buffer");

const todosFileKey = "Anastasia/todos.json";

class S3TodoRepository {
  constructor() {
    this.todosCache = null; // Hash table for quick retrieval of todos by ID
    this.todosStack = []; // Stack for displaying todos
  }

  // Method to load todos from S3 into cache and stack
  async loadTodos() {
    if (!this.todosCache) {
      this.todosCache = await this.getAllTodos(); // Load todos from S3
      this.todosStack = Object.values(this.todosCache.todos); // Populate the stack with todos
      console.log(this.todosStack);
    }
    return this.todosCache;
  }

  // Method to retrieve all todos from S3
  async getAllTodos() {
    if (this.todosCache) {
      return this.todosCache; // If todos are already cached, return them
    }

    try {
      const data = await s3.getObject({
        Bucket: BUCKET_NAME,
        Key: todosFileKey,
      });

      const bodyContent = await this.streamToString(data.Body);
      this.todosCache = JSON.parse(bodyContent); // Parse JSON and store in cache
      return this.todosCache;
    } catch (error) {
      if (error.name === "NoSuchKey") {
        this.todosCache = { todos: {} }; // Empty cache if file is not found
        return this.todosCache;
      }
      throw error; // Rethrow unexpected errors
    }
  }

  // Method to add a new todo
  async addTodo(newTodo) {
    await this.loadTodos(); // Load existing todos

    // Generate a unique ID for the new todo
    const id = newTodo.id ? String(newTodo.id) : uuidv4();
    const todoWithId = {
      id,
      title: newTodo.title,
      description: newTodo.description,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate,
      completed: newTodo.completed || false,
    };

    // Add the new todo to the stack (new todo will be the first in the list)
    this.todosStack.unshift(todoWithId);

    // Update the hash table (add the new todo)
    this.todosCache.todos[id] = todoWithId;

    // Save todos back to S3
    await this.saveTodos();

    return todoWithId; // Return the added todo
  }

  // Method to fetch a todo by ID
  async fetchTodoById(todoId) {
    await this.loadTodos(); // Load existing todos
    const todo = this.todosCache.todos[todoId]; // Look for the todo by ID in the hash table
    if (!todo) {
      throw new Error(`Todo with ID ${todoId} not found`);
    }
    return todo; // Return the found todo
  }

  // Method to delete a todo
  async deleteTodo(id) {
    await this.loadTodos(); // Load existing todos

    if (!this.todosCache.todos[id]) {
      throw new Error("Todo not found");
    }

    // Remove the todo from the hash table
    delete this.todosCache.todos[id];

    // Remove the todo from the stack
    this.todosStack = this.todosStack.filter((todo) => todo.id !== id);

    // Save changes to S3
    await this.saveTodos();
    return { message: "Todo successfully deleted" }; // Return success message
  }

  // Method to save todos to S3
  async saveTodos() {
    // console.log(this.todosCache);
    // console.log(this.todosStack);
    const params = {
      Bucket: BUCKET_NAME,
      Key: todosFileKey,
      Body: JSON.stringify(this.todosCache), // Save the hash table
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
