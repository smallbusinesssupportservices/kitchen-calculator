<template>
  <div class="countertops">
    <h2>Countertops</h2>

    <!-- Quartz -->
    <div class="countertop-option">
      <div class="option-title">Quartz</div>
      <div class="image-wrapper">
        <!-- Radio button: absolutely positioned on left, centered vertically -->
        <input
          type="radio"
          value="Quartz"
          v-model="localValue.countertopType"
          class="option-radio"
        />
        <img
          src="../../assets/countertop_images/calacatta-laza-stonemark-quartz-countertops-p-qsl-calalaza-4x4-64_300.avif"
          alt="Quartz countertop"
        />
      </div>
    </div>

    <!-- Granite -->
    <div class="countertop-option">
      <div class="option-title">Granite</div>
      <div class="image-wrapper">
        <input
          type="radio"
          value="Granite"
          v-model="localValue.countertopType"
          class="option-radio"
        />
        <img
          src="../../assets/countertop_images/white-antico-stonemark-granite-countertops-dt-g062-64_300.avif"
          alt="Granite countertop"
        />
      </div>
    </div>

    <!-- Solid-Surface -->
    <div class="countertop-option">
      <div class="option-title">Solid-Surface</div>
      <div class="image-wrapper">
        <input
          type="radio"
          value="Solid-Surface"
          v-model="localValue.countertopType"
          class="option-radio"
        />
        <img
          src="../../assets/countertop_images/cosmos-hi-macs-solid-surface-countertops-lg-t002-hm-64_300.avif"
          alt="Solid-Surface countertop"
        />
      </div>
    </div>

    <!-- Butcher Block -->
    <div class="countertop-option">
      <div class="option-title">Butcher Block</div>
      <div class="image-wrapper">
        <input
          type="radio"
          value="Butcher Block"
          v-model="localValue.countertopType"
          class="option-radio"
        />
        <img
          src="../../assets/countertop_images/unfinished-hampton-bay-butcher-block-countertops-tp-10ft-64_300.avif"
          alt="Butcher Block countertop"
        />
      </div>
    </div>

    <!-- Waterfall edges -->
    <div class="countertop-option">
      <div class="option-title">Waterfall edges</div>
      <!-- Input for Waterfall edges -->
      <div class="option-waterfall">
        <input
          type="number"
          v-model="localValue.waterfallEdges"
          min="0"
          class="waterfall-input"
        />
      </div>
      <!-- Image, if desired -->
      <div class="image-wrapper">
        <img
          src="../../assets/countertop_images/kitchen-waterfall-corner-close-web-1018x1024.jpg"
          alt="Waterfall countertop"
          style="width:300px;height:300px;"
        />
      </div>
    </div>

    <!-- No Countertops -->
    <label class="checkbox-label">
      <input type="radio" value="noCountertop" v-model="localValue.countertopType" />
      No countertops
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
  countertopType: props.modelValue.countertopType || '',
  waterfallEdges: props.modelValue.waterfallEdges || 0,
});

// Watch for changes in props and update localValue
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { deep: true, immediate: true }
);

// Reset waterfall edges if "No countertops" is chosen
watch(
  () => localValue.countertopType,
  (newVal) => {
    if (newVal === 'noCountertop') {
      localValue.waterfallEdges = 0;
    }
  }
);

// Emit updated values to the parent
watch(
  localValue,
  () => {
    emit('update:modelValue', { ...localValue });
  },
  { deep: true }
);
</script>

<style scoped>
.countertops {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  /* If you want them side-by-side, uncomment:
     display: flex;
     flex-wrap: wrap;
     gap: 20px; 
  */
}

/* Each individual option box */
.countertop-option {
  margin-bottom: 20px;
  text-align: center; /* So the title is centered above the image */
}

/* The text (countertop name) above the image */
.option-title {
  font-weight: bold;
  margin-bottom: 8px;
}

/* Container that holds the image and the (absolute) radio button */
.image-wrapper {
  position: relative;
  display: inline-block; /* For correct absolute positioning */
}

/* The radio button: left side, centered vertically */
.option-radio {
  position: absolute;
  left: -30px; /* Move further left if needed */
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

/* Sizing for images */
.image-wrapper img {
  width: 200px;  /* Adjust as needed */
  height: auto;
  display: block; /* Remove extra bottom space in inline-block context */
}

/* Waterfall edges container */
.option-waterfall {
  margin-bottom: 8px; /* space between input and image below */
}

/* Waterfall input styling */
.waterfall-input {
  width: 40px;
  text-align: center;
}
</style>
