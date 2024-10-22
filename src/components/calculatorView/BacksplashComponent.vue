<!-- BacksplashComponent.vue -->
<template>
  <div class="backsplash">
    <h2>Backsplash</h2>
    <label class="checkbox-label" for="noBacksplash">
      <input
        type="radio"
        id="noBacksplash"
        :value="false"
        v-model="localValue.backsplash"
      />
      No backsplash
    </label>
    <label class="checkbox-label" for="backsplash">
      <input
        type="radio"
        id="backsplash"
        :value="true"
        v-model="localValue.backsplash"
      />
      Backsplash
    </label>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

// Define props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}), 
  },
});

// Define emits
const emit = defineEmits(['update:modelValue']);

// Initialize local state as a ref since it's a Boolean
const localValue = reactive({
  backsplash: props.modelValue.backsplash, // ?? false,
});

// Watch for external changes to modelValue and update localValue
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && 'backsplash' in newVal) {
      localValue.backsplash = newVal.backsplash;
    }
  },
  { deep: true }
);


// Watch for local changes and emit them
watch(
  localValue,
  (newVal) => {
    emit('update:modelValue', { ...newVal });
  },
  { deep: true }
);
</script>

<style scoped>
.backsplash {
  grid-column: 3 / 3;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}

.checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.checkbox-label input {
  margin-right: 8px;
}
</style>
