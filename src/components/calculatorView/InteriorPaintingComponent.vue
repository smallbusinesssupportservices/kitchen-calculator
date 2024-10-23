<template>
  <div class="interior-paint">
    <h2>Interior Painting</h2>
    <h3></h3>
    <label class="checkbox-label">
      <input type="radio" v-model="localValue.paintKitchen" :value="false" />
      <span>No paint</span>     
    </label>
    <label class="checkbox-label">
      <input type="radio" v-model="localValue.paintKitchen" :value="true" />
      Paint the kitchen
    </label>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(['update:modelValue']);

const localValue = reactive({
  paintKitchen: props.modelValue?.paintKitchen || '', 
});

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { deep: true, immediate: true }
);

watch(
  () => localValue.paintKitchen,
  (newVal) => {
    emit('update:modelValue', { ...localValue });
  },
  { deep: true }
);
</script>

<style scoped>
.interior-paint {
  grid-column: 2 / 2;
  grid-row: 1 / 1;
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

