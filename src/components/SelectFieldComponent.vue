<template>
  <div class="select">
    <Field as="select" :name="name" :value="modelValue" @change="updateValue">
      <option value="" disabled class="ladel">Select {{ label }}</option>
      <option v-for="(option, index) in options" :key="index" :value="option">
        {{ option }}
      </option>
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
      this.$emit("update:modelValue", target.value);
    },
  },
});
</script>

<style lang="scss">
@import "@/styles/styles.scss";

.select {
  display: block;
  width: 300px;
  margin: 0;
  padding: 0;
}

.select select {
  display: block;
  max-width: 100%;
  width: 300px;
}
.select :nth-child(1) {
  color: #777;
}
</style>
