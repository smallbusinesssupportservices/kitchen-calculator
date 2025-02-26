<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import Visitor from './Visitor.vue' 
import Visitors from './visitors.json' with { type: "json"};



const visitors = reactive({ ...Visitors });


const visitorDb = ref(visitors);
const selectedVisitor = ref(null);
const itemName = ref(null)
const isModalVisible = ref(false);

// Function to handle item selection and show modal
const selectItem = (item, key) => {
    console.log(key, " ",item)
  selectedVisitor.value = item;
  itemName.value = item.contactInfo.name
  isModalVisible.value = true; // Show modal when an item is clicked
};

// Function to close the modal
const closeModal = () => {
  isModalVisible.value = false;
};

// Function to save the updated item
const saveItem = async (updatedItem) => {
  // Find the corresponding key in visitorDb based on the updated item
  // const key = Object.keys(visitorDb.value).find(k => visitorDb.value[k] === selectedVisitor.value);

  // if (key) {
  //   // Update only the item in the full visitorDb object
  //   visitorDb.value[key] = { ...updatedItem };

  //   // Send the entire visitorDb object to the server to save
  //   try {
  //     await axios.post('http://localhost:3000/update-item', visitorDb.value);  // Send the full updated object
  //     console.log('Item updated successfully!');
  //   } catch (error) {
  //     console.error('Error updating item:', error);
  //   }
  // }

  closeModal();  // Close the modal after saving
};


</script>

<template>
  <div class="visitors">
    <!-- Render list of visitors -->
    <ul class="visitor-list">
      <li 
        v-for="(item, key) in visitorDb" 
        :key="key" 
        @click="selectItem(item, key)" 
        class="visitor-item">
        {{ item.contactInfo.name }}
      </li>
    </ul>

    <!-- Show visitor data -->
    <Visitor 
    v-if="isModalVisible" 
    :visitor="selectedVisitor" 
    @close="closeModal" 
    @save="saveItem" 
  />
  </div>
</template>

<style scoped>
.visitors {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.visitor-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}

.visitor-item {
  margin-bottom: 10px;
  padding: 5px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.visitor-item:hover {
  background-color: #e9e9e9;
}
</style>