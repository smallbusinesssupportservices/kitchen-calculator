<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  visitor: Object, 
});

const emit = defineEmits(['save', 'close']);

// Copy the visitor object to avoid directly mutating the prop
const visitorCopy = ref({ ...props.visitor });

// Watch for changes to props.visitor and update visitorCopy
watch(() => props.visitor, (newVisitor) => {
  visitorCopy.value = { ...newVisitor };
});

// Function to handle save
const handleSave = () => {
  emit('save', visitorCopy.value); // Emit the updated visitor data
};

// Function to close the modal
const handleClose = () => {
  emit('close');
};
</script>

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
          <p>{{ visitorCopy.calculatorSettingsValue[key]  }}</p>
        </div>
      </section>

      <!-- Estimate Section as plain text -->
      <section class="form-section">
        <h4>Estimate Summary</h4>
        <div class="form-group">
          <label>Overall Total:</label>
          <p>{{ visitorCopy.estimate.overallTotal }}</p> <!-- Display value as text -->
        </div>
        <div class="form-group">
          <label>Low Range:</label>
          <p>{{ visitorCopy.estimate.lowRange }}</p> <!-- Display value as text -->
        </div>
        <div class="form-group">
          <label>High Range:</label>
          <p>{{ visitorCopy.estimate.highRange }}</p> <!-- Display value as text -->
        </div>
      </section>

      <!-- Action Buttons -->
      <div class="button-group">
        <!-- <button @click="handleSave">Save</button> -->
        <button @click="handleClose">Close</button>
      </div>
    </div>
  </div>
</template>

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
  align-items: center; /* Align label and text vertically */
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  margin-right: 10px; /* Add space between label and text */
  width: 120px; /* Set a fixed width for labels */
  text-align: right; /* Align the label text to the right */
}

.form-group p {
  margin: 0;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex-grow: 1; /* Ensure the text takes up the remaining space */
}

button-group {
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
