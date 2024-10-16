<script>
export default {
  data() {
    return {
      categoryMinimums: {
        kitchenSize: 0,
        scopeOfWork: 500,
        plumbing: 600,
        electrical: 1250,
        cabinets: 0,
        countertops: 0,
        newSink: 0,
        newFixtures: 0,
        exhaustHoodDucting: 0,
        newAppliances: 0,
        installation: 0,
        backsplash: 700,
        flooring: 0,
        interiorPainting: 700,
        finalCleaning: 0
      }
    };
  },
  methods: {
    updateCategoryMinimums() {
      console.log("Updated Category Minimums:", this.categoryMinimums);
    }
  }
};
</script>

<template>
  <div class="category-settings">
    <h3>Category Settings</h3>

    <div v-for="(value, key) in categoryMinimums" :key="key" class="category-input">
      <label :for="key">{{ key }}:</label>
      <input 
        type="number" 
        :id="key" 
        v-model.number="categoryMinimums[key]"
        @input="updateCategoryMinimums"
      />
    </div>
  </div>
</template>

<style scoped>
.category-settings {
  grid-column: 3 / 3;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 300px;
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
  width: 100px; /* Set width of input fields to 100px */
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
