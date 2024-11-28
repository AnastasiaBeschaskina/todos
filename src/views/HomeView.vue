<template>
  <div class="home"><TodoList /><AddTask /></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TodoList from "@/components/ToDoList.vue";
import AddTask from "@/components/AddTask.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    TodoList,
    AddTask,
  },
  data() {
    return {};
  },
});
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 70% 30%;
  gap: 1rem;
  background-image: url("@/assets/images/background-todo.svg"); 
  background-size: cover; 
  background-repeat: no-repeat; 
  background-position: center;
}
</style>
