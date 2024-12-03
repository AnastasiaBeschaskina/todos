<template>
  <LoadingOverlay :isLoading="isLoading" />
  <div class="task-generator-container" v-if="!isLoading">
    <div class="image-container">
      <img
        src="../assets/images/preparation.jpg"
        alt="Positive Analysis Icon"
        class="analysis-icon"
      />
    </div>
    <!-- Task Generator Form Section -->
    <div class="task-generator">
      <form @submit.prevent="submitForm">
        <h2 class="section-title">Generate Interview Tasks</h2>
        <div class="form-group">
          <InputFieldComponent
            name="position"
            label="Position Title"
            id="position"
            v-model="formData.position"
            required
            placeholder="Enter position title"
            class="form-input"
          />
        </div>

        <!-- Experience Level -->
        <div class="form-group">
          <SelectFieldComponent
            name="experienceLevel"
            id="experienceLevel"
            v-model="formData.experienceLevel"
            label="Experience Level"
            :options="experienceLevelOptions"
          />
        </div>

        <!-- Interview Date -->
        <div class="form-group">
          <InputDate
            id="interviewDate"
            label="Interview Date"
            v-model="formData.interviewDate"
            :minDate="minDate"
          />
        </div>

        <div class="btn-container">
          <CustomButton
            @click="submitForm"
            label="Generate Tasks"
            styleClass="primary"
          />
        </div>
      </form>

      <!-- Error message if form fails or is incomplete -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
    <!-- Display generated tasks after form submission -->
  </div>
  <div class="task-list" v-if="isLoading">
    <h3>Generated Tasks:</h3>
    <ul>
      <li v-for="(task, index) in tasks" :key="index" class="task-item">
        <strong>{{ task.title }}</strong> <br />
        {{ task.description }} <br />
        <em>Priority: {{ task.priority }}</em> <br />
        <em>Due Date: {{ task.dueDate }}</em> <br />
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import CustomButton from "./CustomButton.vue";
import InputFieldComponent from "./InputFieldComponent.vue";
import SelectFieldComponent from "./SelectFieldComponent.vue";
import LoadingOverlay from "./LoadingOverlay.vue";
import { ExperienceLevel } from "@/types/experienceLevel";
import InputDate from "./InputDate.vue";

export default {
  components: {
    CustomButton,
    InputFieldComponent,
    SelectFieldComponent,
    InputDate,
    LoadingOverlay,
  },
  data() {
    return {
      formData: {
        position: "",
        experienceLevel: "",
        interviewDate: "",
      },
      minDate: new Date().toISOString().split("T")[0],
      errorMessage: null,
      tasks: [],
      experienceLevelOptions: Object.values(ExperienceLevel),
      isLoading: false,
    };
  },
  methods: {
    async submitForm() {
      if (
        !this.formData.position ||
        !this.formData.experienceLevel ||
        !this.formData.interviewDate
      ) {
        this.errorMessage = "Please fill out all fields!";
        return;
      }

      this.errorMessage = null;
      this.isLoading = true;

      try {
        const response = await axios.post(
          "/generateInterviewTasks",
          this.formData
        );
        this.tasks = response.data.tasks.todos;
        console.log(this.tasks)
        // Open ToDoList component in a new window with tasks
      const url = `/todo-list?tasks=${encodeURIComponent(JSON.stringify(this.tasks))}`;
      window.open(url, '_blank');
      } catch (error) {
        console.error("Error submitting the request:", error);
        this.errorMessage =
          "Error submitting the request, please try again later.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.task-generator-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(37, 34, 34);
  margin: 0 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: rgb(54, 214, 197, 0.2);
}

.task-generator,
.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.task-generator {
  width: 40%;
  height: 100%;
  max-height: 600px;
}

.image-container {
  width: 60%;
  height: 100%;
  max-height: 600px;
}

.task-generator {
  /* padding: 2rem; */
  box-sizing: border-box;
}

form {
  background-color: #fafbfd;
  border-radius: 16px;
  padding: 4rem;
}

.form-group {
  display: block;
  width: 100%;
}

.analysis-icon {
  width: 100%;
  max-width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px 0 0 16px;
}
</style>
