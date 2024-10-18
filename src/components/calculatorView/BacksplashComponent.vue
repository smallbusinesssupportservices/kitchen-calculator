<template>
  <div class="backsplash">
    <h2>Backsplash</h2>
    <label class="checkbox-label" for="noBacksplash">
      <input
        type="radio"
        id="noBacksplash"
        value="noBacksplash"
        v-model="localValue.backsplash"
      />
      No backsplash
    </label>
    <label class="checkbox-label" for="backsplash">
      <input
        type="radio"
        id="backsplash"
        value="backsplash"
        v-model="localValue.backsplash"
      />
      Backsplash
    </label>
    
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';
import { babelParse } from 'vue/compiler-sfc';

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
  backsplash: props.modelValue?.backsplash || '',
});

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { deep: true, immediate: true }
);


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
  grid-column: 3 / 3;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  
}
</style>