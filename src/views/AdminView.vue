<template>
    <div class="admin-container">
      <h1>Admin Dashboard</h1>
      
      <div class="admin-grid">
        <!-- Calculator Settings Section -->
        <div class="admin-section">
          <div class="section-header">
            <h2>Calculator Settings</h2>
          </div>
          <div class="section-content">
            <CalculatorSettings />
          </div>
        </div>
  
        <!-- Category Settings Section -->
        <div class="admin-section">
          <div class="section-header">
            <h2>Category Settings</h2>
          </div>
          <div class="section-content">
            <CategorySettings />
          </div>
        </div>
  
        <!-- Items Section -->
        <div class="admin-section">
          <div class="section-header">
            <h2>Items</h2>
          </div>
          <div class="section-content">
            <Items />
          </div>
        </div>
  
        <!-- Visitors Section -->
        <div class="admin-section">
          <div class="section-header">
            <h2>Visitors</h2>
          </div>
          <div class="section-content">
            <Visitors />
          </div>
        </div>
  
        <!-- Services Section -->
        <div class="admin-section">
          <div class="section-header">
            <h2>Services</h2>
          </div>
          <div class="section-content">
            <ConnectToQBO />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import CalculatorSettings from '../components/adminView/calculator/CalculatorSettings.vue';
  import CategorySettings from '../components/adminView/categories/CategorySettings.vue';
  import Items from '../components/adminView/items/Items.vue';
  import Visitors from '../components/adminView/visitors/Visitors.vue';
  import ConnectToQBO from '../components/qbo/ConnectToQboComponent.vue';
  </script>
  
  <style scoped>
  .admin-container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .admin-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .admin-section {
    background-color: var(--card-background);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
    border: 1px solid var(--border-color);
  }
  
  .section-header {
    padding: 1.5rem;
    background-color: #f8fafc;
    border-bottom: 1px solid var(--border-color);
  }
  
  .section-header h2 {
    margin: 0;
    color: var(--text-color);
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .section-content {
    padding: 1.5rem;
  }
  
  /* Override child component styles to fit the new layout */
  :deep(.calculator-settings),
  :deep(.category-settings),
  :deep(.items),
  :deep(.visitors),
  :deep(.connect-to-qbo-button) {
    border: none;
    padding: 0;
    box-shadow: none;
    width: 100%;
  }
  
  :deep(.input-group) {
    margin-bottom: 1rem;
  }
  
  :deep(input[type="number"]),
  :deep(input[type="text"]) {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    font-size: 0.875rem;
  }
  
  :deep(button) {
    background-color: var(--primary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }
  
  :deep(button:hover) {
    background-color: var(--primary-hover);
  }
  
  :deep(.checkbox-label) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  :deep(.item-list) {
    max-height: 400px;
    overflow-y: auto;
  }
  
  @media (max-width: 768px) {
    .admin-grid {
      grid-template-columns: 1fr;
    }
  
    .admin-section {
      margin-bottom: 1rem;
    }
  }
  </style>