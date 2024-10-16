<template>
  <div class="combined">
    <!-- Electrical Section -->
    <div class="electric">
      <h2>Electrical</h2>
      <label class="checkbox-label">
        <input type="checkbox" v-model="localValue.noElectrical" />
        No electrical
      </label>

      <!-- Swap Fixtures -->
      <div class="checkbox-group">
        <label class="checkbox-label" for="swapFixtures">
          <input type="checkbox" id="swapFixtures" v-model="localValue.swapFixtures"
            :disabled="localValue.noElectrical" />
          Swap fixtures
        </label>
      </div>

      <!-- Fixture Count Input -->
      <div v-if="localValue.swapFixtures" class="sub-section">
        <label for="fixtureCount">
          Fixture count:
          <input type="number" id="fixtureCount" v-model="localValue.fixtureCount" min="0"
            :required="localValue.swapFixtures" placeholder="Enter fixture count" />
        </label>
        <!-- Error Message -->
        <div v-if="fixtureCountError" class="error-message" role="alert">
          Fixture count is required and must be a positive number.
        </div>
      </div>

      <!-- Electrical Options -->
      <div class="checkbox-group">
        <label v-for="option in electricalOptions" :key="option.name" class="checkbox-label"
          :for="`electrical-${option.name}`">
          <input type="checkbox" :id="`electrical-${option.name}`" v-model="localValue[option.name]"
            :disabled="localValue.noElectrical || (option.name === 'drywallRepair' && localValue.addCanLights)" />
          {{ option.label }}
        </label>
      </div>
      <div v-if="localValue.addCanLights">
        <label class="checkbox-label" for="drywallRepair">
          <input type="checkbox" id="drywallRepair" v-model="localValue.drywallRepair"
            :disabled="localValue.addCanLights" />
          Drywall Repair
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

// Define props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

// Define emits
const emit = defineEmits(['update:modelValue']);

// Reactive state
const localValue = reactive({
  // Electrical properties
  swapFixtures: props.modelValue?.swapFixtures || false,
  fixtureCount: props.modelValue?.fixtureCount || '',
  addCanLights: props.modelValue?.addCanLights || false,
  addUnderCabinetLights: props.modelValue?.addUnderCabinetLights || false,
  switchesAndOutlets: props.modelValue?.switchesAndOutlets || false,
  applianceOutlets: props.modelValue?.applianceOutlets || false,
  drywallRepair: props.modelValue?.drywallRepair || false,
  noElectrical: props.modelValue.noElectrical || false,
});

// Define electrical options
const electricalOptions = [
  { name: 'addUnderCabinetLights', label: 'Add undercabinet lights' },
  { name: 'switchesAndOutlets', label: 'Add/move outlets/switches' },
  { name: 'applianceOutlets', label: 'Add/move appliance outlets' },
  { name: 'addCanLights', label: 'Add can lights' },
];

// Computed property to determine if Drywall Repair should be disabled
const isDrywallRepairDisabled = computed(() => localValue.addCanLights);

// Computed property for Fixture Count validation
const fixtureCountError = computed(() => {
  if (!localValue.swapFixtures) {
    return false;
  }
  const count = parseInt(localValue.fixtureCount, 10);
  return isNaN(count) || count <= 0;
});

// Watcher to synchronize props with localValue
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { immediate: true, deep: true }
);

  // Watcher to reset other electrical options when "No electrical" is checked
  watch(
  () => localValue.noElectrical,
  (newVal) => {
    if (newVal) {
      localValue.addUnderCabinetLights = false;
      localValue.switchesAndOutlets = false;
      localValue.applianceOutlets = false;
      localValue.addCanLights = false;
      localValue.swapFixtures = false;
      localValue.fixtureCount = '';
    }
  }
);

// Watch for changes in addCanLights to automatically check/uncheck drywallRepair
watch(
  () => localValue.addCanLights,
  (newVal) => {
    localValue.drywallRepair = newVal;
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
.combined {
  display: flex;
  gap: 20px;
}

.electric {
  grid-column: 6 / 6;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
  /* Increased width for better spacing */
}

.checkbox-group {
  display: flex;
  flex-direction: column;
}

.checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.checkbox-label input {
  margin-right: 10px;
}

.sub-section {
  margin-top: 15px;
  padding-left: 20px;
}

.drywall .checkbox-label input[disabled] {
  cursor: not-allowed;
  opacity: 0.6;
  /* Indicates disabled state visually */
}

/* Error Message Styling */
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

/* Responsive Design */
@media (max-width: 700px) {
  .combined {
    flex-direction: column;
    align-items: center;
  }

  .electric {
    width: 90%;
    /* Adjust width for smaller screens */
  }
}
</style>
