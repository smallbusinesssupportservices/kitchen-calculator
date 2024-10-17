<template>
  <div class="cleaning">
    <h2>Final Cleaning</h2>
    <label class="checkbox-label">
      <input type="radio" v-model="localValue.cleaningOption" value="none" />
      No cleaning
    </label>
    <label class="checkbox-label">
      <input type="radio" v-model="localValue.cleaningOption" value="kitchen" />
      Clean the kitchen
    </label>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue']);

const localValue = reactive({
  cleaningOption: props.modelValue?.cleaningOption || '', 
});

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { deep: true, immediate: true }
);

// Watcher to emit changes back to the parent
watch(
  localValue,
  () => {
    emit('update:modelValue', { ...localValue });
  },
  { deep: true }
);
</script>

<style scoped>
.cleaning {
  grid-column: 4 / 4;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  
}
.radio-label {
  display: block;
  margin-bottom: 10px;
}
</style>
