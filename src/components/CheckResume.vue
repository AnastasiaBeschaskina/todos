<template>
  <div class="cv-checker">
    <LoadingOverlay :isLoading="isLoading" />
    <div
      class="content-wrapper"
      v-if="
        !isLoading &&
        positiveAspects.length === 0 &&
        areasForImprovement.length === 0
      "
    >
      <h1 class="title">Is your resume good enough?</h1>
      <p class="subtitle">
        Get instant insights into your resume with a fast, free AI-powered
        checker. Quickly discover the strengths, weaknesses, pros, and cons of
        your CV to boost your chances of landing interviews.
      </p>
      <!-- Upload Container -->
      <div class="border-upload-container">
        <div class="upload-container">
          <label for="file-upload" class="upload-label">
            Drop your CV here or choose a file. PDF & DOCX only. Max 2MB file
            size.
          </label>
          <input type="file" @change="handleFileUpload" class="file-input" />

          <CustomButton
            @click="submitFile"
            label="Upload Your CV"
            class="primary"
          />
        </div>
      </div>

      <!-- Image for CV Checker Visualization -->
    </div>
    <div
      class="image-container"
      v-if="
        !isLoading &&
        positiveAspects.length === 0 &&
        areasForImprovement.length === 0
      "
    >
      <img
        src="../assets//images/checker.svg"
        alt="CV Checker Visualization"
        class="checker-image"
      />
    </div>

    <!-- Analysis Results -->
    <div
      v-if="positiveAspects.length !== 0 && areasForImprovement.length !== 0"
      class="analysis-container"
    >
      <!-- Introductory Text -->
      <div class="intro-section">
        <h2 class="title">Resume Analysis Overview</h2>
        <h1 class="subtitle">
          Enhance your resume to boost your job prospects and stand out to
          employers!
        </h1>
      </div>

      <!-- First Row: Positive Aspects on Left, Image on Right -->
      <div class="row">
        <div class="positive-section">
          <h3 class="section-title">Strengths Identified</h3>
          <div
            v-for="(paragraph, index) in positiveAspects"
            :key="index"
            class="section-text-container"
          >
            <i
              class="fas fa-check-circle text-primary"
              style="font-size: 21px; margin-right: 8px"
            ></i>
            <p class="section-text">{{ paragraph }}</p>
          </div>
        </div>

        <div class="image-section">
          <img
            src="../assets/images/positive.webp"
            alt="Positive Analysis Icon"
            class="analysis-icon"
          />
        </div>
      </div>

      <!-- Second Row: Image on Left, Areas for Improvement on Right -->
      <div class="row">
        <div class="image-section">
          <img
            src="../assets/images/recommended.webp"
            alt="Improvement Icon"
            class="analysis-icon"
          />
        </div>

        <div class="improvement-section">
          <h3 class="section-title">Recommended Improvements</h3>
          <div
            v-for="(paragraph, index) in areasForImprovement"
            :key="index"
            class="section-text-container"
          >
            <i
              class="fas fa-exclamation-circle text-warning"
              style="font-size: 21px; margin-right: 8px; color: #8c7cdb"
            ></i>
            <p class="section-text">{{ paragraph }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CustomButton from "./CustomButton.vue";
import LoadingOverlay from "./LoadingOverlay.vue";

export default {
  components: {
    CustomButton,
    LoadingOverlay,
  },
  data() {
    return {
      file: null,
      positiveAspects: [],
      // "Structure and formatting: The resume lacks clear section headers or bullet points, making it slightly challenging to navigate and read. Organizing information into distinct sections with bullet points can improve readability. Quantifying achievements: It would be beneficial to quantify the impact of the projects mentioned, such as mentioning the number of users, efficiency improvements, or any measurable outcomes to demonstrate the candidate's contributions effectively. Additional context: Providing more context about the scope and scale of projects, the applicant's specific role and responsibilities, and any challenges overcome would paint a clearer picture of their capabilities and achievements.",
      areasForImprovement: [],
      // "Structure and formatting: The resume lacks clear section headers or bullet points, making it slightly challenging to navigate and read. Organizing information into distinct sections with bullet points can improve readability. Quantifying achievements: It would be beneficial to quantify the impact of the projects mentioned, such as mentioning the number of users, efficiency improvements, or any measurable outcomes to demonstrate the candidate's contributions effectively. Additional context: Providing more context about the scope and scale of projects, the applicant's specific role and responsibilities, and any challenges overcome would paint a clearer picture of their capabilities and achievements.",
      isLoading: false,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },

    async submitFile() {
      if (this.file) {
        this.isLoading = true;
        const formData = new FormData();
        formData.append("file", this.file);
        try {
          console.log("upload");
          const response = await axios.post(
            "http://localhost:4000/api/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          // this.positiveAspects = response.data.positiveAspects;
          // this.areasForImprovement = response.data.areasForImprovement;
          this.positiveAspects = response.data.positiveAspects
            .split(". ")
            .filter(Boolean);
          this.areasForImprovement = response.data.areasForImprovement
            .split(". ")
            .filter(Boolean);
        } catch (error) {
          console.error("Error uploading file:", error);
        } finally {
          this.isLoading = false; // Stop loading
        }
      }
    },
  },
};
</script>

<style scoped>
.cv-checker {
  padding: 2rem;
  border-radius: 8px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: start;
}

.border-upload-container {
  padding: 1rem;
  border-radius: 20px;
  background: linear-gradient(
    68deg,
    rgba(156, 178, 220, 0.17) 0.09%,
    rgba(209, 203, 241, 0.15) 98.62%
  );
  display: inline-block;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.border-upload-container:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 3rem;
  font-weight: bold;
}

.subtitle {
  font-size: 1.2rem;
}

.content-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  max-width: 500px;
}

.upload-container {
  background-color: #f8f9fa;
  border: 2px dashed #28a745;
  border-radius: 8px;
  padding: 2rem;
  position: relative;
  cursor: pointer;
  flex: 1;
  max-width: 400px;
}

.upload-label {
  font-size: 1rem;
  color: #777;
  display: block;
  margin-bottom: 1rem;
}

.upload-container .file-input {
  margin-bottom: 1rem;
}

.image-container {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 400px;
}

.checker-image {
  max-width: 100%;
  border-radius: 8px;
}

.analysis-container {
  padding: 20px;
  border-radius: 8px;
  overflow-y: auto;
  max-height: 80vh;
}
/* Intro Section Styles */
.intro-section {
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
}

.intro-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.intro-text {
  font-size: 16px;
}

.analysis-title {
  text-align: center;
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.positive-section,
.improvement-section {
  width: 50%;
  padding: 50px;
}

.image-section {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.analysis-icon {
  color: transparent;
  width: 100%;
  height: auto;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.section-text-container {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.section-text {
  font-size: 1rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .upload-container,
  .image-container {
    max-width: 100%;
  }
}
</style>
