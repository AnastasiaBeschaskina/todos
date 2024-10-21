<template>
  <div class="add-task">
    <form>
      <InputFieldComponent
        name="title"
        label="Task Title"
        v-model="task.title"
        :errorMessage="validationErrors.title"
        id="title"
        placeholder="Enter task title"
      />

      <InputFieldComponent
        name="description"
        label="Task Description"
        v-model="task.description"
        :errorMessage="validationErrors.description"
        id="description"
        placeholder="Enter task description"
      />

      <SelectFieldComponent
        name="priority"
        label="Priority"
        v-model="task.priority"
        :options="priorityOptions"
        :errorMessage="validationErrors.priority"
        id="priority"
      />
      <!-- Display validation error for priority -->
      <div v-if="validationErrors.priority" class="error-message">
        {{ validationErrors.priority }}
      </div>

      <!-- Due date field -->
      <div class="common-select">
        <!-- <label for="dueDate">Due Date</label> -->
        <input
          type="date"
          v-model="dueDateString"
          :min="minDate"
          required
          @input="updateDueDate"
          class="common-input"
        />
        <div v-if="validationErrors.dueDate" class="error-message">
          {{ validationErrors.dueDate }}
        </div>
      </div>

      <div class="btn-container">
        <button @click="submitTask" class="btn-primary">Add New</button>
        <button class="btn-cancel">Cancel</button>
      </div>
    </form>

    <div v-if="validationErrors.general" class="error-message">
      {{ validationErrors.general }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Todo } from "@/types/todo";
import { addTodo } from "@/api/todoService";
// import CustomButton from "@/components/CustomButton.vue";
import { Priority } from "@/types/priority";
import InputFieldComponent from "@/components/ InputFieldComponent.vue";
import SelectFieldComponent from "@/components/SelectFieldComponent.vue";

import * as yup from "yup";

export default defineComponent({
  name: "AddTask",
  components: {
    // CustomButton,
    InputFieldComponent,
    SelectFieldComponent,
  },
  setup(props, { emit }) {
    const task = ref<Todo>({
      id: "",
      title: "",
      description: "",
      priority: Priority.High,
      dueDate: "",
      completed: false,
    });

    // Store the due date in ISO format (YYYY-MM-DD)
    const dueDateString = ref<string>(new Date().toISOString().split("T")[0]);

    // Set today's date as the minimum selectable date
    const minDate = new Date().toISOString().split("T")[0];

    // Function to format 'YYYY-MM-DD' to 'DD.MM.YYYY'
    const formatDateString = (dateString: string): string => {
      const [year, month, day] = dateString.split("-");
      return `${day}.${month}.${year}`;
    };

    // Function to update the due date in the task
    const updateDueDate = () => {
      task.value.dueDate = formatDateString(dueDateString.value); // Set task due date in the desired format
    };

    const priorityOptions = Object.values(Priority);

    const validationErrors = ref<{
      title?: string;
      description?: string;
      priority?: string;
      dueDate?: string;
      general?: string;
    }>({});

    // Validation schema
    const validationSchema = yup.object({
      title: yup.string().required("Please enter the task title."),
      description: yup
        .string()
        .required("Don’t forget to add a task description!"),
      priority: yup
        .string()
        .oneOf(priorityOptions)
        .required("Please choose a task priority."),
      dueDate: yup.string().required("Please select a due date."),
    });

    // Submit task function
    const submitTask = async () => {
      validationErrors.value = {}; // Clear any existing validation errors
      try {
        // Validate the task input
        await validationSchema.validate(task.value, { abortEarly: false });

        // Create a new task by sending it to the backend without an ID
        const newTask = await addTodo({
          ...task.value,
          // Do not include the ID; let the server handle it
        });

        console.log("New task added:", newTask);
        emit("taskAdded", newTask); // Emit an event to notify that a new task has been added

        // Reset the task and due date
        task.value = {
          id: "", // This can remain empty
          title: "",
          description: "",
          priority: Priority.High,
          dueDate: "",
          completed: false,
        };
        dueDateString.value = new Date().toISOString().split("T")[0]; // Reset due date to today
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          // If there are validation errors, map them to validationErrors
          error.inner.forEach((err) => {
            validationErrors.value[
              err.path as keyof typeof validationErrors.value
            ] = err.message;
          });
        } else {
          console.error("Error adding task:", error);
          // You can set a general error message if necessary
          validationErrors.value["general"] =
            "An unexpected error occurred. Please try again.";
        }
      }
    };

    return {
      task,
      dueDateString,
      minDate,
      priorityOptions,
      validationErrors,
      validationSchema,
      updateDueDate,
      submitTask,
    };
  },
});
</script>

<style lang="scss">
@import "@/styles/styles.scss";

.add-task {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background-color: #f8f9fa; // Light background
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Subtle shadow for depth
}

form {
  display: flex; // Use flexbox for layout
  flex-direction: column; // Column layout
  justify-content: center;
  gap: 15px; // Space between form elements
}

input,
select {
  margin-top: 5px;
  border: 1px solid #ced4da; // Light border
  border-radius: 5px; // Rounded corners
  font-size: 16px; // Larger text for accessibility
  transition: border-color 0.3s;
  display: block;
  width: 100%;

  &:focus {
    border-color: #007bff; // Blue border on focus
    outline: none; // Remove default outline
  }
}

.btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.error-message {
  color: red;
  font-size: 12px;
}

@media (max-width: 768px) {
  .add-task {
    padding: 15px;
    max-width: 100%; // Full width on small screens
  }
}
</style>
