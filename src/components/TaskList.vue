<template>
  <div class="task-container">
    <div
      class="task-card"
      v-for="task in tasks"
      :key="task.id"
      :class="[
        task.completed ? 'completed-task' : 'not-completed-task',
        task.priority === 'High'
          ? 'high-priority'
          : task.priority === 'Medium'
          ? 'medium-priority'
          : 'low-priority',
        { 'selected-task': selectedTask && selectedTask.id === task.id },
      ]"
    >
      <div class="task-content" @click="selectTask(task.id)">
        <h3 :class="{ completed: task.completed }">{{ task.title }}</h3>
        <p class="due-date">{{ task.dueDate }}</p>
      </div>

      <div v-if="selectedTask && selectedTask.id === task.id">
        <p>{{ selectedTask.description }}</p>
        <p>This task is of {{ selectedTask.priority }} Priority!</p>
      </div>

      <button @click="deleteTask(task.id)" class="btn-delete">
        <IconDelete />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Todo } from "@/types/todo";

export default defineComponent({
  name: "TaskList",
  props: {
    tasks: {
      type: Array as () => Todo[],
      required: true,
    },
    selectedTask: {
      type: Object,
      default: null,
    },
    selectTask: {
      type: Function,
      required: true,
    },
    deleteTask: {
      type: Function,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/styles.scss";

</style>