<template>
  <div class="new-sink">
    <h2>New Sink</h2>
    <label class="checkbox-label" >
      <input type="radio" value="false" v-model="localValue.sinkType" />
      No sink
    </label>
    <label class="checkbox-label" >
      <input type="radio" value="Standard" v-model="localValue.sinkType" @change="onSinkChange"/>
      Standard Sink
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

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(['update:modelValue']);

const localValue = reactive({
  sinkType: props.modelValue?.sinkType || '',
});

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(localValue, newVal);
  },
  { immediate: true }
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
.new-sink {
  grid-column: 5 / 5;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  
}

</style>
