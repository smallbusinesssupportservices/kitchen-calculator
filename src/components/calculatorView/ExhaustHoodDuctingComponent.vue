<template>
  <div class="exhaust-hood">
    <h2>Exhaust Hood</h2>
    <h3>Ducting</h3>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.noExhaustHood" />
      No exhaust hood
    </label>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.runExhaustDucting" :disabled="localValue.noExhaustHood" />
      Run new exhaust ducting from range hood to exterior
    </label>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.runDuctingThroughBrick" :disabled="localValue.noExhaustHood" />
      Run ducting through brick
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
  runExhaustDucting: props.modelValue?.runExhaustDucting || false,
  runDuctingThroughBrick: props.modelValue?.runDuctingThroughBrick || false,
  noExhaustHood: props.modelValue.noExhaustHood || false,
});

// Watcher to synchronize props with localValue
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { immediate: true, deep: true }
);

// Watcher to reset other exhausthood options when "No exhausthood" is checked
watch(
  () => localValue.noExhaustHood,
  (newVal) => {
    if (newVal) {
      localValue.runExhaustDucting = false;
      localValue.runDuctingThroughBrick = false;
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
.exhaust-hood {
  grid-column: 3 / 3;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  
}
</style>