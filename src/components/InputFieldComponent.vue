<template>
  <div class="common-select">
    <!-- <label :for="id">{{ label }}</label> -->
    <input
      type="text"
      :id="id"
      :value="modelValue"  
      @input="updateValue" 
      :placeholder="placeholder"
      required
      class="common-input"
    />
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    name: { type: String, required: true },
    modelValue: { type: String, required: true },
    placeholder: { type: String, default: "" },
    label: { type: String, default: "" },
    errorMessage: { type: String, default: null },
    id: { type: String, required: true },
    error: {}
    
  },
  methods: {
    updateValue(event: Event) {
      const target = event.target as HTMLInputElement;
      this.$emit("update:modelValue", target.value); // Emit the new value
    },
  },
});
</script>

<style lang="scss">
@import "@/styles/styles.scss"; 

.common-select input {
  padding-left: 3px;
  display: block;
  width: 100%;
  width: 295px;
  // border: 2px solid red;
  // width: 100%;
  // max-width: 300px;
}

</style>