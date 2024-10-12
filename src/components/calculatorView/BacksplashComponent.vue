<template>
    <div class="backsplash">
      <h2>Backsplash</h2>
      <label class="checkbox-label">
        <input type="checkbox" v-model="localValue.noBacksplash" />
        No backsplash
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="localValue.backsplash" :disabled="localValue.noBacksplash" />
        Backsplash
      </label>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch } from 'vue';
  
  // Define props
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  });
  
  // Define emits
  const emit = defineEmits(['update:modelValue']);
  
  // Initialize local state
  const localValue = reactive({
    backsplash: props.modelValue?.backsplash || false,
    noBacksplash: props.modelValue.noBacksplash || false,
  });
  
  // Watch for changes from parent
  watch(
    () => props.modelValue,
    (newVal) => {
      Object.assign(localValue, newVal);
    },
    { deep: true, immediate: true }
  );
  
  // Watcher to reset other demo options when "No demo" is checked
  watch(
    () => localValue.noBacksplash,
    (newVal) => {
      if (newVal) {
        localValue.backsplash = false;
      }
    }
  );
  
  // Watch for local changes to update parent
  watch(
    localValue,
    () => {
      emit('update:modelValue', { ...localValue });
    },
    { deep: true }
  );
  </script>
  
  <style scoped>
  .backsplash {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    width: 200px;
  }
  </style>
  