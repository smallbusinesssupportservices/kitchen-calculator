<script setup>
    import CalculatorSettings from '../components/adminView/calculator/CalculatorSettings.vue';
    import CategorySettings from '../components/adminView/categories/CategorySettings.vue';
    import Items from '../components/adminView/items/Items.vue';
    import Visitors from '../components/adminView/visitors/Visitors.vue'
    import dbItems from '../components/adminView/items/items.json' with { type: "json" };
    import categoryMinimums from '../components/adminView/categories/categoryMinimums.json' with { type: "json" };

</script>

<template>
    <h1> Admin view</h1>
    <div class="admin-container" >
        
        <div>
            <CalculatorSettings />
        </div>
        <div>
            <CategorySettings />
        </div>
        <div>
            <Items />
        </div>
        <div>
            <Visitors />
        </div>
    </div>
</template>

<style>
body {
    font-family: Arial, sans-serif;
    margin: 20px;
  }
  
.admin-container {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    /* 4 equal columns */
    grid-template-rows: auto;
    /* Rows adjust automatically */
    gap: 1px;
    /* Adds space between grid items */
    padding: 1px;
  }

</style>