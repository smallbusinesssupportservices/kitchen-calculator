
<template>
  <div class="countertops">
    <h2>Countertops</h2>
    <label class="checkbox-label">
      <input type="radio" value="noCountertop" v-model="localValue.countertopType" />
      No countertops
    </label>
    <label class="checkbox-label">
      <input type="radio" value="Quartz" v-model="localValue.countertopType" />
      Quartz
    </label>
    <label class="checkbox-label">
      <input type="radio" value="Granite" v-model="localValue.countertopType" />
      Granite
    </label>
    <label class="checkbox-label">
      <input type="radio" value="Solid-Surface" v-model="localValue.countertopType" />
      Solid-Surface
    </label>
    <label class="checkbox-label">
      <input type="radio" value="Butcher Block" v-model="localValue.countertopType" />
      Butcher Block
    </label>
    <label>
      Waterfall edges:
      <input type="number" v-model="localValue.waterfallEdges" min="0" class="waterfall-input"/>
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


 // Watcher to reset other countertops options when "No countertops" is checked
 watch(
  () => localValue.countertopType,
  (newVal) => {
    if (newVal == 'noCountertop') {
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
  grid-column: 4 / 4;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  
}

.waterfall-input {
  width: 25px; 
  margin-left: 10px;
}
</style>