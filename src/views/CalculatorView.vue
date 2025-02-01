<template>
  <h1>Kitchen Calculator</h1>
  <div v-if="!hasServerResponded">
    <form @submit.prevent="handleSubmit">
      <KitchenSize v-model="formData.kitchenSize" />
      <Cabinets v-model="formData.cabinets" />
      <Countertops v-model="formData.countertops" />
      <NewSink v-model="formData.newSink" />
      <Backsplash v-model="formData.backsplash" />
      <Plumbing v-model="formData.plumbing" />
      <Electrical v-model="formData.electrical" />
      <NewAppliances v-model="formData.newAppliances" />
      <InteriorPainting v-model="formData.interiorPainting" />
      <Flooring v-model="formData.flooring" />
      <Demo
        v-model="formData.demo"
        :demoSink="formData.newSink.sinkType"
        :demoCountertops="formData.countertops.countertopType"
        :demoBacksplash="formData.backsplash.backsplash"
        :demoCabinets="formData.cabinets.cabinetType"
        :demoFlooring="formData.flooring.flooringType"
      />
      <FinalCleaning v-model="formData.finalCleaning" />
      <UserForm v-model="formData.user" />
      <ProgressButton
        :progress="progress"
        :disabled="isDisabled"
        :loading="isLoading"
        @click="handleSubmit"
      />
    </form>
  </div>
  <div v-else>
    <ServerResponse :response="serverResponse" />
  </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, computed, onMounted, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
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
import ServerResponse from '../components/calculatorView/ServerResponseComponent.vue';
import ProgressButton from '../components/calculatorView/ProgressButtonComponent.vue';
import UserForm from '../components/calculatorView/UserComponent.vue';

// Generate or retrieve userId on component mount
onMounted(() => {
  let storedUserId = localStorage.getItem('atlhm');
  if (!storedUserId) {
    storedUserId = uuidv4();
    localStorage.setItem('atlhm', storedUserId);
  }
  formData.user = { id: storedUserId };
});

// Temporarily set hasServerResponded and serverResponse for testing purposes
onMounted(() => {
  let storedUserId = localStorage.getItem('atlhm');
  if (!storedUserId) {
    storedUserId = uuidv4();
    localStorage.setItem('atlhm', storedUserId);
  }

  formData.user = { id: storedUserId };

  // Mock server response for testing
  // hasServerResponded.value = true;
  // serverResponse.value = {
  //   estimate: {
  //     highRange: 15000,
  //     lowRange: 12000
  //   },
  //   message: "Here is the estimated cost for your kitchen renovation."
  // };
});

const hasServerResponded = ref(false);
const serverResponse = ref(null);
const formData = reactive({
  kitchenSize: {},
  demo: {},
  dumpster: {},
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
  user: {},
});

// Configuration for excluded subfields
const excludedSubFields = {
  user: ['id'],
};

// Define required fields for progress calculation
const requiredFields = ref([
  'kitchenSize',
  // 'exhaustHoodDucting',
  'electrical',
  'newAppliances',
  // 'installation',
  'interiorPainting',
  'finalCleaning',
  'plumbing',
  'newSink',
  'countertops',
  'cabinets',
  'backsplash',
  'flooring',
  'user',
  // 'demo',
]);

// Compute progress based on filled required fields, excluding specified subfields
const progress = computed(() => {
  const filled = requiredFields.value.reduce((count, field) => {
    const fieldData = formData[field];
    if (typeof fieldData === 'object' && fieldData !== null) {
      // Determine which subfields to exclude for the current field
      const exclusions = excludedSubFields[field] || [];

      // Extract values, excluding the specified subfields
      const values = Object.entries(fieldData)
        .filter(([key]) => !exclusions.includes(key))
        .map(([, value]) => value);

      // Check if any of the remaining subfield values are filled
      const isFilled = values.some((value) => {
        if (typeof value === 'string') {
          return value.trim() !== '';
        } else if (typeof value === 'boolean') {
          return true; // Consider boolean fields as filled regardless of true/false
        }
        return Boolean(value);
      });

      return isFilled ? count + 1 : count;
    } else if (typeof fieldData === 'string') {
      // If the field data is a string, check if it's not empty after trimming
      return fieldData.trim() !== '' ? count + 1 : count;
    }

    // For other data types, use a boolean check
    return Boolean(fieldData) ? count + 1 : count;
  }, 0);

  return Math.round((filled / requiredFields.value.length) * 100);
});

const isDisabled = computed(() => progress.value < 100); // **Enabled based on progress**
const isLoading = ref(false);
const isSubmitted = ref(false);

const handleSubmit = async () => {
  let allFilled = true;
  requiredFields.value.forEach((field) => {
    const fieldData = formData[field];
    if (typeof fieldData === 'object') {
      // If fieldData is an object, ensure at least one property is filled
      const isFilled = Object.values(fieldData).some((value) => {
        if (typeof value === 'string') {
          return value.trim() !== '';
        } else if (typeof value === 'boolean') {
          return true;
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
    const response = await axios.post(
      'http://localhost:3000/submit-form',
      formData
    );

    if (response.status === 200) {
      console.log(response.data.estimate);
      serverResponse.value = response.data; // Store server response
      serverResponse.value.high = response.data.estimate.highRange;
      serverResponse.value.low = response.data.estimate.lowRange;
      hasServerResponded.value = true; // Switch content when server responds
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('There was an error submitting the form. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

// watcher to see if any demo requires a dumpster
watch(
  () => formData.demo,
  (newVal) => {
    if (newVal && typeof newVal === 'object') {
      const { noDemo, ...rest } = newVal;
      const restValues = Object.values(rest);
      const anySelected = restValues.some((value) => value);

      console.log("anySelected (excluding 'noDemo'): ", anySelected);
      formData.dumpster = { dumpster: anySelected };
    }
  },
  { deep: true } // Ensures that nested changes are detected
);
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

form {
  /*display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: auto;
  gap: 1px;
  padding: 1px;*/
  width: 100%;
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

<!-- test -->
