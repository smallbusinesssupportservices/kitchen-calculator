<template>
  <div class="cleaning">
    <h2>Final Cleaning</h2>
    <label class="checkbox-label">
      <input type="radio" v-model="localValue.cleaningOption" value="none" />
      No cleaning
    </label>
    <label class="checkbox-label">
      <input type="radio" v-model="localValue.cleaningOption" value="kitchen" />
      Clean the kitchen
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
  cleaningOption: props.modelValue?.cleaningOption || 'none', // Can be 'none' or 'kitchen'
});

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { deep: true, immediate: true }
);

// Watcher to emit changes back to the parent
watch(
  localValue,
  () => {
    emit('update:modelValue', { ...localValue });
  },
  { deep: true }
);
</script>

<style scoped>
.cleaning {
  grid-column: 5 / 5;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}
.radio-label {
  display: block;
  margin-bottom: 10px;
}
</style>

<!-- <template>
  <div class="cleaning">
    <h2>Final Cleaning</h2>
    <label class="checkbox-label" >
      <input type="checkbox" v-model="localValue.noCleaning" />
      No cleaning
    </label>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.cleanKitchen" :disabled="localValue.noCleaning"/>
      Clean the kitchen
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
  cleanKitchen: props.modelValue?.cleanKitchen || false,
  noCleaning: props.modelValue.noCleaning || false
});

watch(
    () => props.modelValue,
    (newVal) => {
      Object.assign(localValue, newVal);
    },
    { deep: true, immediate: true }
  );

  // Watcher to reset cleaning options when "No cleaning" is checked
watch(
  () => localValue.noCleaning,
  (newVal) => {
    if (newVal) {
      localValue.cleanKitchen = false;
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
.cleaning{
  grid-column: 5 / 5;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}
</style> -->
