<script>
export default {
    data() {
        return {
            lowsideBuffer: 0,
            highsideBuffer: 0,
            rngValue: 0 // Added RNG value
        };
    },
    methods: {
        updateSettings() {
            console.log("Lowside Buffer:", this.lowsideBuffer);
            console.log("Highside Buffer:", this.highsideBuffer);
            console.log("RNG Value:", this.rngValue); // Logging the RNG value
        }
    }
};
</script>

<template>
    <div class="calculator-settings">
        <h3>Calculator Settings</h3>

        <div class="input-group">
            <label for="lowside">Lowside Buffer:</label>
            <input type="number" id="lowside" v-model="lowsideBuffer" @input="updateSettings" />
        </div>

        <div class="input-group">
            <label for="highside">Highside Buffer:</label>
            <input type="number" id="highside" v-model="highsideBuffer" @input="updateSettings" />
        </div>

        <div class="input-group">
            <label for="rng">RNG Value:</label>
            <input type="number" id="rng" v-model="rngValue" @input="updateSettings" />
        </div>
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
    width: 100px; /* Set width of input fields to match previous components */
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
