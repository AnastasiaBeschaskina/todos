import axios from "axios";
axios.defaults.baseURL = "http://localhost:4000";
import { Todo } from "@/types/todo"; // Ensure this import matches your directory structure

// Fetch paginated todos
export const fetchPaginatedTodos = async (
  page = 1
): Promise<{ todos: Todo[]; currentPage: number; totalPages: number }> => {
  console.log(`Fetching todos for page ${page}`);
  try {
    const response = await axios.get(`/todos?page=${page}`);
    const { todos, currentPage, totalPages } = response.data;
    return { todos, currentPage, totalPages };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
      console.error("Axios error status:", error.response?.status);
      console.error("Axios error message:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

// Fetch all todos
// export const fetchTodos = async (): Promise<Todo[]> => {
//   console.log("fetchAll client")
//   try {

//     const response = await axios.get("/todos");

//     const todosArray: Todo[] = Object.values(response.data);

//     return todosArray;
    
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Axios Error:", error.message, error.code); // Log the error message and code
//     } else {
//       console.error("Unknown Error:", error);
//     }
//     throw error;
//   }
// };


// Fetch a single todo by ID
export const fetchTodoById = async (id: string): Promise<Todo> => {
  try {
    // Make an Axios GET request to the API endpoint to fetch the todo by ID
    const response = await axios.get(`/todos/${id}`);

    // Return the data from the response
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error; // Rethrow the error to handle it where the function is called
  }
};

// Add a new todo
export const addTodo = async (todo: Todo): Promise<Todo> => {
  try {
    const response = await axios.post("/todos", todo);
    return response.data;
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error; // Rethrow the error for handling
  }
};

// Delete a todo by ID
export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/todos/${id}`);
  } catch (error) {
    console.error(`Error deleting todo with ID ${id}:`, error);
    throw error; // Rethrow the error for handling
  }
};
