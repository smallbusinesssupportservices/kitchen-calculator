<script setup>
    import CalculatorSettings from '../components/adminView/CalculatorSettings.vue';
    import CategorySettings from '../components/adminView/CategorySettings.vue';
    import Items from '../components/adminView/Items.vue';

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