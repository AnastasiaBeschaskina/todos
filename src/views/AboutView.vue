<template>
  <div class="about">
    <h1>This is an about page</h1>
    <CheckResume/>
    <InterviewTaskGenerator/>
  </div>
</template>

 <script lang="ts">
import { defineComponent } from 'vue'; 
import InterviewTaskGenerator from '@/components/InterviewTaskGenerator.vue';
import CheckResume from '@/components/CheckResume.vue';

export default defineComponent({
  name: 'aboutView',
  components: {
    CheckResume,
    InterviewTaskGenerator,
  },
});
</script>