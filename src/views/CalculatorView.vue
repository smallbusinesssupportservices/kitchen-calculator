<template>
    <h1> Kitchen Calculator </h1>  
  
    <div class="form-container">
  
      <form @submit.prevent="handleSubmit">
        <KitchenSize v-model="formData.kitchenSize" />

        <Demo v-model="formData.demo" />
        <Backsplash v-model="formData.backsplash" />

        <Plumbing v-model="formData.plumbing" />
        <Electrical v-model="formData.electrical" />

        <Cabinets v-model="formData.cabinets" />
        <Countertops v-model="formData.countertops" />
        <NewSink v-model="formData.newSink" />

        <ExhaustHoodDucting v-model="formData.exhaustHoodDucting" />
        <NewAppliances v-model="formData.newAppliances" />
        <Installation v-model="formData.installation" />

        <Flooring v-model="formData.flooring" />
        <InteriorPainting v-model="formData.interiorPainting" />
        <FinalCleaning v-model="formData.finalCleaning" />
        <ProgressButton
          :progress="progress"
          :disabled="isDisabled"
          :loading="isLoading"
          buttonText="Calculate"
          @click="handleSubmit"
        />
      </form>
    </div>
    <!-- <div v-else>
      <ServerResponse :response="serverResponse" />
    </div> -->
  </template>
  
  <script setup>
  import axios from 'axios';
  import { reactive, ref, computed } from 'vue';
  import KitchenSize from '../components/calculatorView/KitchenSizeComponent.vue';
  import Demo from '../components/calculatorView/DemoComponent.vue';
  import Plumbing from '../components/calculatorView/PlumbingComponent.vue';
  import Electrical from '../components/calculatorView/ElectricalComponent.vue';
  import Cabinets from '../components/calculatorView/CabinetsComponent.vue';
  import Countertops from '../components/calculatorView/CountertopsComponent.vue';
  import NewSink from '../components/calculatorView/NewSinkComponent.vue';
  import ExhaustHoodDucting from '../components/calculatorView/ExhaustHoodDuctingComponent.vue';
  import NewAppliances from '../components/calculatorView/NewAppliancesComponent.vue';
  import Installation from '../components/calculatorView/InstallationComponent.vue';
  import Backsplash from '../components/calculatorView/BacksplashComponent.vue';
  import Flooring from '../components/calculatorView/FlooringComponent.vue';
  import InteriorPainting from '../components/calculatorView/InteriorPaintingComponent.vue';
  import FinalCleaning from '../components/calculatorView/FinalCleaningComponent.vue';
  // import ServerResponse from '../components/calculatorView/ServerResponseComponent.vue';
  import ProgressButton from '../components/calculatorView/ProgressButtonComponent.vue';
  
  const hasServerResponded = ref(false); // Track if the server has responded
  const serverResponse = ref(null); // Store server response
  const formData = reactive({
    kitchenSize: {},
    // island: {},
    demo: {},
    plumbing: {},
    electrical: {},
    drywall: {},
    cabinets: {},
    countertops: {},
    newSink: {},
    newFixtures: {},
    exhaustHoodDucting: {},
    newAppliances: {},
    installation: {},
    backsplash: {},
    flooring: {},
    interiorPainting: {},
    finalCleaning: {},
  });
  
  
  
  // Define required fields for progress calculation
  
  const requiredFields = ref([
    'kitchenSize',
    // 'island',
    'demo',
    'plumbing',
    'electrical',
    // 'drywall',
    'cabinets',
    'countertops',
    'newSink',
    // 'newFixtures',
    'exhaustHoodDucting',
    'newAppliances',
    'installation',
    'backsplash',
    'flooring',
    'interiorPainting',
    'finalCleaning',
  ]);
  
  // Compute progress based on filled required fields
  const progress = computed(() => {
    const filled = requiredFields.value.reduce((count, field) => {
      // Check if the field has any non-empty value
      const fieldData = formData[field];
      if (typeof fieldData === 'object') {
        // If fieldData is an object, check if any of its properties are filled
  
      return Object.values(fieldData).some(value => {
          if (typeof value === 'string') {
            return value.trim() !== '';
          }
          return Boolean(value);
        }) ? count + 1 : count;
      } else if (typeof fieldData === 'string') {
  
        return fieldData.trim() !== '' ? count + 1 : count;
  
      }
  
      return Boolean(fieldData) ? count + 1 : count;
  
    }, 0);
  
    return Math.round((filled / requiredFields.value.length) * 100);
  
  });
  
  const isDisabled = computed(() => progress.value < 100);
  const isLoading = ref(false);
  const isSubmitted = ref(false);
  
  const handleSubmit = async () => {
    let allFilled = true;
    requiredFields.value.forEach(field => {
      const fieldData = formData[field];
      if (typeof fieldData === 'object') {
        // If fieldData is an object, ensure at least one property is filled
        const isFilled = Object.values(fieldData).some(value => {
          if (typeof value === 'string') {
            return value.trim() !== '';
          }
          return Boolean(value);
        });
        if (!isFilled) {
          allFilled = false;
          // add visual feedback here ?
        }
  
      } else if (typeof fieldData === 'string') {
        if (fieldData.trim() === '') {
          allFilled = false;
          // Optionally, you can add visual feedback here
        }
  
      } else {
        if (!fieldData) {
          allFilled = false;
          // Optionally, you can add visual feedback here
        }
      }
    });
  
    if (!allFilled) {
      alert('Please fill in all required fields.');
      return;
    }
    isLoading.value = true;
    isSubmitted.value = false;
  
    try {
  
      const response = await axios.post('http://localhost:3000/submit-form', formData);
  
      if (response.status === 200) {
        serverResponse.value = response.data; // Store server response
        serverResponse.high = response.data.estimate.highRange;
        serverResponse.low = response.data.estimate.lowRange
        hasServerResponded.value = true; // Switch content when server responds 
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style>
  
  
  body {
    font-family: Arial, sans-serif;
    margin: 20px;
  }
  
  form {
    /*display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: auto; */
    gap: 1px;
    padding: 1px;
  }
  
  .button-container {
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
  }
  
  .success-message {
    margin-top: 15px;
    color: #28a745;
    text-align: center;
  }
  </style>