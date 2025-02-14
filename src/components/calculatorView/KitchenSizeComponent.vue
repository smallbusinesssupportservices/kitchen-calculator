<template>
  <div class="kitchen-size">
    <div class="dimensions-wrapper">
      <!-- Kitchen Dimensions Container -->
      <div class="kitchen-container">
        <h2>Kitchen Dimensions</h2>
        <div class="kitchen-section">
          <div style="height:40px"></div>
          <div class="section-content">
            <div class="inputs-container">
              <!-- Length (Feet / Inches) -->
              <div class="dimension-row">
                <label>Length:</label>
                <div class="input-group">
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
              </div>

              <!-- Width (Feet / Inches) -->
              <div class="dimension-row">
                <label>Width:</label>
                <div class="input-group">
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
              </div>
            </div>

            <!-- Display the kitchen area -->
            <div v-if="kitchenArea !== null" class="area-display">
              <strong>Area:</strong>
              {{ kitchenArea }} {{ isSquareFeet ? 'sq.ft.' : 'sq.in.' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Island Container -->
      <div class="island-container">
        <h2>Island Dimensions</h2>
        <div class="island-section">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="localValue.hasIsland"
            />
            Include Island
          </label>

          <div class="section-content" :class="{ 'disabled': !localValue.hasIsland }">
            <div class="inputs-container">
              <!-- Island Length -->
              <div class="dimension-row">
                <label>Length:</label>
                <div class="input-group">
                  <input
                    type="number"
                    v-model="islandLengthFeet"
                    min="0"
                    placeholder="0"
                    :disabled="!localValue.hasIsland"
                  />
                  <span>ft.</span>
                  <input
                    type="number"
                    v-model="islandLengthInches"
                    min="0"
                    placeholder="0"
                    :disabled="!localValue.hasIsland"
                  />
                  <span>in.</span>
                </div>
              </div>

              <!-- Island Width -->
              <div class="dimension-row">
                <label>Width:</label>
                <div class="input-group">
                  <input
                    type="number"
                    v-model="islandWidthFeet"
                    min="0"
                    placeholder="0"
                    :disabled="!localValue.hasIsland"
                  />
                  <span>ft.</span>
                  <input
                    type="number"
                    v-model="islandWidthInches"
                    min="0"
                    placeholder="0"
                    :disabled="!localValue.hasIsland"
                  />
                  <span>in.</span>
                </div>
              </div>
            </div>

            <!-- Display the island area -->
            <div v-if="islandArea !== null" class="area-display">
              <strong>Area:</strong>
              {{ islandArea }} {{ isSquareFeet ? 'sq.ft.' : 'sq.in.' }}
            </div>
          </div>
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

const localValue = reactive({
  length: props.modelValue.length || '',
  width: props.modelValue.width || '',
  hasIsland: props.modelValue.hasIsland || false,
  islandLength: props.modelValue.islandLength || '',
  islandWidth: props.modelValue.islandWidth || '',
});

const isSquareFeet = ref(true);

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
.kitchen-size {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  width: 100%;
  border: 1px solid var(--border-color);
}

.dimensions-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.kitchen-container,
.island-container {
  padding: 1.5rem;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.kitchen-section,
.island-section {
  margin-top: 1rem;
  padding: 1rem;
  background-color: rgb(248, 250, 252);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.section-content {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1rem;
  align-items: center;
}

.inputs-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dimension-row {
  margin-bottom: 0.5rem;
}

.dimension-row label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-group input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  transition: opacity 0.3s ease, background-color 0.3s ease;
}

.input-group input:disabled {
  opacity: 0.6;
  background-color: var(--border-color);
  cursor: not-allowed;
}

.input-group span {
  min-width: 30px;
}

.area-display {
  padding: 0.75rem;
  background-color: var(--background-color);
  border-radius: var(--radius);
  text-align: center;
  border: 1px solid var(--border-color);
  height: fit-content;
}

.checkbox-label {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.disabled {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .dimensions-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .section-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>