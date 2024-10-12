<template>
  <div class="new-fixtures">
    <h2>New Fixtures</h2>
    <label>
      Your estimated cost per fixture:
      <input type="number" v-model="localValue.fixtureCost" min="0" />
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
  fixtureCost: props.modelValue?.fixtureCost || 0,
});

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.fixtureCost = newVal?.fixtureCost || 0;
  },
  { immediate: true }
);

watch(
  () => localValue.fixtureCost,
  () => {
    emit('update:modelValue', { fixtureCost: localValue.fixtureCost });
  }
);
</script>

<style scoped>
.new-fixtures {
  grid-column: 1 / 1;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}
</style>
