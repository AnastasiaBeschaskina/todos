// Abstract class defining the TodoRepository interface
// This class provides the structure for any specific implementations of Todo repositories.
// Implementations must define the methods outlined below.

class TodoRepository {
  // Retrieves all todos from the repository
  // Should return an array of todos.
  async getAllTodos() {
    throw new Error("Method not implemented"); 
  }

  // Saves the provided array of todos to the repository
  // Expects an array of todo objects as input.
  async saveTodos(todos) {
    throw new Error("Method not implemented"); 
  }

  // Adds a new todo to the repository
  // Expects a single todo object as input.
  async addTodo(todo) {
    throw new Error("Method not implemented"); 
  }

  // Deletes a todo from the repository by its ID
  // Expects the ID of the todo to be deleted as input.
  async deleteTodoById(id) {
    throw new Error("Method not implemented"); 
  }
}

module.exports = TodoRepository; // Exporting the TodoRepository class for use in other modules
