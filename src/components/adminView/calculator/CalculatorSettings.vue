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
  <div class="calculator-settings">
    <div class="settings-container">
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
      <div class="input-group">
        <label for="markUp">Mark up:</label>
        <input type="number" id="markUp" v-model="settings.markUp" />
      </div>

      <div class="input-group">
        <label for="cabinetMultiplier">Cabinet Multiplier:</label>
        <input type="number" id="cabinetMultiplier" v-model="settings.cabinet_multiplier" />
      </div>
      <div class="input-group">
        <label for="countertopMultiplier">Countertop Multiplier:</label>
        <input type="number" id="countertopMultiplier" v-model="settings.countertop_multiplier" />
      </div>
      <div class="input-group">
        <label for="windowConstant">Window Constant:</label>
        <input type="number" id="windowConstant" v-model="settings.window_constant" />
      </div>

      <div class="input-group">
        <label for="applianceConstant">Appliance Constant:</label>
        <input type="number" id="applianceConstant" v-model="settings.appliance_constant" />
      </div>
    </div>
    <button @click="saveToServer">Save</button>
  </div>
</template>

<style scoped>
.calculator-settings {
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
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 15px;
}
</style>