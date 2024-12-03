<template>
  <div class="about">
    <h3 class="headline">
      Planning your preparation is crucial. A well-structured plan helps you
      focus on the right skills, manage your time effectively, and approach each
      interview with confidence.
    </h3>
    <p class="title">
      Generate a personalized interview preparation plan based on your role and
      experience level.
    </p>

    <!-- Interview Task Generator Section -->
    <div class="section">
      <InterviewTaskGenerator />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InterviewTaskGenerator from "@/components/InterviewTaskGenerator.vue";

export default defineComponent({
  name: "AboutView",
  components: {
    InterviewTaskGenerator,
  },
});
</script>

<style scoped>
.about {
  padding: 1rem 5rem;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  background-color: #fafbfd;
}

.headline {
  text-align: center;
  font-size: 2rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  /* color: #007bff; */
  /* margin-bottom: 1rem; */
  text-align: center;
}

.section-description {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .headline {
    font-size: 1.5rem;
  }

  .section {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
</style>
