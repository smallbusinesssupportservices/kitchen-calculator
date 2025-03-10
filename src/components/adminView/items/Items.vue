<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import ItemSettings from "./ItemSettings.vue" 
import Items from './items.json' with { type: "json" };


const items = reactive({ ...Items });


const dbItems = ref(items);
const selectedItem = ref(null);
const itemName = ref(null)
const isModalVisible = ref(false);

// Function to handle item selection and show modal
const selectItem = (item, key) => {
    console.log(key, " ",item)
  selectedItem.value = item;
  itemName.value = key
  isModalVisible.value = true; // Show modal when an item is clicked
};

// Function to close the modal
const closeModal = () => {
  isModalVisible.value = false;
};

// Function to save the updated item
const saveItem = async (updatedItem) => {
  // Find the corresponding key in dbItems based on the updated item
  const key = Object.keys(dbItems.value).find(k => dbItems.value[k] === selectedItem.value);

  if (key) {
    // Update only the item in the full dbItems object
    dbItems.value[key] = { ...updatedItem };

    // Send the entire dbItems object to the server to save
    try {
      await axios.post('http://localhost:3000/update-item', dbItems.value);  // Send the full updated object
      console.log('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }

  closeModal();  // Close the modal after saving
};
</script>

<template>
  <div class="items">
    <!-- Render list of items -->
    <ul class="item-list">
      <li 
        v-for="(item, key) in dbItems" 
        :key="key" 
        @click="selectItem(item, key)" 
        class="item-list-item">
        {{ key }}
      </li>
    </ul>

    <!-- Show ItemSettings when an item is selected -->
    <ItemSettings 
      v-if="isModalVisible" 
      :item="selectedItem" 
      :itemName="itemName"
      @close="closeModal" 
      @save="saveItem" 
    />
  </div>
</template>

<style scoped>
.items {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
  height: 100%;
}

.item-list-item {
  margin-bottom: 10px;
  padding: 5px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.item-list-item:hover {
  background-color: #e9e9e9;
}
</style>