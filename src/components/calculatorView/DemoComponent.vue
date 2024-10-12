<template>
  <div class="demo">
    <h2>Demo</h2>
    <div class="checkbox-group">
      <label class="checkbox-label" >
        <input type="checkbox" v-model="localValue.noDemo" />
        No demo
      </label>
      <label
        v-for="option in demoOptions"
        :key="option.name"
        
        class="checkbox-label"
      >
        <input type="checkbox" v-model="localValue[option.name]" :disabled="localValue.noDemo || (option.name === 'drywallRepair' && localValue.lightDemo)"/>
        <span>{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:modelValue']);

// Reactive state for demo options (excluding dumpster)
const localValue = reactive({
  removeSink: props.modelValue.removeSink || false,
  removeCountertops: props.modelValue.removeCountertops || false,
  removeCabinets: props.modelValue.removeCabinets || false,
  removeBacksplash: props.modelValue.removeBacksplash || false,
  removeFlooring: props.modelValue.removeFlooring || false,
  lightDemo: props.modelValue.lightDemo || false,
  drywallRepair: props.modelValue.drywallRepair || false,
  noDemo: props.modelValue.noDemo || false
});

// Define demo options
const demoOptions = [
  { name: 'removeSink', label: 'Remove sink & faucet' },
  { name: 'removeCountertops', label: 'Remove countertops' },
  { name: 'removeCabinets', label: 'Remove cabinets' },
  { name: 'removeBacksplash', label: 'Remove backsplash' },
  { name: 'removeFlooring', label: 'Remove flooring' },
  {
    name: 'lightDemo',
    label: 'Light non-structural demo (e.g., removing pantry, bar wall)',
  },
  { name: 'drywallRepair', label: 'Drywall Repair'}
];

// Computed property to check if any demo option is selected
const anyDemoSelected = computed(() =>
  demoOptions.some((option) => localValue[option.name])
);

  const anyLightDemoSelected = computed(() =>
  demoOptions.some()
);
// Watcher to synchronize props with localValue
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { deep: true, immediate: true }
);

// Watcher to automatically set drywallRepair when lightDemo is checked
watch(
  () => localValue.lightDemo,
  (newVal) => {
    if (newVal) {
      localValue.drywallRepair = true;
    } else {
      localValue.drywallRepair = false;
    }
  }
);

  // Watcher to reset other demo options when "No demo" is checked
  watch(
  () => localValue.noDemo,
  (newVal) => {
    if (newVal) {
      localValue.removeSink = false;
      localValue.removeCountertops = false;
      localValue.removeCabinets = false;
      localValue.removeBacksplash = false;
      localValue.removeFlooring = false;
      localValue.lightDemo = false;
      localValue.drywallRepair = false;
    }
  }
);

// Watcher to emit updates including anyDemoSelected
watch(
  localValue,
  () => {
    emit('update:modelValue', { ...localValue });
  },
  { deep: true }
);
</script>

<style scoped>
.demo {
  grid-column: 2 / 2;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}

h2 {
  margin-bottom: 10px;
}

h3 {
  margin-bottom: 15px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
}

.checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.checkbox-label input {
  margin-right: 8px;
}
</style>
