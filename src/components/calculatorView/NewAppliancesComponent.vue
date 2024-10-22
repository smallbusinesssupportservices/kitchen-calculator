<template>
  <div class="new-appliance">
    <h2>Appliances</h2>
    <h4>Select your current appliances and any new ones.</h4>
    <p>This calculator assumes we will install the appliances as part of the renovation project, unless you opt to install them yourself.</p>
    <!-- Loop through appliances -->
    <div v-for="appliance in appliances" :key="appliance.name" class="appliance-item">
      
      <!-- Render regular appliance checkboxes -->
      <template v-if="appliance.name !== 'subSection'">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="localValue[appliance.name]"
            :disabled="localValue.noAppliances && appliance.name != 'noAppliances' && appliance.name != 'installationOptout' " 
          />
          {{ appliance.label }}
        </label>

        <!-- Added Keep and New checkboxes -->
        <div class="keep-new-options" v-if="localValue[appliance.name] && appliance.name !== 'installationOptout'">
          <label>
            <input 
              type="checkbox" 
              v-model="localValue[`${appliance.name}_keep`]"
              :disabled="localValue.noAppliances && appliance.name != 'noAppliances' && appliance.name != 'installationOptout' || localValue[`${appliance.name}_new`]"
            />
            Keep
          </label>
          <label>
            <input 
              type="checkbox" 
              v-model="localValue[`${appliance.name}_new`]"
              :disabled="localValue.noAppliances && appliance.name != 'noAppliances' && appliance.name != 'installationOptout' || localValue[`${appliance.name}_keep`]"
            />
            New
          </label>
        </div>
      </template>
      
      <!-- Render sub-section after Exhaust Hood -->
      <template v-else>
        <div class="sub-section" v-if="localValue.newRangeHood_new">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="localValue.runExhaustDucting" 
              :disabled="localValue.noExhaustHood" 
            />
            Run new exhaust ducting from range hood to exterior
          </label>
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="localValue.runDuctingThroughBrick" 
              :disabled="localValue.noExhaustHood" 
            />
            Run ducting through brick
          </label>
        </div>
      </template>

    </div>

    <!-- Installation Opt Out Modal -->
    <div v-if="showOptOutModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showOptOutModal = false">&times;</span>
        <p>
          Installation opt out means you the client are responsible for the installation of the
          appliances, new or original, excluding the Exhaust Hood and Wall Oven.
        </p>
      </div>
    </div>
  </div>

  <!-- New appliance Opt Out Modal -->
  <div v-if="showNewApplianceModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="showNewApplianceModal = false">&times;</span>
      <p>
        You have chosen to keep There will be a reinstall 
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(['update:modelValue']);

const appliances = [
  { name: 'newRange', label: 'Range' },
  { name: 'newCooktop', label: 'Cooktop' },
  { name: 'newMicrowave', label: 'Built-in Microwave' },
  { name: 'newFridge', label: 'Fridge' },
  { name: 'newDishwasher', label: 'Dishwasher' },
  { name: 'newDisposal', label: 'Disposal'},
  { name: 'newWallOven', label: 'Wall Oven' },
  { name: 'newRangeHood', label: 'Exhaust Hood' },
  { name: 'subSection', label: null },
  { name: 'installationOptout', label: 'Installation opt out' },
  // { name: 'noAppliances', label: 'Keep my appliances' },
  
];

const localValue = reactive(
  appliances.reduce((acc, curr) => {
    acc[curr.name] = props.modelValue?.[curr.name] || false;
    acc[`${curr.name}_keep`] = props.modelValue?.[`${curr.name}_keep`] || false;
    acc[`${curr.name}_new`] = props.modelValue?.[`${curr.name}_new`] || false;
    return acc;
  }, {
    installAppliances: props.modelValue?.installAppliances || false,
    installVentHood: props.modelValue?.installVentHood || false,
    installWallOven: props.modelValue?.installWallOven || false,
    installationOptout: props.modelValue?.installationOptout || false,
    runExhaustDucting: props.modelValue?.runExhaustDucting || false,
    runDuctingThroughBrick: props.modelValue?.runDuctingThroughBrick || false,
    noAppliances: props.modelValue?.noAppliances || false,
  })
);

// // Computed property to determine noAppliances
// const noAppliances = computed(() => {
//   return appliances.every(appliance => !localValue[`${appliance.name}_new`]);
// });

// Control Modal Visibility
const showOptOutModal = ref(false);
const showNewApplianceModal = ref(false);

// Watcher for 'installationOptout
watch(
  () => localValue.installationOptout,
  (newVal) => {
    if (newVal) {
      showOptOutModal.value = true;
      localValue.installAppliances = false;
      localValue.installVentHood = false;
      localValue.installWallOven = false;
    }
  }
);

// Watcher for 'installWallOven' 
watch(
  () => localValue.newWallOven,
  (newVal) => {
    localValue.installWallOven = newVal;
  }
);

// Watcher for 'installVentHood' 
watch(
  () => localValue.newRangeHood,
  (newVal) => {
    localValue.installVentHood = newVal;
  }
);

// Watcher for appliance install thats not rangeHood or wallOven
watch(
  () => [localValue.newRange, localValue.newDishwasher, localValue.newFridge, localValue.newMicrowave, localValue.newCooktop],
  ([newRangeVal, newDishwasherVal, newFridgeVal, newMicrowaveVal, newCooktopVal]) => {
    if (newRangeVal || newDishwasherVal || newFridgeVal || newMicrowaveVal || newCooktopVal) {
      localValue.installAppliances = true;
    } else {
      localValue.installAppliances = false;
    }
  }
);

// Watcher to Reset "Keep" and "New" when appliance checkbox is unchecked
appliances.forEach(appliance => {
  watch(
    () => localValue[appliance.name],
    (newVal) => {
      if (!newVal) {
        localValue[`${appliance.name}_keep`] = false;
        localValue[`${appliance.name}_new`] = false;
        if (appliance.name === "newRangeHood"){
          localValue.runExhaustDucting = false;
          localValue.runDuctingThroughBrick = false;
        }
      }
    }
  );
});

// Watcher to Reset Other Appliances When "No appliances" is Checked
watch(
  () => localValue.noAppliances,
  (newVal) => {
    if (newVal) {
      showNewApplianceModal.value = true;
      appliances.forEach((appliance) => {
        if (appliance.name !== 'noAppliances') {
          localValue[appliance.name] = false;
          localValue[`${appliance.name}_keep`] = false;
          localValue[`${appliance.name}_new`] = false;
        }
      });
      // Optionally, reset installation responsibilities when no appliances are selected
      localValue.installAppliances = false;
      localValue.installVentHood = false;
      localValue.installWallOven = false;
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
.new-appliance {
  grid-column: 2 / 2;
  grid-row: 2 / 2;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
}

.keep-new-options {
  display: flex;
  justify-content: space-between;
  width: 200px; /* Adjust based on the layout */
  margin-left: 20px; /* Align with the main checkbox */
  margin-bottom: 10px;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  position: relative;
  text-align: center;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 20px;
  cursor: pointer;
}

.sub-section {
  margin-left: 20px;
}
</style>
