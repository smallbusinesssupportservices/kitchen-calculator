<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  item: Object, // The selected item passed as a prop
  itemName: String
});

const emit = defineEmits(['save', 'close']);

// Copy the item to avoid directly mutating the prop
const itemCopy = ref({ ...props.item });

// Watch for changes to props.item and update itemCopy
watch(() => props.item, (newItem) => {
  itemCopy.value = { ...newItem };
});

// Function to handle save
const handleSave = () => {
  emit('save', itemCopy.value); // Emit the updated item data
};

// Function to close the modal
const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>Edit Item</h3>
      
      <div v-for="(value, key) in itemCopy" :key="key" class="form-group">
        <label :for="key">{{ key }}:</label>
        <input 
          v-model="itemCopy[key]" 
          :id="key" 
          type="text" 
          :disabled="key === 'qboId'" /> <!-- Disable editing qboId if necessary -->
      </div>
      
      <button @click="handleSave">Save</button>
      <button @click="handleClose">Close</button>
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
  width: 300px;
}

.form-group {
  margin-bottom: 15px;
}

button {
  margin-right: 10px;
}
</style>
