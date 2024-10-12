<template>
    <div class="new-appliance">
      <h2>New Appliances</h2>
      <label class="checkbox-label" v-for="appliance in appliances" :key="appliance.name">
        <input type="checkbox" v-model="localValue[appliance.name]" :disabled="localValue.noCabinets && appliance.name != 'noCabinets'" />
        {{ appliance.label }}
      </label>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch } from 'vue';
  
  const props = defineProps({
    modelValue: Object,
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const appliances = [
    { name: 'noCabinets', label: 'No appliances'},
    { name: 'newRange', label: 'Range' },
    { name: 'newCooktop', label: 'Cooktop' },
    { name: 'newWallOven', label: 'Wall Oven' },
    { name: 'newMicrowave', label: 'Built-in Microwave' },
    { name: 'newFridge', label: 'Fridge' },
    { name: 'newDishwasher', label: 'Dishwasher' },
    { name: 'newRangeHood', label: 'Range Hood' },
  ];
  
  const localValue = reactive(
    appliances.reduce((acc, curr) => {
      acc[curr.name] = props.modelValue?.[curr.name] || false;
      return acc;
    }, {})
  );
  
  watch(
    () => props.modelValue,
    (newVal) => {
      appliances.forEach((appliance) => {
        localValue[appliance.name] = newVal?.[appliance.name] || false;
      });
    },
    { immediate: true, deep: true }
  );

    // Watcher to reset other demo options when "No demo" is checked
    watch(
  () => localValue.noCabinets,
  (newVal) => {
    if (newVal) {
      localValue.newRange = false;
      localValue.newCooktop = false;
      localValue.newWallOven = false;
      localValue.newMicrowave = false;
      localValue.newFridge = false;
      localValue.newDishwasher = false;
      localValue.newRangeHood = false;
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
  .new-appliance {
  grid-column: 2 / 2;
  grid-row: 1 / 1;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    width: 200px;
  }

  
  </style>
  