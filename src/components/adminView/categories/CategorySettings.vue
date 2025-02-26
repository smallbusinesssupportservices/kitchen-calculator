<script setup>
import { reactive } from 'vue';
import axios from 'axios';
import categoryMinimums from './categoryMinimums.json' with { type: 'json' };

const settings = reactive({ ...categoryMinimums });

const saveToServer = async () => {
  try {
    const response = await axios.post('http://localhost:3000/update-category-setting', settings);
    console.log("Saved successfully", response.data);
  } catch (error) {
    console.error("Error saving settings", error);
  }
};
</script>

<template>
  <div class="category-settings">
    <div class="settings-container">
      <div v-for="(value, key) in categoryMinimums" :key="key" class="category-input">
        <label :for="key">{{ key }}:</label>
        <input 
          type="number" 
          :id="key" 
          v-model="settings[key]"
        />
      </div>
    </div>
    <button @click="saveToServer">Save</button>
  </div>
</template>

<style scoped>
.category-settings {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.settings-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.category-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

label {
  text-transform: capitalize;
  width: 50%;
}

input {
  width: 100px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 15px;
}
</style>