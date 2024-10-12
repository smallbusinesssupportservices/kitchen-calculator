<template>
  <div class="interior-paint">
    <h2>Interior Painting</h2>
    <h3></h3>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.noInteriorPaint" />
      <span>No paint</span>     
    </label>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.paintKitchen" :disabled="localValue.noInteriorPaint" />
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
  paintKitchen: props.modelValue?.paintKitchen || false,
  noInteriorPaint: props.modelValue.noInteriorPaint || false,
});

watch(
    () => props.modelValue,
    (newVal) => {
      Object.assign(localValue, newVal);
    },
    { deep: true, immediate: true }
  );
  
  watch(
  () => localValue.noInteriorPaint,
  (newVal) => {
    if (newVal) {
      localValue.paintKitchen = false;
    }
  }
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
.interior-paint {
  grid-column: 2 / 2;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}
</style>
