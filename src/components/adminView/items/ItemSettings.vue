<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      qboId: '',
      sqftPrice: false,
      unitCost: 200,
      markup: 0.0,
    };
  },
  methods: {
    closePopup() {
      this.$emit('close');
    }
  }
};
</script>

<template>
  <div v-if="show" class="popup-overlay">
    <div class="item-settings">
      <h3>Item Settings</h3>

      <div class="input-group">
        <label for="qboId">QBO ID:</label>
        <input type="text" v-model="qboId" id="qboId" />
      </div>

      <div class="input-group">
        <label for="unitCost">Unit Cost:</label>
        <input type="number" v-model="unitCost" id="unitCost" />
      </div>

      <div class="input-group">
        <label for="markup">Markup:</label>
        <input type="number" step="0.01" v-model="markup" id="markup" />
      </div>

      <div class="input-group">
        <label for="sqftPrice">Sq Ft Price:</label>
        <input type="checkbox" v-model="sqftPrice" id="sqftPrice" />
      </div>

      <button @click="closePopup">Close</button>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.item-settings {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

label {
  width: 40%;
  text-align: left;
}

input {
    width: 100px; /* Set width of input fields to 100px */
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

button {
  margin-top: 20px;
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}
</style>
