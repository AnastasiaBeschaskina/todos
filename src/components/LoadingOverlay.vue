<template>
  <div class="loading-overlay" v-if="isLoading">
    <svg
      class="loading-circle"
      width="80"
      height="80"
      viewBox="0 0 50 50"
    >
      <circle
        class="circle-path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="4"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-circle {
  animation: rotate 2s linear infinite;
  width: 80px;
  height: 80px;
}

.circle-path {
  stroke: #28a745; /* Green color */
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite, color-change 3s ease-in-out infinite;
}

/* Rotation animation */
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

/* Dash animation for circular effect */
@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Color change animation */
@keyframes color-change {
  0%,
  100% {
    stroke: #28a745; /* Green */
  }
  50% {
    stroke: #8c7cdb; /* Purple */
  }
}
</style>

