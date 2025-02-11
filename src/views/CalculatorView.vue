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

const hasServerResponded = ref(false);
const serverResponse = ref(null);
const isLoading = ref(false);
const isSubmitted = ref(false);

// Define required fields for progress calculation
const requiredFields = ref([
  'kitchenSize',
  'electrical',
  'newAppliances',
  'interiorPainting',
  'finalCleaning',
  'plumbing',
  'newSink',
  'countertops',
  'cabinets',
  'backsplash',
  'flooring',
  'user',
]);

// Configuration for excluded subfields
const excludedSubFields = {
  user: ['id'],
};

// Initialize form data
const formData = reactive({
  kitchenSize: {
    length: 120,
    width: 120,
    hasIsland: true,
    islandLength: 24,
    islandWidth: 24
  },
  demo: {
    removeSink: true,
    removeCountertops: true,
    removeCabinets: true,
    removeBacksplash: true,
    removeFlooring: true,
    lightDemo: true,
    drywallRepair: true,
    noDemo: false
  },
  dumpster: { dumpster: true },
  plumbing: {
    moveSink: true,
    moveFridgeWater: true,
    installPotFiller: true,
    installFaucet: true,
    installDisposal: true,
    addGasLine: true,
    noPlumbing: false
  },
  electrical: {
    swapFixtures: true,
    fixtureCount: 1,
    addCanLights: true,
    addUnderCabinetLights: true,
    switchesAndOutlets: true,
    applianceOutlets: true,
    drywallRepair: true,
    noElectrical: false
  },
  drywall: {},
  cabinets: {
    cabinetType: 'standardLineCabinets',
    cabinetStyle: 'edgewater-white',
    customColorBase: false,
    customColorWall: false,
    selectedStyle: {
      style: 'edgewater-white',
      title: 'Edgewater White',
      imagePath: '/cabinet_images/Edgewater-White.webp'
    }
  },
  countertops: {
    countertopType: 'Quartz',
    countertopStyle: 'quartz-style-1',
    waterfallEdges: 1,
    selectedStyle: {
      style: 'quartz-style-1',
      title: 'Quartz Style 1',
      imagePath: '/countertop_images/Quartz.png'
    }
  },
  newSink: { sinkType: 'Custom Finish' },
  newFixtures: {},
  exhaustHoodDucting: {},
  newAppliances: {
    installAppliances: true,
    installVentHood: true,
    installWallOven: true,
    installationOptout: false,
    runExhaustDucting: true,
    runDuctingThroughBrick: false,
    noAppliances: false,
    newRange: true,
    newRange_keep: false,
    newRange_new: true,
    newCooktop: true,
    newCooktop_keep: false,
    newCooktop_new: true,
    newMicrowave: true,
    newMicrowave_keep: false,
    newMicrowave_new: true,
    newFridge: true,
    newFridge_keep: false,
    newFridge_new: true,
    newDishwasher: true,
    newDishwasher_keep: false,
    newDishwasher_new: true,
    newDisposal: true,
    newDisposal_keep: false,
    newDisposal_new: true,
    newWallOven: true,
    newWallOven_keep: false,
    newWallOven_new: true,
    newRangeHood: true,
    newRangeHood_keep: false,
    newRangeHood_new: true,
    RangeHoodSubSection: false,
    RangeHoodSubSection_keep: false,
    RangeHoodSubSection_new: false,
    installationOptout_keep: false,
    installationOptout_new: false
  },
  installation: {},
  backsplash: { backsplash: true },
  flooring: { flooringType: 'Hardwood' },
  interiorPainting: { paintKitchen: true },
  finalCleaning: { cleanKitchen: true },
  user: {
    id: '',
    name: 'williamjhgf',
    phone: '4106102350',
    email: 'technology@theatlhomemaker.com',
    address: '3156 w manor cir sw',
    city: 'atlanta',
    state: 'GA',
    zip: '30311'
  }
});

// Compute progress based on filled required fields
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
      return fieldData.trim() !== '' ? count + 1 : count;
    }
    return Boolean(fieldData) ? count + 1 : count;
  }, 0);

  return Math.round((filled / requiredFields.value.length) * 100);
});

const isDisabled = computed(() => progress.value < 100);

// Generate or retrieve userId on component mount
onMounted(() => {
  let storedUserId = localStorage.getItem('atlhm');
  if (!storedUserId) {
    storedUserId = uuidv4();
    localStorage.setItem('atlhm', storedUserId);
  }
  
  // Update the user ID while preserving other user data
  formData.user = {
    ...formData.user,
    id: storedUserId
  };
});

  // Temporarily set hasServerResponded and serverResponse for testing purposes
onMounted(() => {
  if(false){
    hasServerResponded.value = true;
    serverResponse.value = {
      estimate: {
        highRange: 15000,
        lowRange: 12000
      },
      message: "Here is the estimated cost for your kitchen renovation."
    };
  }
});

const handleSubmit = async () => {
  let allFilled = true;
  requiredFields.value.forEach((field) => {
    const fieldData = formData[field];
    if (typeof fieldData === 'object') {
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
      }
    } else if (typeof fieldData === 'string') {
      if (fieldData.trim() === '') {
        allFilled = false;
      }
    } else {
      if (!fieldData) {
        allFilled = false;
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
    // Create a serializable copy of the form data
    const serializedFormData = JSON.parse(JSON.stringify(formData));
    
    const response = await axios.post(
      'http://localhost:3000/submit-form',
      serializedFormData
    );

    if (response.status === 200) {
      console.log(response.data.estimate);
      serverResponse.value = response.data;
      serverResponse.value.high = response.data.estimate.highRange;
      serverResponse.value.low = response.data.estimate.lowRange;
      hasServerResponded.value = true;
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
      formData.dumpster = { dumpster: anySelected };
    }
  },
  { deep: true }
);
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

form {
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