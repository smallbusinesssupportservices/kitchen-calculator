<template>
  <h1>Sales Calculator</h1>
  <div v-if="!hasServerResponded">
    <form @submit.prevent="handleSubmit">
      <!-- Sales Rep Selection -->
      <div class="sales-rep-selection">
        <h2>Sales Representative</h2>
        <select v-model="selectedSalesRep" required class="sales-rep-select">
          <option value="">Select Sales Representative</option>
          <option v-for="rep in salesTeam" :key="rep.id" :value="rep">
            {{ rep.name }} - {{ rep.role }}
          </option>
        </select>
      </div>

      <!-- Calculator Components -->
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
import NewAppliances from '../components/calculatorView/NewAppliancesComponent.vue';
import Backsplash from '../components/calculatorView/BacksplashComponent.vue';
import Flooring from '../components/calculatorView/FlooringComponent.vue';
import InteriorPainting from '../components/calculatorView/InteriorPaintingComponent.vue';
import FinalCleaning from '../components/calculatorView/FinalCleaningComponent.vue';
import ServerResponse from '../components/calculatorView/ServerResponseComponent.vue';
import ProgressButton from '../components/calculatorView/ProgressButtonComponent.vue';
import UserForm from '../components/calculatorView/UserComponent.vue';
import teamMembers from '../data/teamMembers.json' with { type: 'json' };

const hasServerResponded = ref(false);
const serverResponse = ref(null);
const isLoading = ref(false);
const isSubmitted = ref(false);
const selectedSalesRep = ref('');

// Get sales team members
const salesTeam = computed(() => {
  return teamMembers.sales?.members || [];
});

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
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  }
});

// Compute progress based on filled required fields
const progress = computed(() => {
  // Check if sales rep is selected
  if (!selectedSalesRep.value) return 0;

  const filled = requiredFields.value.reduce((count, field) => {
    const fieldData = formData[field];
    if (typeof fieldData === 'object' && fieldData !== null) {
      const exclusions = excludedSubFields[field] || [];
      const values = Object.entries(fieldData)
        .filter(([key]) => !exclusions.includes(key))
        .map(([, value]) => value);
      const isFilled = values.some((value) => {
        if (typeof value === 'string') {
          return value.trim() !== '';
        } else if (typeof value === 'boolean') {
          return true;
        }
        return Boolean(value);
      });
      return isFilled ? count + 1 : count;
    } else if (typeof fieldData === 'string') {
      return fieldData.trim() !== '' ? count + 1 : count;
    }
    return Boolean(fieldData) ? count + 1 : count;
  }, 0);

  return Math.round((filled / (requiredFields.value.length + 1)) * 100);
});

const isDisabled = computed(() => progress.value < 100 || !selectedSalesRep.value);

// Generate or retrieve userId on component mount
onMounted(() => {
  let storedUserId = localStorage.getItem('atlhm');
  if (!storedUserId) {
    storedUserId = uuidv4();
    localStorage.setItem('atlhm', storedUserId);
  }
  
  formData.user.id = storedUserId;
});

const handleSubmit = async () => {
  if (!selectedSalesRep.value) {
    alert('Please select a sales representative.');
    return;
  }

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
    // Add sales rep information to the form data
    const dataToSubmit = {
      ...formData,
      salesRep: {
        id: selectedSalesRep.value.id,
        name: selectedSalesRep.value.name,
        email: selectedSalesRep.value.email,
        phone: selectedSalesRep.value.phone
      }
    };

    const response = await axios.post(
      'http://localhost:3000/submit-form',
      dataToSubmit
    );

    if (response.status === 200) {
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

<style scoped>
.sales-rep-selection {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.sales-rep-selection h2 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.sales-rep-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background-color: white;
  font-size: 1rem;
  color: var(--text-color);
  cursor: pointer;
}

.sales-rep-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.sales-rep-select option {
  padding: 0.5rem;
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