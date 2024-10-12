<template>
  <div class="cleaning">
    <h2>Final Cleaning</h2>
    <label class="checkbox-label" >
      <input type="checkbox" v-model="localValue.noCleaning" />
      No cleaning
    </label>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.cleanKitchen" :disabled="localValue.noCleaning"/>
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
  cleanKitchen: props.modelValue?.cleanKitchen || false,
  noCleaning: props.modelValue.noCleaning || false
});

watch(
    () => props.modelValue,
    (newVal) => {
      Object.assign(localValue, newVal);
    },
    { deep: true, immediate: true }
  );

  // Watcher to reset cleaning options when "No cleaning" is checked
watch(
  () => localValue.noCleaning,
  (newVal) => {
    if (newVal) {
      localValue.cleanKitchen = false;
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
.cleaning{
  grid-column: 6 / 6;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}
</style>
