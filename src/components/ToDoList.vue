<template>
  <div class="todo-list">
    <h2>My To-Do List</h2>
    <div class="form-add-task">
      <!-- Button to show the task addition form, only visible if the form is currently not shown -->
      <button v-if="!showForm" @click="showAddTaskForm" class="btn-primary">
        Add New
      </button>

      <!-- AddTask component is displayed when showForm is true. It has two events:
           - @taskAdded: triggered when a new task is added
           - @cancel: triggered to close the form without adding a task -->
      <AddTask
        v-if="showForm"
        @taskAdded="handleTaskAdded"
        @cancel="closeAddTaskForm"
      />
    </div>

    <div class="task-container">
      <!-- Iterating through tasks array to display each task as a task card.
           Each card gets unique key based on task.id.
           The class applied to the card depends on:
           - Whether the task is completed
           - The priority of the task (High, Medium, Low)
           - If the task is currently selected -->
      <div
        class="task-card"
        v-for="task in tasks"
        :key="task.id"
        :class="[
          task.completed ? 'completed-task' : 'not-completed-task',
          task.priority === 'High'
            ? 'high-priority'
            : task.priority === 'Medium'
            ? 'medium-priority'
            : 'low-priority',
          { 'selected-task': selectedTask && selectedTask.id === task.id },
        ]"
      >
        <!-- Clickable task content that shows task title and due date.
             Clicking on the task calls the selectTask function to display detailed info. -->
        <div class="task-content" @click="selectTask(task.id)">
          <!-- Task title with conditional strikethrough if the task is completed -->
          <h3 :class="{ completed: task.completed }">{{ task.title }}</h3>
          <p class="due-date">{{ task.dueDate }}</p>
        </div>

        <!-- Additional details for the selected task, visible only when a task is selected
             and the selected task matches the current task in the loop -->
        <div v-if="selectedTask && selectedTask.id === task.id">
          <p>{{ selectedTask.description }}</p>
          <p>This task is of {{ selectedTask.priority }} Priority!</p>
          <!-- Button to close the selected task details could be added here if needed -->
        </div>

        <!-- Button to delete the task. Clicking it triggers deleteTask with the current task ID -->
        <button @click="deleteTask(task.id)" class="btn-delete">
          <IconDelete />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { fetchTodos, deleteTodo, fetchTodoById } from "@/api/todoService";
import { Todo } from "@/types/todo";
import AddTask from "@/components/AddTask.vue";
import IconDelete from "./IconDelete.vue";

export default defineComponent({
  name: "TodoList",
  components: {
    AddTask,
    IconDelete,
  },
  setup() {
    const tasks = ref<Todo[]>([]); // Reactive array that stores the list of tasks
    const showForm = ref<boolean>(false); // Reactive boolean to control the visibility of the AddTask form
    const selectedTask = ref<Todo | null>(null); // Reactive variable to hold the currently selected task's details

    // Function to fetch all tasks from the server and store them in tasks
    const loadTasks = async () => {
      try {
        tasks.value = await fetchTodos(); // Fetches the tasks from API and assigns them to tasks array
      } catch (error) {
        console.error("Failed to load tasks:", error); // Logs any error if fetching tasks fails
      }
    };

    // Function to select a specific task by ID and fetch its details
    const selectTask = async (id: string) => {
      console.log("Fetching task with ID:", id); // Log the ID of the task being fetched
      try {
        selectedTask.value = await fetchTodoById(id); // Fetch task details by ID and store in selectedTask
        console.log("Selected Task:", selectedTask.value); // Log the selected task details
      } catch (error) {
        console.error("Failed to fetch task details:", error); // Log error if fetching task details fails
      }
    };

    // Function to delete a task by ID
    const deleteTask = async (id: string) => {
      console.log(`Delete button clicked for task with ID: ${id}`); // Log the task ID that will be deleted
      try {
        await deleteTodo(id); // Call the API to delete the task by its ID
        const updatedTasks = await fetchTodos(); // After deletion, fetch the updated list of tasks from the server

        tasks.value = updatedTasks; // Update the local tasks array with the new list of tasks
      } catch (error) {
        console.error("Failed to delete task:", error); // Log error if the deletion fails
      }
    };

    // Function that handles adding a new task
    const handleTaskAdded = (newTask: Todo) => {
      tasks.value.push(newTask); // Add the new task to the local tasks array
      closeAddTaskForm(); // Close the task addition form after adding the task
    };

    // Function to show the task addition form
    const showAddTaskForm = () => {
      showForm.value = true; // Set showForm to true to display the AddTask form
    };

    // Function to close the task addition form
    const closeAddTaskForm = () => {
      showForm.value = false; // Set showForm to false to hide the AddTask form
    };

    // Load the tasks from the server when the component is mounted
    onMounted(loadTasks);

    return {
      tasks, // Expose the tasks array to the template
      deleteTask, // Expose the deleteTask function to the template
      handleTaskAdded, // Expose the handleTaskAdded function to the template
      showAddTaskForm, // Expose the showAddTaskForm function to the template
      closeAddTaskForm, // Expose the closeAddTaskForm function to the template
      showForm, // Expose the showForm boolean to the template
      selectTask, // Expose the selectTask function to the template
      selectedTask, // Expose the selectedTask variable to the template
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/styles.scss";

.todo-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-items: end;
}

.form-add-task {
  text-align: end;
  margin-bottom: 30px;
}

.task-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-card {
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s, transform 0.2s;
  cursor: pointer;
  padding: 0 10px;
}

.task-card:hover {
  background-color: rgba(82, 135, 234);
  transform: translateY(-2px); 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
}

/* Priority-based colors in blue shades */
.high-priority {
  border-color: #1e90ff; /* Bright blue */
  background-color: rgba(82, 135, 234, 0.7); /* Semi-transparent blue */
}

.medium-priority {
  border-color: #6495ed; /* Medium blue */
  background-color: rgba(82, 135, 234, 0.3); /* Slightly darker semi-transparent blue */
}

.low-priority {
  border-color: #b0e0e6; /* Very light blue */
  background-color: rgba(82, 135, 234, 0.1); /* Semi-transparent light blue */
}

/* Style for completed tasks */
.completed {
  text-decoration: line-through; /* Strikethrough for completed tasks */
}

/* Selected task style */
.selected-task {
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
  margin: 0;
}

/* Task content layout */
.task-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
}

/* Due date styling */
.due-date {
  color: #666;
  // font-size: 0.9rem;
}

/* Mobile responsiveness for screens with max-width of 768px */
@media (max-width: 576px) {
  .task-card {
    flex-direction: column; /* Stack task cards vertically on smaller screens */
    padding: 15px; /* Add extra padding for better touch interaction */
  }

  .task-content {
    flex-direction: column; /* Stack task content vertically */
    align-items: flex-start; /* Align content to the left */
  }

  .due-date {
    font-size: 1rem; /* Adjust due date font size for mobile */
  }

  .icon-button {
    margin-top: 10px; /* Add space above the icon button for touch targets */
  }
}
</style>
