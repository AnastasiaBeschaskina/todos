<template>
  <div>
    <!-- Input for file upload -->
    <input type="file" @change="handleFileUpload" />
    <!-- Button to submit the file for analysis -->
    <button @click="submitFile">Check Resume</button>

    <!-- Display the analysis results if available -->
    <div v-if="positiveAspects || areasForImprovement">
      <h2>Resume Analysis</h2>
      
      <!-- Display positive aspects if available -->
      <div v-if="positiveAspects">
        <h3>Positive Aspects</h3>
        <p>{{ positiveAspects }}</p>
      </div>
      
      <!-- Display areas for improvement if available -->
      <div v-if="areasForImprovement">
        <h3>Areas for Improvement</h3>
        <p>{{ areasForImprovement }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null, // Holds the uploaded file
      positiveAspects: null, // Holds the positive aspects of the resume
      areasForImprovement: null, // Holds the areas for improvement of the resume
    };
  },
  methods: {
    // Handle the file upload and store the file in the component's data
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    // Submit the uploaded file to the server for resume analysis
    async submitFile() {
      if (this.file) {
        const formData = new FormData();
        formData.append("file", this.file);

        try {
          // Send the file to the server and get the analysis results
          const response = await axios.post("http://localhost:4000/api/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Save the received data in the component's state variables
          this.positiveAspects = response.data.positiveAspects;
          this.areasForImprovement = response.data.areasForImprovement;
          console.log(this.positiveAspects);
        } catch (error) {
          console.error("Error uploading file:", error); // Log any errors that occur during the file upload process
        }
      }
    },
  },
};
</script>