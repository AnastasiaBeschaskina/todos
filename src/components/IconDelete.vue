<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path
      d="M3 6h18M9 6V4h6v2M10 11v6M14 11v6M5 6l1 16h12l1-16"
      stroke="currentColor"
      stroke-width="2"
      fill="none"
      color="white"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "IconDelete",
});
</script>

<style scoped>
svg {
  cursor: pointer;
}
</style>