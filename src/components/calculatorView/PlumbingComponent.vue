<template>
  <div class="plumbing">
    <h2>Plumbing</h2>
    <label class="checkbox-label">
      <input type="checkbox" v-model="localValue.noPlumbing" />
      No plumbing
    </label>
    <div class="checkbox-group">
      <label v-for="option in plumbingOptions" :key="option.name" class="checkbox-label">
        <input type="checkbox" v-model="localValue[option.name]" :disabled="localValue.noPlumbing" />
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(['update:modelValue']);

const localValue = reactive({
  moveSink: props.modelValue?.moveSink || false,
  moveFridgeWater: props.modelValue?.moveFridgeWater || false,
  installPotFiller: props.modelValue?.installPotFiller || false,
  installFaucet: props.modelValue?.installFaucet || false,
  installDisposal: props.modelValue?.installDisposal || false,
  addGasLine: props.modelValue?.addGasLine || false,
  noPlumbing: props.modelValue.noPlumbing || false,

});

const plumbingOptions = [
  { name: 'moveSink', label: 'Move sink/faucet' },
  { name: 'moveFridgeWater', label: 'Move fridge water' },
  { name: 'installPotFiller', label: 'Install new pot filler' },
  { name: 'installFaucet', label: 'Install faucet' },
  { name: 'installDisposal', label: 'Install disposal' },
  { name: 'addGasLine', label: 'Add/move Nat. Gas Appliance line' },
];

// Watcher to synchronize props with localValue
watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { immediate: true, deep: true }
);

// Watcher to reset other demo options when "No demo" is checked
watch(
  () => localValue.noPlumbing,
  (newVal) => {
    if (newVal) {
      localValue.moveSink = false;
      localValue.moveFridgeWater = false;
      localValue.installPotFiller = false;
      localValue.installFaucet = false;
      localValue.installDisposal = false;
      localValue.addGasLine = false;
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
.plumbing {
  grid-column: 7 / 7;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}
</style>