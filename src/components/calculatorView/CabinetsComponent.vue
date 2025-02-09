<template>
  <div class="cabinets">
    <h2>Cabinets</h2>
    <div class="cabinet-container">
      <!-- Cabinet Options Section -->
      <div class="cabinet-section">
        <!-- Main Cabinet Options as Radio Buttons -->
        <label class="radio-label">
          <input type="radio" name="cabinetOptions" value="noCabinets" v-model="localValue.cabinetType" />
          No cabinets
        </label>
        <label class="radio-label">
          <input type="radio" name="cabinetOptions" value="paintStainedCabinets" v-model="localValue.cabinetType"
            :disabled="isOptionDisabled('paintStainedCabinets')" />
          Paint exsisting stained cabinets
        </label>
        <label class="radio-label">
          <input type="radio" name="cabinetOptions" value="paintPaintedCabinets" v-model="localValue.cabinetType"
            :disabled="isOptionDisabled('paintPaintedCabinets')" />
          Repaint existing painted cabinets
        </label>
        <label class="radio-label">
          <input type="radio" name="cabinetOptions" value="standardLineCabinets" v-model="localValue.cabinetType"
            :disabled="isOptionDisabled('standardLineCabinets')" />
          Standard Line Cabinets
        </label>
        <div class="sub-section" v-if="localValue.cabinetType === 'standardLineCabinets'">
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

      <!-- Cabinet Styles Section -->
      <div v-if="localValue.cabinetType === 'standardLineCabinets'" class="cabinet-styles">
        <div class="styles-count">{{ cabinetImages.length }} Cabinet Styles Available</div>
        <Carousel v-if="showStyles" :items-to-show="1" :wrap-around="true" :transition="500">
          <Slide v-for="(image, index) in cabinetImages" :key="index">
            <div class="carousel-slide">
              <div class="option-title">{{ image.title }}</div>
              <div class="image-wrapper">
                <input 
                  type="radio" 
                  :value="image.value" 
                  v-model="localValue.cabinetStyle"
                  name="cabinetStyle"
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
  </div>

  <!-- Image Modal -->
  <div v-if="selectedImage" class="modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="closeModal">&times;</button>
      <img :src="selectedImage.src" :alt="selectedImage.title" />
      <div class="modal-title">{{ selectedImage.title }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, watch } from 'vue';
import { Carousel, Navigation, Slide, Pagination } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue']);

const localValue = reactive({
  cabinetType: props.modelValue.cabinetType || '',
  cabinetStyle: props.modelValue.cabinetStyle || '',
  customColorBase: props.modelValue.customColorBase || false,
  customColorWall: props.modelValue.customColorWall || false,
});

const showStyles = computed(() => localValue.cabinetType === 'standardLineCabinets');

const selectedImage = ref(null);

const cabinetImages = [
  { 
    src: new URL('../../assets/cabinet_images/Columbia_Antique_White.webp', import.meta.url).href, 
    title: 'Columbia Antique White',
    value: 'columbia-antique-white'
  },
  { 
    src: new URL('../../assets/cabinet_images/Edgewater-White.webp', import.meta.url).href, 
    title: 'Edgewater White',
    value: 'edgewater-white'
  },
  { 
    src: new URL('../../assets/cabinet_images/odyssey-sage.webp', import.meta.url).href, 
    title: 'Odyssey Sage',
    value: 'odyssey-sage'
  },
  { 
    src: new URL('../../assets/cabinet_images/oxford-mist_1.webp', import.meta.url).href, 
    title: 'Oxford Mist',
    value: 'oxford-mist'
  },
  { 
    src: new URL('../../assets/cabinet_images/oxford-toffee-door.webp', import.meta.url).href, 
    title: 'Oxford Toffee',
    value: 'oxford-toffee'
  },
  { 
    src: new URL('../../assets/cabinet_images/SC-prime.png', import.meta.url).href, 
    title: 'SC Prime',
    value: 'sc-prime'
  },
  { 
    src: new URL('../../assets/cabinet_images/Shaker_Antique_White.webp', import.meta.url).href, 
    title: 'Shaker Antique White',
    value: 'shaker-antique-white'
  },
  { 
    src: new URL('../../assets/cabinet_images/Shaker_Dove_1.webp', import.meta.url).href, 
    title: 'Shaker Dove',
    value: 'shaker-dove'
  },
  { 
    src: new URL('../../assets/cabinet_images/Shaker_Grey.webp', import.meta.url).href, 
    title: 'Shaker Grey',
    value: 'shaker-grey'
  },
  { 
    src: new URL('../../assets/cabinet_images/Shaker-Black.webp', import.meta.url).href, 
    title: 'Shaker Black',
    value: 'shaker-black'
  },
];

const isSubOptionDisabled = computed(() => localValue.cabinetType === 'noCabinets');

const isOptionDisabled = () => false;

const openImageModal = (image) => {
  selectedImage.value = image;
};

const closeModal = () => {
  selectedImage.value = null;
};

// Watch for changes in cabinet style to ensure it's included in form data
watch(
  () => localValue.cabinetStyle,
  (newStyle) => {
    if (newStyle) {
      const selectedImage = cabinetImages.find(img => img.value === newStyle);
      if (selectedImage) {
        localValue.selectedStyle = {
          style: newStyle,
          title: selectedImage.title,
          imagePath: selectedImage.src
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
.cabinets {
  grid-column: 1 / 1;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}

.cabinet-container {
  display: flex;
  gap: 20px;
  position: relative;
  transition: all 0.5s ease-in-out;
}

.cabinet-section {
  background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  transition: width 0.5s ease-in-out;
}

.cabinet-styles {
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.radio-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.radio-label:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.radio-label input {
  margin-right: 8px;
}

.sub-section {
  margin-left: 20px;
}

.carousel-slide {
  padding: 20px;
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
  margin-bottom: 0.5rem;
  text-align: center;
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
  overflow: hidden;
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
}

:deep(.carousel__prev),
:deep(.carousel__next) {
  background-color: #007bff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: white;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

:deep(.carousel__prev) {
  left: -16px;
}

:deep(.carousel__next) {
  right: -16px;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .cabinet-container {
    flex-direction: column;
  }

  .cabinet-section {
    width: 100% !important;
  }

  .cabinet-styles {
    width: 100% !important;
    max-width: 300px;
  }

  .image-wrapper {
    width: 250px;
    height: 250px;
  }
}
</style>