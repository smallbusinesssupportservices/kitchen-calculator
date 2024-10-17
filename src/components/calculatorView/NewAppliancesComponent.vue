<template>
  <div class="new-appliance">
    <h2>New Appliances</h2>
    
    <!-- Loop through appliances -->
    <div v-for="appliance in appliances" :key="appliance.name" class="appliance-item">
      
      <!-- Render regular appliance checkboxes -->
      <template v-if="appliance.name !== 'subSection'">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="localValue[appliance.name]"
            :disabled="localValue.noAppliances && appliance.name != 'noAppliances'" 
          />
          {{ appliance.label }}
        </label>
      </template>
      
      <!-- Render sub-section after Exhaust Hood -->
      <template v-else>
        <div class="sub-section" v-if="localValue.newRangeHood">
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
          appliances, excluding the Exhaust Hood and Wall Oven.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'; // Added 'ref'

const props = defineProps({
  modelValue: Object,
});

const emit = defineEmits(['update:modelValue']);

const appliances = [
  { name: 'newRange', label: 'Range' },
  { name: 'newCooktop', label: 'Cooktop' },
  { name: 'newWallOven', label: 'Wall Oven*' },
  { name: 'newMicrowave', label: 'Built-in Microwave' },
  { name: 'newFridge', label: 'Fridge' },
  { name: 'newDishwasher', label: 'Dishwasher' },
  { name: 'newRangeHood', label: 'Exhaust Hood*' },
  { name: 'subSection', label: null },
  { name: 'installationOptout', label: 'Installation opt out' },
  { name: 'noAppliances', label: 'No appliances' },
];

const localValue = reactive(
  appliances.reduce((acc, curr) => {
    acc[curr.name] = props.modelValue?.[curr.name] || false;
    return acc;
  }, {
    installAppliances: props.modelValue?.installAppliances || false,
    installVentHood: props.modelValue?.installVentHood || false,
    installWallOven: props.modelValue?.installWallOven || false,
    installationOptout: props.modelValue?.installationOptout || false,
    runExhaustDucting: props.modelValue?.runExhaustDucting || false,
    runDuctingThroughBrick: props.modelValue?.runDuctingThroughBrick || false,
  })



);

// Control Modal Visibility
const showOptOutModal = ref(false);

// Watcher for 'installationOptout' Checkbox**
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

// Watcher for 'newWallOven' Checkbox**
watch(
  () => localValue.newWallOven,
  (newVal) => {
    localValue.installWallOven = newVal;
  }
);

// Watcher for 'newRangeHood' Checkbox**
watch(
  () => localValue.newRangeHood,
  (newVal) => {
    console.log("newRangeHood: ", localValue.newRangeHood)
    localValue.installVentHood = newVal;
  }
);

// Watcher for appliance install thats not rangeHood or wallOven
watch(
  () => [localValue.newRange, localValue.newDishwasher, localValue.newFridge, localValue.newMicrowave, localValue.newCooktop],
  ([newRangeVal, newDishwasherVal, newFridgeVal, newMicrowaveVal, newCooktopVal]) => {
    console.log("installAppliances")
    if (newRangeVal || newDishwasherVal || newFridgeVal || newMicrowaveVal || newCooktopVal) {
      localValue.installAppliances = true;
    } else {
      localValue.installAppliances = false;
    }
  }
);

// Watcher to Reset Other Appliances When "No appliances" is Checked
watch(
  () => localValue.noAppliances,
  (newVal) => {
    if (newVal) {
      appliances.forEach((appliance) => {
        if (appliance.name !== 'noAppliances') {
          localValue[appliance.name] = false;
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

/* **Added: Modal Styles** */
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
