<template>
  <div>
    <!-- <label :for="id">{{ label }}</label> -->
    <Field as="select" :name="name" :value="modelValue" @change="updateValue" class="common-select"> 
      <option value="" disabled>Select {{ label }}</option>
      <option v-for="(option, index) in options" :key="index" :value="option">{{ option }}</option>
    </Field>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Field } from "vee-validate";

export default defineComponent({
  props: {
    name: { type: String, required: true },
    modelValue: { type: String, required: true },
    label: { type: String, default: "" },
    options: { type: Array as () => string[], required: true },
    errorMessage: { type: String, default: null },
    id: { type: String, required: true },
  },
  components: {
    Field,
  },
  methods: {
    updateValue(event: Event) {
      const target = event.target as HTMLSelectElement;
      this.$emit("update:modelValue", target.value); // Emit the new value
    },
  },
});
</script>

<style lang="scss">
@import "@/styles/styles.scss"; // Import the SCSS styles

</style>