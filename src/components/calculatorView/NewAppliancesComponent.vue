<template>
  <div class="new-appliance">
    <h2>Appliances</h2>
    <h4>Select your current appliances and any new ones.</h4>
    <p>This calculator assumes we will install the appliances as part of the renovation project, unless you opt to install them yourself.</p>
    
    <!-- Loop through appliances -->
    <div class="appliance-list">
      <div v-for="appliance in appliances" :key="appliance.name" class="appliance-item">
        <!-- Render regular appliance checkboxes -->
        <template v-if="appliance.name !== 'RangeHoodSubSection'">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="localValue[appliance.name]"
              :disabled="localValue.noAppliances && appliance.name != 'noAppliances' && appliance.name != 'installationOptout'"
            />
            {{ appliance.label }}
          </label>

          <!-- Keep and New options as radio buttons -->
          <div class="keep-new-options" v-if="localValue[appliance.name] && appliance.name !== 'installationOptout'">
            <div class="radio-group">
              <label class="radio-label">
                <input 
                  type="radio" 
                  :name="`${appliance.name}_option`"
                  :value="'keep'"
                  v-model="applianceOptions[appliance.name]"
                  :disabled="localValue.noAppliances && appliance.name != 'noAppliances'"
                />
                Keep
              </label>
              <label class="radio-label">
                <input 
                  type="radio" 
                  :name="`${appliance.name}_option`"
                  :value="'new'"
                  v-model="applianceOptions[appliance.name]"
                  :disabled="localValue.noAppliances && appliance.name != 'noAppliances'"
                />
                New
              </label>
            </div>
          </div>
        </template>
        
        <!-- Range Hood Sub-section -->
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
            
            <!-- Drywall Repair Checkbox - Only shown when ducting is selected -->
            <label v-if="localValue.runExhaustDucting || localValue.runDuctingThroughBrick" class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="localValue.drywallRepair" 
                disabled
              />
              <span class="disabled">
                Drywall Repair
              </span>
            </label>
          </div>
        </template>
      </div>
    </div>

    <!-- Installation Opt Out Modal -->
    <div v-if="showOptOutModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showOptOutModal = false">&times;</span>
        <p>Installation opt out means you the client are responsible for the installation of the appliances, new or original, excluding the Exhaust Hood and Wall Oven.</p>
      </div>
    </div>

    <!-- New appliance Opt Out Modal -->
    <div v-if="showNewApplianceModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showNewApplianceModal = false">&times;</span>
        <p>You have chosen to keep. There will be a reinstall.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted } from 'vue';

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
  { name: 'RangeHoodSubSection', label: null },
  { name: 'installationOptout', label: 'Customer to install appliances' },
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
    drywallRepair: props.modelValue?.drywallRepair || false,
  })
);

// Create a separate object to track radio button selections
const applianceOptions = reactive({});

// Initialize applianceOptions based on existing keep/new values
onMounted(() => {
  appliances.forEach(appliance => {
    if (appliance.name !== 'RangeHoodSubSection' && appliance.name !== 'installationOptout') {
      if (localValue[`${appliance.name}_new`]) {
        applianceOptions[appliance.name] = 'new';
      } else if (localValue[`${appliance.name}_keep`]) {
        applianceOptions[appliance.name] = 'keep';
      } else {
        applianceOptions[appliance.name] = '';
      }
    }
  });
});

// Watch for changes in radio button selections and update the keep/new values
watch(applianceOptions, (newOptions) => {
  for (const [appliance, option] of Object.entries(newOptions)) {
    if (option === 'keep') {
      localValue[`${appliance}_keep`] = true;
      localValue[`${appliance}_new`] = false;
    } else if (option === 'new') {
      localValue[`${appliance}_keep`] = false;
      localValue[`${appliance}_new`] = true;
    } else {
      localValue[`${appliance}_keep`] = false;
      localValue[`${appliance}_new`] = false;
    }
  }
}, { deep: true });

const showOptOutModal = ref(false);
const showNewApplianceModal = ref(false);

// Watch for changes in exhaust ducting options and update drywallRepair accordingly
watch(
  () => [localValue.runExhaustDucting, localValue.runDuctingThroughBrick],
  ([exhaustDucting, ductingThroughBrick]) => {
    // If either ducting option is selected, automatically check drywallRepair
    if (exhaustDucting || ductingThroughBrick) {
      localValue.drywallRepair = true;
    } else {
      // If neither ducting option is selected, uncheck drywallRepair
      localValue.drywallRepair = false;
    }
  }
);

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

watch(
  () => localValue.newWallOven_new,
  (newVal) => {
    localValue.installWallOven = newVal;
  }
);

watch(
  () => localValue.newRangeHood_new,
  (newVal) => {
    localValue.installVentHood = newVal;
  }
);

watch(
  () => [localValue.newRange_new, localValue.newDishwasher_new, localValue.newFridge_new, localValue.newMicrowave_new, localValue.newCooktop_new],
  ([newRangeVal_new, newDishwasherVal_new, newFridgeVal_new, newMicrowaveVal_new, newCooktopVal_new]) => {
    if (newRangeVal_new || newDishwasherVal_new || newFridgeVal_new || newMicrowaveVal_new || newCooktopVal_new) {
      localValue.installAppliances = true;
    } else {
      localValue.installAppliances = false;
    }
  }
);

appliances.forEach(appliance => {
  watch(
    () => localValue[appliance.name],
    (newVal) => {
      if (!newVal) {
        // Reset the radio button selection when the main checkbox is unchecked
        applianceOptions[appliance.name] = '';
        
        // Also reset the keep/new values
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

watch(
  () => localValue.noAppliances,
  (newVal) => {
    if (newVal) {
      showNewApplianceModal.value = true;
      appliances.forEach((appliance) => {
        if (appliance.name !== 'noAppliances') {
          localValue[appliance.name] = false;
          applianceOptions[appliance.name] = '';
          localValue[`${appliance.name}_keep`] = false;
          localValue[`${appliance.name}_new`] = false;
        }
      });
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
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  width: 100%;
  border: 1px solid var(--border-color);
}

h4 {
  margin: 1rem 0;
  color: var(--text-color);
}

p {
  margin-bottom: 1.5rem;
  color: var(--text-color);
  line-height: 1.6;
}

.appliance-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.appliance-item {
  padding: 0.5rem 0;
}

.keep-new-options {
  margin-left: calc(1.25rem + var(--input-spacing));
  margin-top: 0.5rem;
}

.radio-group {
  display: flex;
  gap: var(--input-spacing);
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sub-section {
  margin-left: calc(1.25rem + var(--input-spacing));
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: var(--radius);
  width: min(90%, 400px);
  position: relative;
  box-shadow: var(--shadow);
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  opacity: 0.7;
  transition: var(--transition);
}

.close:hover {
  opacity: 1;
}

.disabled {
  color: #888;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .radio-group {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>