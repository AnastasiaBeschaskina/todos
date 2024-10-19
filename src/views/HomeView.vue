<template>
  <div class="home">
    <TodoList/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'; 
import TodoList from '@/components/ToDoList.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    TodoList,
  },
});
</script>
