<template>
  <button :class="['base-button', styleClass]" @click="handleClick">{{ label }}</button>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
    styleClass: {
      type: String,
      default: '', // Optional class for specific styles
    },
  },
  methods: {
    handleClick() {
      this.onClick(); // Emit the function passed as `onClick` prop
    },
  },
};
</script>

<style scoped>
.base-button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.primary {
  background-color: #42b983;
  color: white;
}

.cancel {
  background-color: #f44336;
  color: white;
}
</style>