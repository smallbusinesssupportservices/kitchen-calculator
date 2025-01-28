<template>
  <button
    type="button"
    :class="['progress-button', { disabled: isDisabled }, { loading: isLoading }]"
    :disabled="isDisabled || isLoading"
    @click="handleClick"
    aria-disabled="isDisabled || isLoading"
    aria-live="polite"
  >
    <div class="progress-overlay" :style="{ width: `${progress}%` }"></div>
    <span class="progress-text">
      <span v-if="isLoading">Submitting...</span>
      <span v-else-if="progress > 0 && progress < 100">Progress: {{ progress }}%</span>
      <span v-else>{{ buttonText }}</span>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

// Define component props
const props = defineProps({
  progress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 100,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  buttonText: {
    type: String,
    default: 'Calculate',
  },
});

// Define emitted events
const emit = defineEmits(['click']);

// Computed properties for easier class and state management
const isDisabled = computed(() => props.disabled);
const isLoading = computed(() => props.loading);

// Handle button click by emitting the 'click' event
const handleClick = (event) => {
  event.preventDefault(); // Prevent default button behavior
  emit('click', event);
};
</script>

<style scoped>
.progress-button {
  position: relative;
  overflow: hidden;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.progress-button:hover:not(.disabled):not(.loading) {
  background-color: #0056b3;
}

.progress-button.disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.progress-button.loading {
  background-color: #6c757d;
  cursor: not-allowed;
}

.progress-overlay {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background-color: #007bff;
  transition: width 0.3s ease;
  z-index: 1;
}

.progress-text {
  position: relative;
  z-index: 2;
  color: #fff;
  font-weight: bold;
  transition: opacity 0.3s ease;
}

.progress-button:focus {
  outline: 2px solid #0056b3;
  outline-offset: 2px;
}
</style>