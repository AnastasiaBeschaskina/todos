<template>
  <div class="add-task">
    <!-- Show "Add New" button when the form is hidden -->
    <div class="add-task-container" v-if="!showForm">
      <div class="image-container">
        <img
          src="../assets/images/tasks.webp"
          alt="Positive Analysis Icon"
          class="analysis-icon"
        />
      </div>
      <p>
        Now you can get ready for your interview with a personalized preparation
        plan. Here’s your tailored schedule to help you succeed. Feel free to
        remove personal tasks or add new ones that you believe are important.
      </p>
      <CustomButton
        v-if="!showForm"
        @click="showAddTaskForm"
        class="primary"
        label="Add New"
      />
    </div>
    <form v-if="showForm" class="task-form">
      <p>Add tasks to your interview preparation plan with this form.</p>
      <!-- Task title input -->
      <InputFieldComponent
        name="title"
        label="Task Title"
        v-model="task.title"
        :errorMessage="validationErrors.title"
        id="title"
        placeholder="Enter task title"
      />

      <!-- Task description input -->
      <InputFieldComponent
        name="description"
        label="Task Description"
        v-model="task.description"
        :errorMessage="validationErrors.description"
        id="description"
        placeholder="Enter task description"
      />

      <!-- Task priority dropdown -->
      <SelectFieldComponent
        name="priority"
        label="Priority"
        v-model="task.priority"
        :options="priorityOptions"
        :errorMessage="validationErrors.priority"
        id="priority"
      />

      <!-- Task due date input -->
      <InputDate
        id="dueDate"
        label="Due Date"
        v-model="task.dueDate"
        :minDate="minDate"
        :errorMessage="validationErrors.dueDate"
      />

      <!-- Form action buttons -->
      <div class="btn-container">
        <CustomButton label="Save Task" @click="submitTask" class="primary" />
        <CustomButton label="Cancel" @click="closeForm" class="cancel" />
      </div>
    </form>

    <!-- Display general validation errors -->
    <div v-if="validationErrors.general" class="error-message">
      {{ validationErrors.general }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Todo } from "@/types/todo";
import { addTodo } from "@/api/todoService";
import CustomButton from "@/components/CustomButton.vue";
import { Priority } from "@/types/priority";
import InputFieldComponent from "@/components/InputFieldComponent.vue";
import SelectFieldComponent from "@/components/SelectFieldComponent.vue";
import InputDate from "./InputDate.vue";

import * as yup from "yup";

export default defineComponent({
  name: "AddTask",
  components: {
    CustomButton,
    InputFieldComponent,
    SelectFieldComponent,
    InputDate,
  },
  emits: ["taskAdded"],
  setup(_, { emit }) {
    const task = ref<Todo>({
      id: "",
      title: "",
      description: "",
      priority: Priority.High,
      dueDate: "",
      completed: false,
    });

    const minDate = new Date().toISOString().split("T")[0];
    const showForm = ref<boolean>(false);
    const priorityOptions = Object.values(Priority);

    // Validation error messages
    const validationErrors = ref<{
      title?: string;
      description?: string;
      priority?: string;
      dueDate?: string;
      general?: string;
    }>({});

    // Validation schema for the task form
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
      validationErrors.value = {}; // Reset validation errors
      try {
        // Validate the task input
        await validationSchema.validate(task.value, { abortEarly: false });

        // Create a new task by sending it to the backend without an ID
        const newTask = await addTodo({
          ...task.value,
        });

        emit("taskAdded", newTask); // Notify parent of the new task
        closeForm();
        resetTask();
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          error.inner.forEach((err) => {
            validationErrors.value[
              err.path as keyof typeof validationErrors.value
            ] = err.message;
          });
        } else {
          console.error("Error adding task:", error);
          validationErrors.value["general"] =
            "An unexpected error occurred. Please try again.";
        }
      }
    };

    // Show the task creation form
    const showAddTaskForm = () => {
      showForm.value = true;
    };

    // Close the task creation form
    const closeForm = () => {
      showForm.value = false;
      resetTask();
    };

    // Reset task form to initial state
    const resetTask = () => {
      task.value = {
        id: "",
        title: "",
        description: "",
        priority: Priority.High,
        dueDate: "",
        completed: false,
      };
      validationErrors.value = {};
    };

    return {
      task,
      minDate,
      priorityOptions,
      validationErrors,
      validationSchema,
      submitTask,
      showForm,
      showAddTaskForm,
      closeForm,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/styles.scss";

.add-task {
  margin: 0 -60px;
  display: flex;
  width: 100%;
  height: fit-content;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  padding: 1rem;
  border-radius: 20px;
  background: linear-gradient(
    68deg,
    rgba(156, 178, 220, 0.17) 0.09%,
    rgba(209, 203, 241, 0.15) 98.62%
  );
}

.add-task-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  border-radius: 16px;
  background-color: #f8f9fa;
  border: 2px dashed rgb(227, 224, 246);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.add-task-container:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.add-task-title {
  line-height: 1.8;
  color: #333;
  font-size: 1.5rem;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
  border: 2px dashed rgb(227, 224, 246);
  padding: 2rem;
  border-radius: 16px;
  background-color: #f8f9fa;
}

.btn-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.primary {
  background-color: #8c7cdb;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.primary:hover {
  background-color: rgb(140, 124, 219, 0.8);
}

.cancel {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel:hover {
  background-color: #d43b3e;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
}
</style>
