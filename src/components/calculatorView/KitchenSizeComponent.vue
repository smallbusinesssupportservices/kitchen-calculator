<template>
  <div class="kitchen-size">
    <h2>Kitchen Size</h2>
    <!-- <h3>

      <div class="unit-toggle">
        <span class="unit-label">in.</span>
        <label class="toggle-switch">
          <input type="checkbox" v-model="isSquareFeet" />
          <span class="slider"></span>
        </label>
        <span class="unit-label">ft.</span>
      </div>
    </h3> -->

    <!-- Length Input -->
    <label>
      Length:
      <br />
      <input type="float" v-model="displayedLength" required min="0" />
    </label>

    <!-- Width Input -->
    <label>
      Width:
      <br />
      <input type="float" v-model="displayedWidth" required min="0" />
    </label>

    <!-- Display the kitchen area -->
    <div v-if="kitchenArea !== null" class="kitchen-area">
      <strong>Area:</strong>
      {{ kitchenArea }} {{ isSquareFeet ? 'sq.ft.' : 'sq.in.' }}
    </div>

    <!-- Island Section -->
    <div style="padding-top:10px;">
      <h2>Island</h2>
      <label>
        <input type="checkbox" v-model="localValue.hasIsland" />
        Island?
      </label>
      <div v-if="localValue.hasIsland" class="sub-section island">
        <!-- Island Length Input -->
        <label>
          Length:
          <br />
          <input type="number" v-model="displayedIslandLength" min="0" />
        </label>

        <!-- Island Width Input -->
        <label>
          Width:
          <br />
          <input type="number" v-model="displayedIslandWidth" min="0" />
        </label>

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

const localValue = reactive({
  length: props.modelValue.length || '',
  width: props.modelValue.width || '',
  hasIsland: props.modelValue.hasIsland || false,
  islandLength: props.modelValue.islandLength || '',
  islandWidth: props.modelValue.islandWidth || '',
});

// Reactive variable for unit selection
const isSquareFeet = ref(false); // default to square inches (toggle off)

// Computed properties for input fields
const displayedLength = computed({
  get() {
    return isSquareFeet.value && localValue.length
      ? (localValue.length / 12).toFixed(2)
      : localValue.length;
  },
  set(value) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      localValue.length = isSquareFeet.value ? num * 12 : num;
    } else {
      localValue.length = '';
    }
  },
});

const displayedWidth = computed({
  get() {
    return isSquareFeet.value && localValue.width
      ? (localValue.width / 12).toFixed(2)
      : localValue.width;
  },
  set(value) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      localValue.width = isSquareFeet.value ? num * 12 : num;
    } else {
      localValue.width = '';
    }
  },
});

const displayedIslandLength = computed({
  get() {
    return isSquareFeet.value && localValue.islandLength
      ? (localValue.islandLength / 12).toFixed(2)
      : localValue.islandLength;
  },
  set(value) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      localValue.islandLength = isSquareFeet.value ? num * 12 : num;
    } else {
      localValue.islandLength = '';
    }
  },
});

const displayedIslandWidth = computed({
  get() {
    return isSquareFeet.value && localValue.islandWidth
      ? (localValue.islandWidth / 12).toFixed(2)
      : localValue.islandWidth;
  },
  set(value) {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      localValue.islandWidth = isSquareFeet.value ? num * 12 : num;
    } else {
      localValue.islandWidth = '';
    }
  },
});

// Compute the area of the kitchen
const kitchenArea = computed(() => {
  const length = parseFloat(localValue.length);
  const width = parseFloat(localValue.width);
  if (!isNaN(length) && !isNaN(width)) {
    const areaInInches = length * width;
    const areaInFeet = areaInInches / 144;
    return isSquareFeet.value ? areaInFeet.toFixed(2) : areaInInches.toFixed(2);
  }
  return null;
});

// Compute the area of the island
const islandArea = computed(() => {
  if (localValue.hasIsland) {
    const length = parseFloat(localValue.islandLength);
    const width = parseFloat(localValue.islandWidth);
    if (!isNaN(length) && !isNaN(width)) {
      const areaInInches = length * width;
      const areaInFeet = areaInInches / 144;
      return isSquareFeet.value ? areaInFeet.toFixed(2) : areaInInches.toFixed(2);
    }
  }
  return null;
});

// Watch for changes in props and update localValue
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

// Emit updates when localValue changes
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
.kitchen-size {
  grid-column: 1 / 1;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  width: 200px;
}

label {
  display: block;
  margin-bottom: 15px;
}

label input[type='number'] {
  display: block;
  margin-top: 5px;
  width: 195px;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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

input:checked+.slider {
  background-color: #2196F3;
}

input:checked+.slider:before {
  transform: translateX(26px);
}

.kitchen-area,
.island-area {
  margin-top: 20px;
}
</style>
