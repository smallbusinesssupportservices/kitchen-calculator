<template>
  <div class="demo">
    <h2>Demo</h2>
    <div class="checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="localValue.noDemo" value="clientDemo"/>
        Client will demo
      </label>
      <template v-for="option in demoOptions" :key="option.name">
        <label v-if="shouldShowOption(option)" class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="localValue[option.name]" 
            :disabled="isOptionDisabled(option)" 
          />
          <span :class="{ disabled: isOptionDisabled(option) }">
            {{ option.label }}
          </span>
        </label>
      </template>
      <!-- Only show drywall repair when lightDemo is checked -->
      <label v-if="localValue.lightDemo" class="checkbox-label">
        <input 
          type="checkbox" 
          v-model="localValue.drywallRepair" 
          disabled
        />
        <span class="disabled">Drywall Repair</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

// Define Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  demoSink: {
    type: String,
    default: 'false',
  },
  demoCountertops: {
    type: String,
    default: 'noCountertop'
  },
  demoBacksplash: {
    type: Boolean,
    default: false
  },
  demoCabinets: {
    type: String,
    default: ''
  }, 
  demoFlooring: {
    type: String,
    default: 'false'
  }
});

// Define Emits
const emit = defineEmits(['update:modelValue']);

// Define demo options
const demoOptions = [
  { name: 'removeSink', label: 'Remove sink & faucet' },
  { name: 'removeCountertops', label: 'Remove countertops' },
  { name: 'removeCabinets', label: 'Remove cabinets' }, 
  { name: 'removeBacksplash', label: 'Remove backsplash' },
  { name: 'removeFlooring', label: 'Remove flooring' },
  { name: 'lightDemo', label: 'Light non-structural demo (e.g., removing pantry, bar wall)'}
];

// Initialize local state
const localValue = reactive({
  removeSink: props.modelValue.removeSink || false,
  removeCountertops: props.modelValue.removeCountertops || false,
  removeCabinets: props.modelValue.removeCabinets || false,
  removeBacksplash: props.modelValue.removeBacksplash || false, 
  removeFlooring: props.modelValue.removeFlooring || false,
  lightDemo: props.modelValue.lightDemo || false,
  drywallRepair: props.modelValue.drywallRepair || false,
  noDemo: props.modelValue.noDemo || false,
});

// Function to determine if a demo option should be disabled
const isOptionDisabled = (option) => {
  if (localValue.noDemo) return true;
  const disableConditions = {
    removeSink: props.demoSink && props.demoSink !== 'false',
    removeCountertops: props.demoCountertops && props.demoCountertops !== 'noCountertop',
    removeBacksplash: localValue.removeBacksplash,
    removeCabinets: ['fullCustomCabinets', 'standardLineCabinets'].includes(props.demoCabinets),
    removeFlooring: props.demoFlooring && props.demoFlooring !== 'false',
  };

  return disableConditions[option.name] || false;
};

// Function to determine if a demo option should be shown
const shouldShowOption = (option) => {
  return true;
};

// Watcher to synchronize props with localValue
watch(
  () => props.modelValue,
  (newVal) => {
    const { noDemo, ...rest } = newVal;
    Object.assign(localValue, rest);
  },
  { deep: true, immediate: true }
);

// Watcher to automatically set drywallRepair when lightDemo is checked
watch(
  () => localValue.lightDemo,
  (newVal) => {
    localValue.drywallRepair = newVal;
  }
);

// Watcher to automatically set and disable removeBacksplash
watch(
  () => props.demoBacksplash,
  (newVal) => {
    if (newVal) {
      if (!localValue.removeBacksplash) {
        localValue.removeBacksplash = true;
      }
    } else {
      localValue.removeBacksplash = false;
    }
  }
);

// Watcher to automatically set and disable removeCountertops
watch(
  () => props.demoCountertops,
  (newVal) => {
    if (newVal) {
      if (!localValue.removeCountertops) {
        localValue.removeCountertops = true;
      }
    } else {
      localValue.removeCountertops = false;
    }

    if (newVal == 'noCountertop') localValue.removeCountertops = false;
  }
);

// Watcher to automatically set and disable removeSink
watch(
  () => props.demoSink,
  (newVal) => {
    if (newVal !== 'false') {
      localValue.removeSink = true;
    } else {
      localValue.removeSink = false;
    }
  }
);

// Watcher to automatically set and disable demoFlooring
watch(
  () => props.demoFlooring,
  (newVal) => {
    if (newVal === 'false') {
      localValue.removeFlooring = false;
    } else {
      localValue.removeFlooring = true;
    }
  }
);

// Watchers to Handle removeCabinets Based on demoStandardLineCabinets and demoFullCustomCabinets
watch(
  () => props.demoCabinets,
  (newVal) => {
    if (newVal === 'Standard Line Cabinets' || newVal === 'Full custom cabinets') {
      localValue.removeCabinets = false;
    } else {
      localValue.removeCabinets = true;
    }

    if (newVal === 'noCabinets') localValue.removeCabinets = false;
  }
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
.demo {
  grid-column: 5 / 5;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}

h2 {
  margin-bottom: 10px;
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

/* Style for disabled labels */
.checkbox-label .disabled {
  color: #888;
  cursor: not-allowed;
}
</style>