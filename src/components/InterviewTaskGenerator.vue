<template>
  <div>
    <h2>Generate Interview Tasks</h2>
    <form @submit.prevent="submitForm">
      <!-- Position Name -->
      <div class="form-group">
        <label for="position">Position</label>
        <input
          type="text"
          id="position"
          v-model="formData.position"
          required
          placeholder="Enter position title"
          class="form-input"
        />
      </div>

      <!-- Experience Level -->
      <div class="form-group">
        <label for="experienceLevel">Experience Level</label>
        <select
          id="experienceLevel"
          v-model="formData.experienceLevel"
          required
          class="form-input"
        >
          <option value="">Select experience level</option>
          <option value="junior">Junior</option>
          <option value="middle">Middle</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      <!-- Interview Date -->
      <div class="form-group">
        <label for="interviewDate">Interview Date</label>
        <input
          type="date"
          id="interviewDate"
          v-model="formData.interviewDate"
          required
          :min="minDate"
          class="form-input"
        />
      </div>

      <div class="btn-container">
        <button type="submit" class="btn-submit">Submit</button>
      </div>
    </form>

    <!-- Display error message if form is incomplete or fails to submit -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- Display generated tasks after form submission -->
    <div v-if="tasks.length">
      <h3>Generated Tasks:</h3>
      <ul>
        <li v-for="(task, index) in tasks" :key="index">
          <strong>{{ task.title }}</strong> <br />
          {{ task.description }} <br />
          <em>Priority: {{ task.priority }}</em> <br />
          <em>Due Date: {{ task.dueDate }}</em> <br />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        position: '', // Store the position selected by the user
        experienceLevel: '', // Store the experience level selected by the user
        interviewDate: '', // Store the interview date selected by the user
      },
      minDate: new Date().toISOString().split('T')[0], // Set minimum date to today
      errorMessage: null, // Variable to hold error messages
      tasks: [], // Array to store tasks generated by the server
    };
  },
  methods: {
    // Submit form and send data to the server
    async submitForm() {
      // Check if all fields are filled
      if (!this.formData.position || !this.formData.experienceLevel || !this.formData.interviewDate) {
        this.errorMessage = 'Please fill out all fields!';
        return;
      }

      this.errorMessage = null;

      // Send form data to the server to generate interview tasks
      try {
        const response = await axios.post('/generateInterviewTasks', this.formData);
        // Store the tasks received from the server
        this.tasks = response.data.tasks.todos;
        
      } catch (error) {
        console.error('Error submitting the request:', error);
        // Show error message if request fails
        this.errorMessage = 'Error submitting the request, please try again later.';
      }
    },
  },
};
</script>