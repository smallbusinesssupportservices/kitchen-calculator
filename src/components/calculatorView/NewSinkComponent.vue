<template>
  <div class="new-sink">
    <h2>New Sink</h2>
    <label class="checkbox-label" >
      <input type="radio" value="false" v-model="localValue.sinkType" />
      No sink
    </label>
    <label class="checkbox-label" >
      <input type="radio" value="Standard" v-model="localValue.sinkType" @change="onSinkChange"/>
      Standard Sink - choice of single basin, 50/50, or 60/40
    </label>
    <label class="checkbox-label" >
      <input type="radio" value="Workstation" v-model="localValue.sinkType" @change="onSinkChange"/>
      Workstation Sink
    </label>
    <label class="checkbox-label" >
      <input type="radio" value="Farmhouse" v-model="localValue.sinkType"@change="onSinkChange" />
      Farmhouse Sink
    </label>
    <label class="checkbox-label" >
      <input type="radio" value="Custom Finish" v-model="localValue.sinkType" @change="onSinkChange"/>
      Custom finish sink
    </label>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';

const selectedSinkType = ref('');

// Emit the selection status when a sink is chosen
const onSinkChange = () => {
  const isSinkSelected =
    selectedSinkType.value === 'standard' ||
    selectedSinkType.value === 'workstation' ||
    selectedSinkType.value === 'farmhouse' ||
    selectedSinkType.value === 'customFinish'
  
  // Emit the event to the parent
  emit('sink-selected', isSinkSelected)
}

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(['update:modelValue', 'sink-selected']);

const localValue = reactive({
  sinkType: props.modelValue?.sinkType || '',
});

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.sinkType = newVal?.sinkType || '';
  },
  { immediate: true }
);

watch(selectedSinkType, (newValue) => {
  if (['standard', 'workstation', 'farmhouse', 'customFinish'].includes(newValue)) {
    emit('update:modelValue', { ...localValue, removeSink: true })  // Check removeSink
  } else {
    emit('update:modelValue', { ...localValue, removeSink: false })  // Uncheck removeSink
  }
})

watch(
    localValue,
    () => {
      emit('update:modelValue', { ...localValue });
    },
    { deep: true }
  );
</script>

<style scoped>
.new-sink {
  grid-column: 7 / 7;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}

</style>
