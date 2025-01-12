<template>
  <div class="kitchen-size">
    <h2>Kitchen Size</h2>

    <!-- (Optional) Toggle for sq.in / sq.ft. -->
    <!--
    <h3>
      <div class="unit-toggle">
        <span class="unit-label">in.</span>
        <label class="toggle-switch">
          <input type="checkbox" v-model="isSquareFeet" />
          <span class="slider"></span>
        </label>
        <span class="unit-label">ft.</span>
      </div>
    </h3>
    -->

    <!-- Length (Feet / Inches) -->
    <div class="length-row">
      <label>Length:</label>
      <input
        type="number"
        v-model="lengthFeet"
        min="0"
        placeholder="0"
      />
      <span>ft.</span>
      <input
        type="number"
        v-model="lengthInches"
        min="0"
        placeholder="0"
      />
      <span>in.</span>
    </div>

    <!-- Width (Feet / Inches) -->
    <div class="width-row">
      <label>Width:</label>
      <input
        type="number"
        v-model="widthFeet"
        min="0"
        placeholder="0"
      />
      <span>ft.</span>
      <input
        type="number"
        v-model="widthInches"
        min="0"
        placeholder="0"
      />
      <span>in.</span>
    </div>

    <!-- Display the kitchen area -->
    <div v-if="kitchenArea !== null" class="kitchen-area">
      <strong>Area:</strong>
      {{ kitchenArea }} {{ isSquareFeet ? 'sq.ft.' : 'sq.in.' }}
    </div>

    <!-- Island Section -->
    <div style="padding-top:10px;">
      <h2>Island</h2>
      <label>
        <input
          type="checkbox"
          v-model="localValue.hasIsland"
        />
        Island?
      </label>

      <!-- Island dimensions (Feet / Inches) -->
      <div v-if="localValue.hasIsland" class="sub-section island">
        <div class="island-row">
          <label>Length:</label>
          <input
            type="number"
            v-model="islandLengthFeet"
            min="0"
            placeholder="0"
          />
          <span>ft.</span>
          <input
            type="number"
            v-model="islandLengthInches"
            min="0"
            placeholder="0"
          />
          <span>in.</span>
        </div>
        <div class="island-row">
          <label>Width:</label>
          <input
            type="number"
            v-model="islandWidthFeet"
            min="0"
            placeholder="0"
          />
          <span>ft.</span>
          <input
            type="number"
            v-model="islandWidthInches"
            min="0"
            placeholder="0"
          />
          <span>in.</span>
        </div>

        <!-- Display the island area -->
        <div v-if="islandArea !== null" class="island-area">
          <strong>Island Area:</strong>
          {{ islandArea }} {{ isSquareFeet ? 'sq.ft.' : 'sq.in.' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue']);

/**
 * We store:
 *   length, width, islandLength, islandWidth
 * all in inches, internally.
 */
const localValue = reactive({
  length: props.modelValue.length || '',         // total inches
  width: props.modelValue.width || '',           // total inches
  hasIsland: props.modelValue.hasIsland || false,
  islandLength: props.modelValue.islandLength || '',
  islandWidth: props.modelValue.islandWidth || '',
});

// Toggle between sq.in. or sq.ft. displays
const isSquareFeet = ref(false);

/* -------------------------------------------------------------------
   LENGTH (feet + inches)
   ------------------------------------------------------------------- */
const lengthFeet = computed({
  get() {
    const totalInches = parseFloat(localValue.length);
    if (isNaN(totalInches)) return '';
    return Math.floor(totalInches / 12);
  },
  set(value) {
    const feetVal = parseFloat(value);
    if (!isNaN(feetVal)) {
      const inchesVal = parseFloat(lengthInches.value) || 0;
      localValue.length = feetVal * 12 + inchesVal;
    } else {
      localValue.length = '';
    }
  },
});

const lengthInches = computed({
  get() {
    const totalInches = parseFloat(localValue.length);
    if (isNaN(totalInches)) return '';
    return Math.floor(totalInches % 12);
  },
  set(value) {
    const inchesVal = parseFloat(value);
    if (!isNaN(inchesVal)) {
      const feetVal = parseFloat(lengthFeet.value) || 0;
      localValue.length = feetVal * 12 + inchesVal;
    } else {
      localValue.length = '';
    }
  },
});

/* -------------------------------------------------------------------
   WIDTH (feet + inches)
   ------------------------------------------------------------------- */
const widthFeet = computed({
  get() {
    const totalInches = parseFloat(localValue.width);
    if (isNaN(totalInches)) return '';
    return Math.floor(totalInches / 12);
  },
  set(value) {
    const feetVal = parseFloat(value);
    if (!isNaN(feetVal)) {
      const inchesVal = parseFloat(widthInches.value) || 0;
      localValue.width = feetVal * 12 + inchesVal;
    } else {
      localValue.width = '';
    }
  },
});

const widthInches = computed({
  get() {
    const totalInches = parseFloat(localValue.width);
    if (isNaN(totalInches)) return '';
    return Math.floor(totalInches % 12);
  },
  set(value) {
    const inchesVal = parseFloat(value);
    if (!isNaN(inchesVal)) {
      const feetVal = parseFloat(widthFeet.value) || 0;
      localValue.width = feetVal * 12 + inchesVal;
    } else {
      localValue.width = '';
    }
  },
});

/* -------------------------------------------------------------------
   ISLAND (feet + inches) for length + width
   ------------------------------------------------------------------- */
const islandLengthFeet = computed({
  get() {
    const totalInches = parseFloat(localValue.islandLength);
    if (isNaN(totalInches)) return '';
    return Math.floor(totalInches / 12);
  },
  set(value) {
    const feetVal = parseFloat(value);
    if (!isNaN(feetVal)) {
      const inchesVal = parseFloat(islandLengthInches.value) || 0;
      localValue.islandLength = feetVal * 12 + inchesVal;
    } else {
      localValue.islandLength = '';
    }
  },
});

const islandLengthInches = computed({
  get() {
    const totalInches = parseFloat(localValue.islandLength);
    if (isNaN(totalInches)) return '';
    return Math.floor(totalInches % 12);
  },
  set(value) {
    const inchesVal = parseFloat(value);
    if (!isNaN(inchesVal)) {
      const feetVal = parseFloat(islandLengthFeet.value) || 0;
      localValue.islandLength = feetVal * 12 + inchesVal;
    } else {
      localValue.islandLength = '';
    }
  },
});

const islandWidthFeet = computed({
  get() {
    const totalInches = parseFloat(localValue.islandWidth);
    if (isNaN(totalInches)) return '';
    return Math.floor(totalInches / 12);
  },
  set(value) {
    const feetVal = parseFloat(value);
    if (!isNaN(feetVal)) {
      const inchesVal = parseFloat(islandWidthInches.value) || 0;
      localValue.islandWidth = feetVal * 12 + inchesVal;
    } else {
      localValue.islandWidth = '';
    }
  },
});

const islandWidthInches = computed({
  get() {
    const totalInches = parseFloat(localValue.islandWidth);
    if (isNaN(totalInches)) return '';
    return Math.floor(totalInches % 12);
  },
  set(value) {
    const inchesVal = parseFloat(value);
    if (!isNaN(inchesVal)) {
      const feetVal = parseFloat(islandWidthFeet.value) || 0;
      localValue.islandWidth = feetVal * 12 + inchesVal;
    } else {
      localValue.islandWidth = '';
    }
  },
});

/* -------------------------------------------------------------------
   AREA calculations (sq.in. or sq.ft.)
   ------------------------------------------------------------------- */
const kitchenArea = computed(() => {
  const lengthInches = parseFloat(localValue.length);
  const widthInches = parseFloat(localValue.width);

  if (!isNaN(lengthInches) && !isNaN(widthInches)) {
    const areaInInches = lengthInches * widthInches;
    const areaInFeet = areaInInches / 144; // 144 in² = 1 ft²
    return isSquareFeet.value ? areaInFeet.toFixed(2) : areaInInches.toFixed(2);
  }
  return null;
});

const islandArea = computed(() => {
  if (!localValue.hasIsland) return null;

  const lengthInches = parseFloat(localValue.islandLength);
  const widthInches = parseFloat(localValue.islandWidth);

  if (!isNaN(lengthInches) && !isNaN(widthInches)) {
    const areaInInches = lengthInches * widthInches;
    const areaInFeet = areaInInches / 144;
    return isSquareFeet.value ? areaInFeet.toFixed(2) : areaInInches.toFixed(2);
  }
  return null;
});

/* -------------------------------------------------------------------
   Sync changes with parent
   ------------------------------------------------------------------- */
watch(
  () => props.modelValue,
  (newVal) => {
    localValue.length = newVal.length || '';
    localValue.width = newVal.width || '';
    localValue.hasIsland = newVal.hasIsland || false;
    localValue.islandLength = newVal.islandLength || '';
    localValue.islandWidth = newVal.islandWidth || '';
  },
  { deep: true, immediate: true }
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
/* Center the entire container */
.kitchen-size {
  margin: 0 auto;
  max-width: 850px;
  text-align: center;

  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}

/* Flex row for Length */
.length-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.length-row label {
  margin-right: 8px;
}
.length-row input[type='number'] {
  width: 60px;
  margin-right: 5px;
}
.length-row span {
  margin-right: 12px;
}

/* Flex row for Width */
.width-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.width-row label {
  margin-right: 8px;
}
.width-row input[type='number'] {
  width: 60px;
  margin-right: 5px;
}
.width-row span {
  margin-right: 12px;
}

/* Island rows (feet + inches) */
.island-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.island-row label {
  margin-right: 8px;
}
.island-row input[type='number'] {
  width: 60px;
  margin-right: 5px;
}
.island-row span {
  margin-right: 12px;
}

.unit-toggle {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unit-toggle .unit-label {
  font-weight: bold;
  margin: 0 10px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;  
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #2196F3;
}
input:checked + .slider:before {
  transform: translateX(26px);
}

.kitchen-area,
.island-area {
  margin-top: 20px;
}
</style>
