<template>
  <div class="cabinets">
    <h2>Cabinets</h2>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.noCabinets" />
      No cabinets
    </label>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.paintStainedCabinets" :disabled="localValue.noCabinets" />
      Painting existing, currently stained cabinets
    </label>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.paintPaintedCabinets" :disabled="localValue.noCabinets" />
      Painting existing, currently painted cabinets
    </label>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.standardLineCabinets"
        :disabled="localValue.noCabinets || localValue.fullCustomCabinets" />
      Standard Line Cabinets
    </label>
    <div class="sub-section" v-if="localValue.standardLineCabinets">
      <label class="checkbox-label">
        <input type="checkbox" v-model="localValue.customColorBase" :disabled="localValue.noCabinets" />
        Custom Color for standard line Shaker base cabinets
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="localValue.customColorWall" :disabled="localValue.noCabinets" />
        Custom Color for standard line Shaker wall cabinets
      </label>
    </div>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.fullCustomCabinets"
        :disabled="localValue.noCabinets || localValue.standardLineCabinets" />
      Full custom cabinets
    </label>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:modelValue']);

const localValue = reactive({
  paintStainedCabinets: props.modelValue.paintStainedCabinets || false,
  paintPaintedCabinets: props.modelValue.paintPaintedCabinets || false,
  standardLineCabinets: props.modelValue.standardLineCabinets || false,
  customColorBase: props.modelValue.customColorBase || false,
  customColorWall: props.modelValue.customColorWall || false,
  fullCustomCabinets: props.modelValue.fullCustomCabinets || false,
  noCabinets: props.modelValue.noCabinets || false,
});

const cabinetOptions = [
  { name: 'addCanLights', label: 'Add can lights' },
  { name: 'addUnderCabinetLights', label: 'Add undercabinet lights' },
  { name: 'switchesAndOutlets', label: 'Add/move outlets/switches' },
  { name: 'applianceOutlets', label: 'Add/move appliance outlets' },
];

// Watcher to synchronize props with localValue
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { immediate: true, deep: true }
);

  // Watcher to reset other cabinet options when "No cabinet" is checked
  watch(
  () => localValue.noCabinets,
  (newVal) => {
    if (newVal) {
      localValue.paintStainedCabinets = false;
      localValue.paintPaintedCabinets = false;
      localValue.standardLineCabinets = false;
      localValue.customColorBase = false;
      localValue.customColorWall = false;
      localValue.fullCustomCabinets = false;
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
  grid-column: 5 / 5;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}

</style>