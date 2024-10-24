<script setup>
import { reactive } from 'vue';
import axios from 'axios';
import calculatorSettings from './calculatorSettings.json' with { type: 'json' };


const settings = reactive({ ...calculatorSettings });

const saveToServer = async () => {
  try {
    const response = await axios.post('http://localhost:3000/update-calculator-setting', settings);
    console.log("Saved successfully", response.data);
  } catch (error) {
    console.error("Error saving settings", error);
  }
};
</script>

<template>
  <h3>Calculator Settings</h3>
  <div class="calculator-settings">
    <div class="input-group">
      <label for="lowside">Lowside Buffer:</label>
      <input type="number" id="lowside" v-model="settings.lowBuffer" />
    </div>

    <div class="input-group">
      <label for="highside">Highside Buffer:</label>
      <input type="number" id="highside" v-model="settings.highBuffer" />
    </div>

    <div class="input-group">
      <label for="rng">RNG Value:</label>
      <input type="number" id="rng" v-model="settings.rng" />
    </div>
    <button @click="saveToServer">Save</button>
  </div>
</template>

<style scoped>
.calculator-settings {
  grid-column: 1 / 1;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 200px;
}

.input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

label {
  width: 50%;
  text-align: left;
}

input {
  width: 100px;
  /* Set width of input fields to match previous components */
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
