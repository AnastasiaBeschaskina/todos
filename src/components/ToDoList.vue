<template>
  <div class="todo-list">
    <div class="task-container">
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
        ]" >
        <!-- Clickable task content that shows task title and due date.
             Clicking on the task calls the selectTask function to display detailed info. -->
        <div
          class="task-content"
          @click="selectTask(task.id)"
          :class="{
            'selected-task': selectedTask && selectedTask.id === task.id,
          }"
        >
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
        <button @click="deleteTask(task.id)" class="delete">
          <IconDelete/>
        </button>
        <!-- <CustomButton class="delete" @click="deleteTask(task.id)" label="delete"/> -->
  <!-- <IconDelete />
</CustomButton> -->
      </div>
    </div>
    <div class="pagination-controls">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        <i class="fas fa-arrow-left"></i>
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
  <!-- Pagination Controls -->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import {
  fetchPaginatedTodos,
  deleteTodo,
  fetchTodoById,
} from "@/api/todoService";
import { Todo } from "@/types/todo";
import IconDelete from "./IconDelete.vue";
// import CustomButton from "./CustomButton.vue";
// import CustomButton from "./CustomButton.vue";

export default defineComponent({
  name: "TodoList",
  components: {
    IconDelete,
    // CustomButton,
  },
  setup() {
    const tasks = ref<Todo[]>([]); // Reactive array that stores the list of tasks
    const selectedTask = ref<Todo | null>(null); // Reactive variable to hold the currently selected task's details
    const currentPage = ref<number>(1);
    const totalPages = ref<number>(1);

    // Function to fetch all tasks from the server and store them in tasks
    const loadTasks = async (page: number) => {
      try {
        const result = await fetchPaginatedTodos(page); // Fetch paginated todos from the API
        tasks.value = result.todos; // Assign the paginated todos to the tasks array
        currentPage.value = result.currentPage; // Update current page
        totalPages.value = result.totalPages; // Update total pages
      } catch (error) {
        console.error("Failed to load tasks:", error); // Logs any error if fetching tasks fails
      }
    };

    const changePage = async (page: number) => {
      console.log("client", page);
      if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
        await loadTasks(currentPage.value);
      }
      if (tasks.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
        await loadTasks(currentPage.value);
      }
    };

    // Function to select a specific task by ID and fetch its details
    const selectTask = async (id: string) => {
      try {
        const task = await fetchTodoById(id); // Fetch the task by its ID
        if (task) {
          console.log("Task found:", task); // Log if the task is found
        } else {
          console.log("Task not found for ID:", id); // Log if no task is found for the provided ID
        }

        selectedTask.value = task; // Update the Vue state with the selected task
        console.log("Selected Task after update:", selectedTask.value); // Log the updated selected task
      } catch (error) {
        console.error("Failed to fetch task details:", error); // Log an error if fetching task details fails
      }
    };

    // Function to delete a task by ID
    const deleteTask = async (id: string) => {
      console.log(`Delete button clicked for task with ID: ${id}`); // Log the task ID that will be deleted
      try {
        await deleteTodo(id); // Call the API to delete the task by its ID
        await loadTasks(currentPage.value);

        // tasks.value = updatedTasks; // Update the local tasks array with the new list of tasks
      } catch (error) {
        console.error("Failed to delete task:", error); // Log error if the deletion fails
      }
    };

    // Function that handles adding a new task
    const handleTaskAdded = async (newTask: Todo) => {
      tasks.value.unshift(newTask); // Add the new task to the local tasks array
      await loadTasks(currentPage.value);
    };

    // Load the tasks from the server when the component is mounted
    onMounted(loadTasks);

    return {
      tasks, // Expose the tasks array to the template
      deleteTask, // Expose the deleteTask function to the template
      handleTaskAdded, // Expose the handleTaskAdded function to the template
      selectTask, // Expose the selectTask function to the template
      selectedTask, // Expose the selectedTask variable to the template
      currentPage,
      totalPages,
      changePage,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/styles.scss";

.todo-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  // border: 2px solid red;
  justify-content: space-evenly;
  align-items: center;
}

.task-container {
  // padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80%;
}

.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.high-priority {
  border-left: 6px solid rgb(241, 189, 243);
  // background-color: rgba(241, 189, 243, 0.3);
}

.medium-priority {
  border-left: 6px solid rgb(227, 224, 246);
  // background-color: rgb(227, 224, 246, 0.4);
}

.low-priority {
  border-left: 6px solid rgb(171, 230, 209);
  // background-color: rgba(171, 230, 209, 0.3);
}

.task-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.selected-task {
  flex-direction: column;
}

.task-content .task-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

.task-content .due-date {
  // font-size: 1.25rem;
  // font-weight: bold;
  margin: 0 10px;
}

.delete {
  border: none;
  padding: 8px 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  // margin-top: 20px;
}

.pagination-controls button {
  background-color: rgb(140, 124, 219);
  color: white;
  border: none;
  padding: 1rem;
  width: fit-content;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-controls i {
  color: white;
}

.pagination-controls button:hover {
  background-color: rgb(171, 230, 209);
}

.pagination-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
