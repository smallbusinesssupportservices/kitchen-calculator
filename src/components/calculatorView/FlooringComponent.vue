<template>
  <div class="flooring">
    <h2>Flooring</h2>
    <label class="checkbox-label" >
      <input
        type="radio"
        value="false"
        v-model="localValue.flooringType"
      />
      No flooring
    </label>
    <label class="checkbox-label" >
      <input
        type="radio"
        value="LVP/Engineered"
        v-model="localValue.flooringType"
      />
      LVP/Engineered
    </label>
    <label class="checkbox-label" >
      <input
        type="radio"
        value="Hardwood"
        v-model="localValue.flooringType"
      />
      Hardwood
    </label>
    <label class="checkbox-label" >
      <input type="radio" value="Tile" v-model="localValue.flooringType" />
      Tile
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
  flooringType: props.modelValue?.flooringType || '',
});

// Watch for changes from parent
watch(
    () => props.modelValue,
    (newVal) => {
      Object.assign(localValue, newVal);
    },
    { deep: true, immediate: true }
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
.flooring {
  grid-column: 3 / 3;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}
</style>
