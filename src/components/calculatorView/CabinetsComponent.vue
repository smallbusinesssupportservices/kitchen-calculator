<!-- CabinetsComponent.vue -->
<template>
  <div class="cabinets">
    <h2>Cabinets</h2>
    <!-- Main Cabinet Options as Radio Buttons -->
    <label class="radio-label">
      <input type="radio" name="cabinetOptions" value="noCabinets" v-model="localValue.cabinetType" />
      No cabinets
    </label>
    <label class="radio-label">
      <input type="radio" name="cabinetOptions" value="paintStainedCabinets" v-model="localValue.cabinetType"
        :disabled="isOptionDisabled('paintStainedCabinets')" />
      Paint stained cabinets
    </label>
    <label class="radio-label">
      <input type="radio" name="cabinetOptions" value="paintPaintedCabinets" v-model="localValue.cabinetType"
        :disabled="isOptionDisabled('paintPaintedCabinets')" />
      Repaint cabinets
    </label>
    <label class="radio-label">
      <input type="radio" name="cabinetOptions" value="standardLineCabinets" v-model="localValue.cabinetType"
        :disabled="isOptionDisabled('standardLineCabinets')" />
      Standard Line Cabinets
    </label>
    <div class="sub-section" v-if="localValue.cabinetType == 'standardLineCabinets'">
      <label class="checkbox-label">
        <input type="checkbox" v-model="localValue.customColorBase" :disabled="isSubOptionDisabled" />
        Custom Color for standard line Shaker base cabinets
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="localValue.customColorWall" :disabled="isSubOptionDisabled" />
        Custom Color for standard line Shaker wall cabinets
      </label>
    </div>
    <label class="radio-label">
      <input type="radio" name="cabinetOptions" value="fullCustomCabinets" v-model="localValue.cabinetType"
        :disabled="isOptionDisabled('fullCustomCabinets')" />
      Full custom cabinets
    </label>
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
});

// Define Emits
const emit = defineEmits(['update:modelValue']);

const localValue = reactive({
  cabinetType: props.modelValue.cabinetType || '',
});

// Computed property to determine if sub-options should be disabled
const isSubOptionDisabled = computed(() => {
  return localValue.noCabinets;
});


// Function to determine if a main option should be disabled
const isOptionDisabled = (optionName) => {
  // Add any additional logic if certain options need to be disabled based on other conditions
  // For example, you can disable options based on other formData properties
  // Currently, assuming no additional conditions
  return false;
};


watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);

  },
  { deep: true, immediate: true }
);


 // Watcher to reset other countertops options when "No countertops" is checked
 watch(
  () => localValue.noCabinets,
  (newVal) => {
    if (newVal == 'noCabinets') {
      // localValue.standardLineCabinets = false;
      localValue.customColorBase =false;
      localValue.customColorWall = false;
      localValue.dumpster = false;
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
.cabinets {
  grid-column: 1 / 1;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  
}

.radio-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.radio-label input {
  margin-right: 8px;
}

.checkbox-label input:disabled+span {
  color: #888;
  /* Grey out the label text when disabled */
  cursor: not-allowed;
}

.sub-section {
  margin-left: 20px;
}
</style>
