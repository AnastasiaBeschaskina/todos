<template>
  <div class="input-date">
    <!-- Label for the date input field -->
    <!-- <label :for="id">{{ label }}</label> -->
    <input
      type="date"
      :id="id"
      v-model="localDate"
      :min="minDate"
      required
      @input="validateDate"
      class="common-input"
    />
    <!-- Display an error message if there is one -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
export default {
  props: {
    // The 'id' prop is required to bind the label and input
    id: {
      type: String,
      required: true,
    },
    // The 'label' prop is used to display the label text
    label: {
      type: String,
      required: true,
    },
    // 'modelValue' is the v-model value passed from the parent component
    modelValue: {
      type: String,
      required: true,
    },
    // 'minDate' is the minimum date that can be selected, defaulting to today's date
    minDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0], // Set today's date as the minimum
    },
  },
  data() {
    return {
      // 'localDate' holds the local state of the date input
      localDate: this.modelValue,
      // 'errorMessage' holds any validation error message
      errorMessage: null,
    };
  },
  watch: {
    // Watch for changes in the 'modelValue' prop to sync the 'localDate'
    modelValue(newVal) {
      this.localDate = newVal;
    },
    // Watch for changes in 'localDate' and emit 'update:modelValue' to the parent component
    localDate(newDate) {
      this.$emit("update:modelValue", newDate);
    },
  },
  methods: {
    // Method to validate the date input
    validateDate() {
      // If the date is empty, set an error message
      if (!this.localDate) {
        this.errorMessage = "Date is required";
      }
      // If the date is earlier than the minimum date, set an error message
      else if (this.localDate < this.minDate) {
        this.errorMessage = `Date cannot be earlier than ${this.minDate}`;
      }
      // If the date is valid, clear the error message
      else {
        this.errorMessage = null;
      }
    },
  },
};
</script>

<style scoped>
/* Style the error message with red color and a smaller font size */
.error-message {
  color: red;
  font-size: 0.9rem;
}

.input-date {
  display: block;
  width: 293px;
}
.input-date input {
 padding-left: 3px; 
  color: #777; 
}

</style>
