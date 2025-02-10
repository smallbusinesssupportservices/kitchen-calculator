<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Visitor Information</h3>
      
      <!-- Contact Info Section -->
      <section class="form-section">
        <h4>Contact Info</h4>
        <div v-for="(value, key) in visitorCopy.contactInfo" :key="key" class="form-group">
          <label :for="key">{{ key }}:</label>
          <p>{{ visitorCopy.contactInfo[key] }} </p>
        </div>
      </section>

      <!-- Calculator Settings Section -->
      <section class="form-section">
        <h4>Calculator Settings</h4>
        <div v-for="(value, key) in visitorCopy.calculatorSettingsValue" :key="key" class="form-group">
          <label :for="key">{{ key }}:</label>
          <p>{{ visitorCopy.calculatorSettingsValue[key] }}</p>
        </div>
      </section>

      <!-- Estimate Section as plain text -->
      <section v-if="hasEstimate" class="form-section">
        <h4>Estimate Summary</h4>
        <div class="form-group">
          <label>Overall Total:</label>
          <p>{{ formatCurrency(visitorCopy.estimate?.overallTotal) }}</p>
        </div>
        <div class="form-group">
          <label>Low Range:</label>
          <p>{{ formatCurrency(visitorCopy.estimate?.lowRange) }}</p>
        </div>
        <div class="form-group">
          <label>High Range:</label>
          <p>{{ formatCurrency(visitorCopy.estimate?.highRange) }}</p>
        </div>
      </section>

      <!-- Action Buttons -->
      <div class="button-group">
        <button @click="handleClose">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  visitor: Object, 
});

const emit = defineEmits(['save', 'close']);

// Copy the visitor object to avoid directly mutating the prop
const visitorCopy = ref({ ...props.visitor });

// Computed property to check if estimate exists and has required properties
const hasEstimate = computed(() => {
  return visitorCopy.value?.estimate && 
         (visitorCopy.value.estimate.overallTotal !== undefined ||
          visitorCopy.value.estimate.lowRange !== undefined ||
          visitorCopy.value.estimate.highRange !== undefined);
});

// Format currency helper function
const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Watch for changes to props.visitor and update visitorCopy
watch(() => props.visitor, (newVisitor) => {
  visitorCopy.value = { ...newVisitor };
}, { deep: true });

// Function to close the modal
const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
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
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
}

.form-section {
  margin-bottom: 20px;
}

h4 {
  margin-bottom: 10px;
  font-weight: bold;
}

.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  margin-right: 10px;
  width: 120px;
  text-align: right;
}

.form-group p {
  margin: 0;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1;
}

.button-group {
  display: flex;
  justify-content: flex-end;
}

button {
  padding: 10px 15px;
  margin-left: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
}
</style>