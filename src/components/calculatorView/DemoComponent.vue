<!-- DemoComponent.vue -->
<template>
  <div class="demo">
    <h2>Demo</h2>
    <div class="checkbox-group">
      <label v-if="!anyDemoSelected" class="checkbox-label">
        <input type="checkbox" v-model="localValue.noDemo" disabled :value="true"/>
        No demo
      </label>
      <template v-for="option in demoOptions" :key="option.name">
        <!-- Conditionally render each checkbox -->
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
  }, demoFlooring: {
    type: String,
    default: 'false'
  },
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
  { name: 'lightDemo', label: 'Light non-structural demo (e.g., removing pantry, bar wall)'},
  { name: 'drywallRepair', label: 'Drywall Repair' }
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
  noDemo: props.modelValue.noDemo || true,
  dumpster: props.modelValue.dumpster || false
});

// Function to determine if a demo option should be disabled
const isOptionDisabled = (option) => {
  if (localValue.noDemo) return true;

  const disableConditions = {
    removeSink: props.demoSink && props.demoSink !== 'false',
    removeCountertops: props.demoCountertops && props.demoCountertops !== 'noCountertop',
    removeBacksplash: props.demoBacksplash,
    removeCabinets: ['fullCustomCabinets', 'standardLineCabinets'].includes(props.demoCabinets),
    drywallRepair: localValue.lightDemo,
    removeFlooring: props.demoFlooring && props.demoFlooring !== 'false',
  };

  return disableConditions[option.name] || false;
};

// Function to determine if a demo option should be shown
const shouldShowOption = (option) => {
  if (localValue.noDemo) return false; 

  const showConditions = {
    removeSink: props.demoSink && props.demoSink !== 'false',
    removeCountertops: props.demoCountertops && props.demoCountertops !== 'noCountertop',
    removeBacksplash: props.demoBacksplash,
    removeCabinets: ['fullCustomCabinets', 'standardLineCabinets'].includes(props.demoCabinets),
    drywallRepair: localValue.lightDemo,
    removeFlooring: props.demoFlooring && props.demoFlooring !== 'false',
  };

  return showConditions[option?.name] || false;
};

// Computed property to check if any demo option is selected
const anyDemoSelected = computed(() => {
  return demoOptions.some(option => localValue[option.name]);
});

// Watcher to update 'noDemo' based on whether any demo option is selected
watch(anyDemoSelected, (newVal) => {
  if (newVal) {
    // If any demo option is selected, uncheck 'noDemo'
    if (localValue.noDemo) {
      localValue.noDemo = false;
    }
  } else {
    // If no demo options are selected, check 'noDemo'
    if (!localValue.noDemo) {
      localValue.noDemo = true;
    }
  }
});


// Watcher to synchronize props with localValue
watch(
  () => props.modelValue,
  (newVal) => {
    // Destructure to exclude 'noDemo' from being overwritten
    const { noDemo, ...rest } = newVal;
    Object.assign(localValue, rest);
    // 'noDemo' is managed internally based on demo selections
  },
  { deep: true, immediate: true }
);

// Watcher to automatically set drywallRepair when lightDemo is checked
watch(
  () => localValue.lightDemo,
  (newVal) => {
    if (newVal) {
      if (!localValue.drywallRepair) {
        localValue.drywallRepair = true;
      }
    } else {
      if (localValue.drywallRepair) {
        localValue.drywallRepair = false;
      }
    }
  }
);

// Watcher to automatically set and disable removeBacksplash
watch(
  () => props.demoBacksplash,
  (newVal) => {
    if (newVal) {
      console.log("props.demoBacksplash: ", props.demoBacksplash)
      if (!localValue.removeBacksplash) {
        localValue.removeBacksplash = true;
      }
    } else {
      localValue.removeBacksplash = false;
    }
  }
);

// Watcher to automatically set and disable removeBacksplash
watch(
  () => props.demoCountertops,
  (newVal) => {
    if (newVal) {
      console.log("props.demoCountertops: ", props.demoCountertops)
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
    console.log("newVal: ", newVal)
    console.log("BEFORE: localValue.removeSink: ", localValue.removeSink)
    if (newVal !== 'false') {
      localValue.removeSink = true;
    } else {
      localValue.removeSink = false;
    }
    console.log("AFTER: localValue.removeSink: ", localValue.removeSink)

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

// Watchers to Handle removeCabinets Based on demoStandardLineCabinets and demoFullCustomCabinets**
watch(
  () => props.demoCabinets,
  (newVal) => {
    console.log("props.demoCabinets: ", props.demoCabinets)
    if (newVal === 'standardLineCabinets' || newVal === 'fullCustomCabinets') {
      if (!localValue.removeCabinets) {
        localValue.removeCabinets = true;
      } else {
        localValue.removeCabinets = false;
      }
    }
    if (newVal === 'noCabinets') {
      localValue.removeCabinets = false;
    }
  }
);

// Watcher to reset other demo options when "No demo" is checked
watch(
  () => localValue.noDemo,
  (newVal) => {
    console.log("localValue.noDemo: ", localValue.noDemo)
    if (newVal) {
      console.log("newVal: ", newVal)
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
  grid-column: 7 / 7;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
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
  /* Grey out the label text when disabled */
  cursor: not-allowed;
}
</style>
