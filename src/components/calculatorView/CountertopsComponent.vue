<template>
  <div class="countertops">
    <h2>Countertops</h2>
    <div class="countertop-grid">
      <!-- Quartz -->
      <div class="countertop-option">
        <div class="option-title">Quartz</div>
        <div class="image-wrapper">
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
    </div>

    <!-- Waterfall edges -->
    <div class="waterfall-section">
      <div class="waterfall-title">
        <span class="option-title">Waterfall edges</span>
        <input
          type="number"
          v-model="localValue.waterfallEdges"
          min="0"
          class="waterfall-input"
        />
      </div>
      
      <div class="waterfall-content">
        <div class="waterfall-info">
          <p class="waterfall-description">
            A waterfall edge countertop is where the countertop material continues seamlessly down the sides of an island or cabinetry, creating a dramatic, modern statement. This design highlights the beauty of the materials while offering added protection for the corners and sides of the cabinets.
          </p>
        </div>
        <div class="waterfall-image">
          <img
            src="../../assets/countertop_images/waterfall_edge.webp"
            alt="Waterfall countertop"
          />
        </div>
      </div>
    </div>

    <!-- No Countertops -->
    <label class="checkbox-label no-countertops">
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

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { deep: true, immediate: true }
);

watch(
  () => localValue.countertopType,
  (newVal) => {
    if (newVal === 'noCountertop') {
      localValue.waterfallEdges = 0;
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
.countertops {
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: var(--radius);
  background-color: var(--card-background);
  box-shadow: var(--shadow);
  width: 100%;
}

.countertop-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.countertop-option {
  text-align: center;
  background-color: var(--background-color);
  padding: 1rem;
  border-radius: var(--radius);
  transition: var(--transition);
  min-width: 200px;
}

.countertop-option:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.option-title {
  font-weight: 600;
  margin-bottom: 1rem;
}

.image-wrapper {
  position: relative;
  display: inline-block;
  border-radius: calc(var(--radius) - 4px);
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  transition: var(--transition);
}

.option-radio {
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  z-index: 2;
  cursor: pointer;
}

.waterfall-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.waterfall-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.waterfall-title .option-title {
  margin-bottom: 0;
}

.waterfall-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.waterfall-info {
  display: flex;
  align-items: center;
  height: 100%;
}

.waterfall-description {
  color: var(--text-color);
  line-height: 1.8;
  font-size: 17px;
  margin: 0;
}

.waterfall-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 0.95rem;
}

.waterfall-image {
  width: 100%;
  height: 200px;
  border-radius: var(--radius);
  overflow: hidden;
}

.waterfall-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-countertops {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 1024px) {
  .countertop-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .countertop-grid {
    grid-template-columns: 1fr;
  }

  .waterfall-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .waterfall-description {
    font-size: 1rem;
    line-height: 1.6;
  }

  .waterfall-image {
    width: 100%;
  }
}
</style>