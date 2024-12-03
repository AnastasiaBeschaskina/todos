const { s3, BUCKET_NAME } = require("../config");
const { v4: uuidv4 } = require("uuid");
const { Buffer } = require("buffer");

const todosFileKey = "todos.json";

/**
 * Converts a given date to ISO format 'YYYY-MM-DD'.
 * @param {Date} date - The date to be formatted.
 * @returns {string} - The formatted date as a string in 'YYYY-MM-DD' format.
 */
function formatDateToISO(date) {
  const parsedDate = new Date(date);
  return parsedDate.toISOString().split("T")[0];
}

class S3TodoRepository {
  constructor() {
    this.todosCache = null; // Cache for storing todos
    this.todosList = []; // Array to store the list of todos
    this.pageSize = 10; // Number of todos per page for pagination
    this.isCacheStale = false; // Flag to indicate if the cache is outdated
  }

  /**
   * Loads all todos from S3 into the cache and sorts them by due date.
   * @returns {Array} - The sorted array of todos.
   */
  async loadTodos() {
    if (!this.todosList || this.todosList.length === 0) {
      const data = await this.getAllTodos();
      this.todosList = data.todos;

      // Sort tasks by due date in ascending order
      this.todosList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    return this.todosList; // Return the sorted array of tasks
  }

  /**
   * Retrieves a specific page of todos.
   * @param {number} page - The page number to retrieve.
   * @returns {Object} - An object containing the current page, total pages, and the list of todos.
   */
  async getPaginatedTodos(page) {
    await this.loadTodos(); // Ensure todos are loaded into the cache
    this.isCacheStale = false;

    const totalPages = Math.ceil(this.todosList.length / this.pageSize);

    // If the requested page exceeds the available pages, return an empty array
    if (page > totalPages) {
      return {
        currentPage: page,
        totalPages,
        todos: [],
      };
    }

    const startIndex = (page - 1) * this.pageSize;
    const endIndex = Math.min(
      startIndex + this.pageSize,
      this.todosList.length
    );

    // Slice the todos array to get only the todos for the requested page
    const paginatedTodos = this.todosList.slice(startIndex, endIndex);

    return {
      currentPage: page,
      totalPages,
      todos: paginatedTodos,
    };
  }

  /**
   * Retrieves all todos from S3.
   * @returns {Object} - An object containing the list of todos.
   */
  async getAllTodos() {
    try {
      const data = await s3.getObject({
        Bucket: BUCKET_NAME,
        Key: todosFileKey,
      });

      const bodyContent = await this.streamToString(data.Body);

      // Return an empty array if the file is empty
      if (!bodyContent || bodyContent.trim() === "") {
        return { todos: [] };
      }

      return JSON.parse(bodyContent); // Parse JSON and return
    } catch (error) {
      if (error.name === "NoSuchKey") {
        return { todos: [] }; // Return an empty array if the file doesn't exist
      }
      throw error; // Rethrow other errors
    }
  }

  /**
   * Fetches a todo by its ID.
   * @param {string} todoId - The ID of the todo to retrieve.
   * @returns {Object} - The todo object if found.
   * @throws Will throw an error if the todo is not found.
   */
  async fetchTodoById(todoId) {
    // Check if tasks are loaded in the cache
    if (!this.todosCache) {
      await this.loadTodos(); // Load tasks if cache is empty
      this.todosCache = new Map(); // Initialize cache
      this.todosList.forEach((todo) => this.todosCache.set(todo.id, todo)); // Populate cache
    }

    // Retrieve the todo from the cache
    const todo = this.todosCache.get(todoId);

    if (!todo) {
      throw new Error(`Todo with ID ${todoId} not found`);
    }

    return todo; // Return the found todo
  }

  /**
   * Updates a todo by its ID.
   * @param {string} todoId - The ID of the todo to update.
   * @param {Object} updatedData - The updated data for the todo.
   * @returns {Object} - The updated todo object.
   * @throws Will throw an error if the todo is not found.
   */
  async updateTodoById(todoId, updatedData) {
    // Load the todos array only if the cache is not yet created
    if (!this.todosCache) {
      await this.loadTodos(); // Load tasks if cache is empty
      this.todosCache = new Map(); // Initialize cache
      this.todosList.forEach((todo) => this.todosCache.set(todo.id, todo)); // Populate cache
    }

    // Retrieve the todo from the cache
    const todo = this.todosCache.get(todoId);

    if (!todo) {
      throw new Error(`Todo with ID ${todoId} not found`);
    }

    // Update the todo data with the provided updated data
    Object.assign(todo, updatedData);

    // Save the updated data back to the cache
    this.todosCache.set(todoId, todo);

    return todo; // Return the updated todo
  }

  /**
   * Adds a new todo to the list.
   * @param {Object} newTodo - The new todo object to add.
   * @returns {Object} - The added todo object.
   */
  async addTodo(newTodo) {
    await this.loadTodos(); // Load existing todos

    const id = newTodo.id ? String(newTodo.id) : uuidv4(); // Generate a unique ID for the new todo
    const todoWithId = {
      id,
      title: newTodo.title,
      description: newTodo.description,
      priority: newTodo.priority,
      dueDate: formatDateToISO(newTodo.dueDate),
      completed: newTodo.completed || false,
    };

    // Add the new todo to the beginning of the list
    this.todosList.unshift(todoWithId);

    if (this.todosCache) {
      this.todosCache.set(id, todoWithId); // Update cache with the new todo
    }

    this.isCacheStale = true; // Mark cache as stale
    await this.saveTodos(); // Save the updated todos to S3
    console.log(todoWithId);
    return todoWithId; // Return the added todo
  }

  /**
   * Deletes a todo by its ID.
   * @param {string} id - The ID of the todo to delete.
   * @returns {Array} - The updated list of todos after deletion.
   * @throws Will throw an error if the todo is not found.
   */
  async deleteTodo(id) {
    await this.loadTodos(); // Ensure todos are loaded

    const index = this.todosList.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new Error(`Todo with ID ${id} not found`);
    }

    this.todosList.splice(index, 1); // Remove the todo from the list

    if (this.todosCache) {
      this.todosCache.delete(id); // Remove from cache
    }

    this.isCacheStale = true; // Mark cache as stale
    await this.saveTodos(); // Save changes to S3

    return this.todosList; // Return the updated list of todos
  }

  /**
   * Saves the current list of todos to S3.
   * @returns {Promise<void>} - A promise that resolves when the todos are saved.
   */
  async saveTodos() {
    const params = {
      Bucket: BUCKET_NAME,
      Key: todosFileKey,
      Body: JSON.stringify({ todos: this.todosList }), // Save the array of todos as JSON
      ContentType: "application/json",
    };
    await s3.putObject(params); // Upload the updated todos to S3
  }

  /**
   * Converts a stream to a string.
   * @param {stream} stream - The stream to convert.
   * @returns {Promise<string>} - The converted string.
   */
  async streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk); // Collect chunks of data from the stream
    }
    return Buffer.concat(chunks).toString("utf-8"); // Combine chunks and convert to string
  }
}

module.exports = S3TodoRepository;
