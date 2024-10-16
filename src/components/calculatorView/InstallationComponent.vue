<template>
    <div class="installation">
      <h2>Installation</h2>
      <label class="checkbox-label" >
        <input type="checkbox" v-model="localValue.noInstallation" />
        No installation
      </label>
      <label class="checkbox-label" >
        <input type="checkbox" v-model="localValue.installAppliances" :disabled="localValue.noInstallation"/>
        Appliance Install
      </label>
      <label class="checkbox-label" >
        <input type="checkbox" v-model="localValue.installVentHood" :disabled="localValue.noInstallation"/>
        Exhaust Hood
      </label>
      <label class="checkbox-label" >
        <input type="checkbox" v-model="localValue.installWallOven" :disabled="localValue.noInstallation"/>
        Wall Oven
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
    installAppliances: props.modelValue?.installAppliances || false,
    installVentHood: props.modelValue?.installVentHood || false,
    installWallOven: props.modelValue?.installWallOven || false,
    noInstallation: props.modelValue.noInstallation || false,
  });
  
  watch(
    () => props.modelValue,
    (newVal) => {
      Object.assign(localValue, newVal);
    },
    { immediate: true, deep: true }
  );
  
      // Watcher to reset other demo options when "No demo" is checked
      watch(
  () => localValue.noInstallation,
  (newVal) => {
    if (newVal) {
      localValue.installAppliances = false;
      localValue.installVentHood = false;
      localValue.installWallOven = false;
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
  .installation {
    grid-column: 3 / 3;
    grid-row: 2 / 2;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    width: 200px;
  }


  </style>
  