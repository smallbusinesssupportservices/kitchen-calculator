<template>
  <div class="countertops">
    <h2>Countertops</h2>
    <div class="countertop-container">
      <!-- Countertop Options Section -->
      <div class="countertop-section">
        <label class="radio-label">
          <input type="radio" value="noCountertop" v-model="localValue.countertopType" />
          No countertops
        </label>
        <label class="radio-label">
          <input type="radio" value="Granite" v-model="localValue.countertopType" />
          Granite
        </label>
        <label class="radio-label">
          <input type="radio" value="Quartz" v-model="localValue.countertopType" />
          Quartz
        </label>
        <label class="radio-label">
          <input type="radio" value="Butcher Block" v-model="localValue.countertopType" />
          Butcher Block
        </label>
      </div>

      <!-- Countertop Styles Section -->
      <div v-if="localValue.countertopType && localValue.countertopType !== 'noCountertop'" class="countertop-styles">
        <div class="styles-count">{{ currentCountertopImages.length }} Styles Available</div>
        <Carousel :items-to-show="1" :wrap-around="true" :transition="500">
          <Slide v-for="image in currentCountertopImages" :key="image.value">
            <div class="carousel-slide">
              <div class="option-title">{{ image.title }}</div>
              <div class="image-wrapper">
                <input 
                  type="radio" 
                  :value="image.value" 
                  v-model="localValue.countertopStyle"
                  name="countertopStyle"
                  class="option-radio"
                />
                <img 
                  :src="image.src" 
                  :alt="image.title" 
                  @click="openImageModal(image)"
                />
              </div>
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
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
            A waterfall edge countertop is where the countertop material
            continues seamlessly down the sides of an island or cabinetry,
            creating a dramatic, modern statement. This design highlights the
            beauty of the materials while offering added protection for the
            corners and sides of the cabinets.
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

    <!-- Image Modal -->
    <div v-if="selectedImage" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">&times;</button>
        <img :src="selectedImage.src" :alt="selectedImage.title" />
        <div class="modal-title">{{ selectedImage.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, watch } from 'vue';
import { Carousel, Navigation, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import { getCountertopImages } from '../../data/images';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue']);

const localValue = reactive({
  countertopType: props.modelValue.countertopType || '',
  countertopStyle: props.modelValue.countertopStyle || '',
  waterfallEdges: props.modelValue.waterfallEdges || 0,
});

const selectedImage = ref(null);

const currentCountertopImages = computed(() => {
  return getCountertopImages(localValue.countertopType);
});

const openImageModal = (image) => {
  selectedImage.value = image;
};

const closeModal = () => {
  selectedImage.value = null;
};

// Watch for changes in countertop style to ensure it's included in form data
watch(
  () => localValue.countertopStyle,
  (newStyle) => {
    if (newStyle) {
      const selectedImage = currentCountertopImages.value.find(img => img.value === newStyle);
      if (selectedImage) {
        // Get file extension from the original path
        const extension = selectedImage.src.toLowerCase().endsWith('.png') ? 'png' : 'webp';
        localValue.selectedStyle = {
          style: newStyle,
          title: selectedImage.title,
          // Store only the relative path with correct extension
          imagePath: `countertop_images/${newStyle}.${extension}`
        };
      }
    } else {
      localValue.selectedStyle = null;
    }
    emit('update:modelValue', { ...localValue });
  }
);

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
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
.countertops {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  width: 100%;
  border: 1px solid var(--border-color);
}

.countertop-container {
  display: flex;
  gap: 2rem;
  position: relative;
  transition: all 0.5s ease-in-out;
}

.countertop-section {
  background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.countertop-styles {
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.radio-label {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.radio-label:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.carousel-slide {
  padding: 0.25rem;
  text-align: center;
}

.image-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
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

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.image-wrapper:hover img {
  transform: scale(1.05);
}

.option-title {
  font-weight: 600;
  margin-bottom: 1rem;
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

.waterfall-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.waterfall-info {
  display: flex;
  align-items: center;
}

.waterfall-description {
  line-height: 1.6;
  color: var(--text-color);
}

.waterfall-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
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

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  max-width: 90%;
  max-height: 90vh;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.modal-content img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

.modal-title {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

/* Carousel Styles */
:deep(.carousel__slide) {
  padding: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

:deep(.carousel__viewport) {
  display: flex;
  align-items: center;
}

:deep(.carousel__track) {
  display: flex;
  align-items: center;
}

:deep(.carousel__prev),
:deep(.carousel__next) {
  background-color: var(--primary-color);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: white;
  border: none;
  cursor: pointer;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  background-color: var(--primary-hover);
}

@media (max-width: 1024px) {
  .countertop-container {
    flex-direction: column;
  }

  .countertop-section,
  .countertop-styles {
    width: 100%;
  }

  .image-wrapper {
    width: 250px;
    height: 250px;
  }

  .waterfall-content {
    grid-template-columns: 1fr;
  }
}
</style>