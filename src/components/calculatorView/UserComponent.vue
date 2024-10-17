<!-- UserForm.vue -->
<template>
    <div class="user-form">
      <h2>Contact info</h2>
      <!-- Contact Info Fields -->
      <div class="contact-info">
        <label for="name">Name:</label>
        <input
        required
          v-model="localValue.name"
          type="text"
          id="name"
          placeholder="First Last"
        />
  
        <label for="phone">Phone:</label>
        <input
        required
          v-model="localValue.phone"
          type="text"
          id="phone"
          placeholder="Phone number"
        />
  
        <label for="email">Email:</label>
        <input
        required
          v-model="localValue.email"
          type="email"
          id="email"
          placeholder="Email"
        />
        <label for="address">Address:</label>
        <input
          v-model="localValue.address"
          type="text"
          id="address"
          placeholder="Street Address"
        />
  
        <label for="city">City:</label>
        <input
          v-model="localValue.city"
          type="text"
          id="city"
          placeholder="City"
        />
        <label for="state">State:</label>
        <input
          v-model="localValue.state"
          type="text"
          id="state"
          placeholder="State"
        />
  
        <label for="zip">Zip Code:</label>
        <input
          v-model="localValue.zip"
          type="text"
          id="zip"
          placeholder="Zip Code"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch } from 'vue';
  
  // Define props with v-model compatibility
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        phone: '',
        email: '',
      }),
    },
  });
  
  // Define emits
  const emit = defineEmits(['update:modelValue']);
  
  // Initialize localValue based on props without modifying props directly
  const localValue = reactive({
    id: props.modelValue.id || '',
    name: props.modelValue.name || '',
    phone: props.modelValue.phone || '',
    email: props.modelValue.email || '',
  });
  
  // Watch for changes in props.modelValue and update localValue accordingly
  watch(
    () => props.modelValue,
    (newVal) => {
      localValue.id = newVal.id || '';
      localValue.name = newVal.name || '';
      localValue.phone = newVal.phone || '';
      localValue.email = newVal.email || '';
    },
    { immediate: true, deep: true }
  );
  
  // Watch for changes in localValue and emit updates to the parent
  watch(
    localValue,
    () => {
      console.log("userComponent: ", localValue)
      emit('update:modelValue', { ...localValue });
    },
    { deep: true }
  );
  </script>
  
  <style scoped>
  .user-form {
    grid-column: 6 / 6;
    grid-row: 2 / 2;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
  }
  
  .contact-info {
    display: flex;
    flex-direction: column;
  }
  
  .contact-info label {
    margin-top: 10px;
    margin-bottom: 5px;
  }
  
  .contact-info input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>
  