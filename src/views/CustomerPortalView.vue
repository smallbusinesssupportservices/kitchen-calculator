<template>
  <div class="customer-portal">
    <div v-if="loading" class="loading">
      Loading your project details...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else-if="!currentProject || !currentProject.estimates?.length" class="no-project">
      Project data not found. Please complete the kitchen calculator first.
    </div>
    
    <div v-else class="project-container">
      <!-- Estimate Selection -->
      <div class="estimate-selector project-section">
        <h2>Your Estimates</h2>
        <div class="estimates-list">
          <button 
            v-for="(estimate, index) in currentProject.estimates" 
            :key="estimate.id || index"
            :class="['estimate-button', { active: selectedEstimateIndex === index }]"
            @click="selectedEstimateIndex = index"
          >
            Estimate {{ index + 1 }}
            <span class="estimate-date">{{ formatDate(estimate.createdAt) }}</span>
            <span class="estimate-range">
              {{ formatCurrency(estimate.lowRange) }} - {{ formatCurrency(estimate.highRange) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Project Details -->
      <div class="project-section">
        <h2>Project Details</h2>
        <div class="details-grid">
          <div class="detail-item">
            <label>Project Name:</label>
            <span>{{ selectedEstimate?.displayName || 'Kitchen Remodel' }}</span>
          </div>
          <div class="detail-item">
            <label>Status:</label>
            <span class="status">In Progress</span>
          </div>
          <div v-if="selectedEstimate?.lowRange && selectedEstimate?.highRange" class="detail-item">
            <label>Estimate Range:</label>
            <span class="estimate">
              {{ formatCurrency(selectedEstimate.lowRange) }} - {{ formatCurrency(selectedEstimate.highRange) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Kitchen Dimensions -->
      <div v-if="selectedEstimate?.dimensions" class="project-section">
        <h2>Kitchen Dimensions</h2>
        <div class="dimensions-grid">
          <div v-if="selectedEstimate.dimensions.kitchen" class="dimension-box">
            <h3>Main Kitchen</h3>
            <div class="dimension-details">
              <div class="dimension-item">
                <label>Length:</label>
                <span>{{ selectedEstimate.dimensions.kitchen.kitchenLength }}ft</span>
              </div>
              <div class="dimension-item">
                <label>Width:</label>
                <span>{{ selectedEstimate.dimensions.kitchen.kitchenWidth }}ft</span>
              </div>
              <div class="dimension-item">
                <label>Area:</label>
                <span>{{ selectedEstimate.dimensions.kitchen.kitchenArea }}sq ft</span>
              </div>
            </div>
          </div>
          
          <div v-if="selectedEstimate.dimensions.island?.hasIsland" class="dimension-box">
            <h3>Island</h3>
            <div class="dimension-details">
              <div class="dimension-item">
                <label>Length:</label>
                <span>{{ selectedEstimate.dimensions.island.islandLength }}ft</span>
              </div>
              <div class="dimension-item">
                <label>Width:</label>
                <span>{{ selectedEstimate.dimensions.island.islandWidth }}ft</span>
              </div>
              <div class="dimension-item">
                <label>Area:</label>
                <span>{{ selectedEstimate.dimensions.island.islandArea }}sq ft</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Features -->
      <div v-if="validCategories.length > 0" class="project-section">
        <h2>Selected Features</h2>
        <div class="features-grid">
          <div v-for="category in validCategories" 
               :key="category.category" 
               class="feature-category"
               :class="getCategoryClass(category.category)">
            <h3>{{ formatCategoryName(category.category) }}</h3>
            <ul>
              <li v-for="item in category.items" :key="item.name" class="feature-item">
                <div class="feature-header" 
                     @click="category.category === 'newAppliances' && openProductUrlModal(item)"
                     :class="{ 'clickable': category.category === 'newAppliances' }">
                  {{ formatItemName(item.name) }}
                  <div v-if="item.description" class="feature-details">
                    <p class="style-title">{{ item.description.title }}</p>
                  </div>
                  <div v-if="category.category === 'newAppliances'" class="product-selection">
                    <div v-if="getPrimarySelection(item)" class="primary-selection">
                      <span class="product-domain">{{ extractDomain(getPrimarySelection(item).url) }}</span>
                      <a :href="getPrimarySelection(item).url" target="_blank" @click.stop>View Product</a>
                    </div>
                    <div v-else class="no-selection">
                      Click to add product selection
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div v-if="currentProject.contactInfo" class="project-section">
        <h2>Contact Information</h2>
        <div class="contact-grid">
          <div class="contact-item">
            <label>Name:</label>
            <span>{{ currentProject.contactInfo.name }}</span>
          </div>
          <div class="contact-item">
            <label>Email:</label>
            <span>{{ currentProject.contactInfo.email }}</span>
          </div>
          <div class="contact-item">
            <label>Phone:</label>
            <span>{{ currentProject.contactInfo.phone }}</span>
          </div>
          <div class="contact-item">
            <label>Address:</label>
            <span>{{ formatAddress(currentProject.contactInfo) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Product URL Modal -->
    <div v-if="showProductUrlModal" class="modal-overlay" @click="closeProductUrlModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeProductUrlModal">&times;</button>
        <h3>Product Selections</h3>
        <p class="modal-description">Add URLs to products you're interested in purchasing.</p>
        
        <!-- Existing Selections -->
        <div v-if="selectedItem.selections?.length" class="existing-selections">
          <h4>Current Selections</h4>
          <div v-for="(selection, index) in selectedItem.selections" :key="index" class="selection-item">
            <div class="selection-content">
              <span class="product-domain">{{ extractDomain(selection.url) }}</span>
              <a :href="selection.url" target="_blank" @click.stop>View Product</a>
              <span v-if="selection.primary" class="primary-badge">Primary</span>
            </div>
            <div class="selection-actions">
              <button 
                v-if="!selection.primary" 
                @click="setPrimarySelection(index)"
                class="make-primary-button"
              >
                Make Primary
              </button>
              <button 
                @click="removeSelection(index)"
                class="remove-button"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Add New Selection -->
        <div class="add-selection">
          <h4>Add New Selection</h4>
          <input 
            type="url" 
            v-model="productUrlInput"
            placeholder="https://example.com/product"
            class="url-input"
            @keyup.enter="saveProductUrl"
          />
          <div class="modal-actions">
            <button @click="saveProductUrl" class="save-button">Add Selection</button>
            <button @click="closeProductUrlModal" class="cancel-button">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios'; 
import visitors from '../components/adminView/visitors/visitors.json';

const currentProject = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedEstimateIndex = ref(0);
const showProductUrlModal = ref(false);
const productUrlInput = ref('');
const selectedItem = ref(null);

const selectedEstimate = computed(() => {
  if (!currentProject.value?.estimates?.length) return null;
  return currentProject.value.estimates[selectedEstimateIndex.value];
});

const validCategories = computed(() => {
  if (!selectedEstimate.value?.categories) return [];
  return selectedEstimate.value.categories.filter(category => 
    category && 
    category.items && 
    Array.isArray(category.items) && 
    category.items.length > 0 &&
    category.category !== 'user'
  );
});

const getPrimarySelection = (item) => {
  if (!item.selections?.length) return null;
  return item.selections.find(selection => selection.primary);
};

const openProductUrlModal = (item) => {
  selectedItem.value = item;
  
  if (!selectedItem.value.selections) {
    selectedItem.value.selections = [];
    
    const estimate = currentProject.value.estimates[selectedEstimateIndex.value];
    const category = estimate.categories.find(c => c.category === 'newAppliances');
    if (category) {
      const storedItem = category.items.find(i => i.name === selectedItem.value.name);
      if (storedItem) {
        storedItem.selections = [];
      }
    }
  }
  
  productUrlInput.value = '';
  showProductUrlModal.value = true;
};

const closeProductUrlModal = () => {
  showProductUrlModal.value = false;
  productUrlInput.value = '';
  selectedItem.value = null;
};

const saveProductUrl = async () => {
  if (selectedItem.value && productUrlInput.value) {
    try {
      // Validate URL
      new URL(productUrlInput.value);
      
      // Create new selection
      const newSelection = {
        url: productUrlInput.value,
        primary: selectedItem.value.selections?.length === 0
      };
      
      // Get the current estimate
      const currentEstimate = currentProject.value.estimates[selectedEstimateIndex.value];
      
      // Find the appliances category and update the specific item
      const appliancesCategory = currentEstimate.categories.find(c => c.category === 'newAppliances');
      if (appliancesCategory) {
        const itemToUpdate = appliancesCategory.items.find(i => i.name === selectedItem.value.name);
        if (itemToUpdate) {
          if (!itemToUpdate.selections) {
            itemToUpdate.selections = [];
          }
          itemToUpdate.selections.push(newSelection);
          
          // Get visitor ID
          const visitorId = localStorage.getItem('atlhm');
          
          // Save to server
          try {
            await axios.post('http://localhost:3000/add-visitor', {
              id: visitorId,
              data: currentProject.value
            });
            
            productUrlInput.value = '';
          } catch (error) {
            console.error('Error saving selection:', error);
            // Remove the selection if save failed
            itemToUpdate.selections.pop();
            alert('Failed to save selection. Please try again.');
          }
        }
      }
    } catch (error) {
      alert('Please enter a valid URL');
    }
  }
};

const setPrimarySelection = async (index) => {
  if (selectedItem.value?.selections) {
    const currentEstimate = currentProject.value.estimates[selectedEstimateIndex.value];
    const appliancesCategory = currentEstimate.categories.find(c => c.category === 'newAppliances');
    
    if (appliancesCategory) {
      const itemToUpdate = appliancesCategory.items.find(i => i.name === selectedItem.value.name);
      if (itemToUpdate?.selections) {
        const previousState = [...itemToUpdate.selections];
        
        // Update primary status
        itemToUpdate.selections.forEach(selection => selection.primary = false);
        itemToUpdate.selections[index].primary = true;
        
        // Get visitor ID
        const visitorId = localStorage.getItem('atlhm');
        
        // Save to server
        try {
          await axios.post('http://localhost:3000/add-visitor', {
            id: visitorId,
            data: currentProject.value
          });
        } catch (error) {
          console.error('Error updating primary selection:', error);
          // Restore previous state if save failed
          itemToUpdate.selections = previousState;
          alert('Failed to update primary selection. Please try again.');
        }
      }
    }
  }
};

const removeSelection = async (index) => {
  if (selectedItem.value?.selections) {
    const currentEstimate = currentProject.value.estimates[selectedEstimateIndex.value];
    const appliancesCategory = currentEstimate.categories.find(c => c.category === 'newAppliances');
    
    if (appliancesCategory) {
      const itemToUpdate = appliancesCategory.items.find(i => i.name === selectedItem.value.name);
      if (itemToUpdate?.selections) {
        const previousState = [...itemToUpdate.selections];
        const removedSelection = itemToUpdate.selections[index];
        
        // Remove the selection
        itemToUpdate.selections.splice(index, 1);
        
        // Update primary if needed
        if (removedSelection.primary && itemToUpdate.selections.length > 0) {
          itemToUpdate.selections[0].primary = true;
        }
        
        // Get visitor ID
        const visitorId = localStorage.getItem('atlhm');
        
        // Save to server
        try {
          await axios.post('http://localhost:3000/add-visitor', {
            id: visitorId,
            data: currentProject.value
          });
        } catch (error) {
          console.error('Error removing selection:', error);
          // Restore previous state if save failed
          itemToUpdate.selections = previousState;
          alert('Failed to remove selection. Please try again.');
        }
      }
    }
  }
};


const extractDomain = (url) => {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain;
  } catch (error) {
    console.error('Error extracting domain:', error);
    return 'Invalid URL';
  }
};

onMounted(async () => {
  try {
    const visitorId = localStorage.getItem('atlhm');
    
    if (!visitorId) {
      error.value = 'No project found. Please complete the kitchen calculator first.';
      loading.value = false;
      return;
    }

    const visitorData = visitors[visitorId];
    
    if (!visitorData || !visitorData.estimates || !visitorData.estimates.length) {
      error.value = 'Project data not found. Please complete the kitchen calculator first.';
      loading.value = false;
      return;
    }

    currentProject.value = visitorData;
  } catch (err) {
    error.value = 'Error loading project data. Please try again later.';
    console.error('Error loading project data:', err);
  } finally {
    loading.value = false;
  }
});

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

const formatAddress = (contactInfo) => {
  if (!contactInfo) return 'N/A';
  const { address, city, state, zip } = contactInfo;
  return [address, city, state, zip].filter(Boolean).join(', ');
};

const formatCategoryName = (category) => {
  if (!category) return '';
  return category
    .split(/(?=[A-Z])|_|:/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatItemName = (name) => {
  if (!name) return '';
  return name
    .split(/(?=[A-Z])|_|:/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getCategoryClass = (category) => {
  const classes = {
    demo: 'bg-red-50',
    plumbing: 'bg-blue-50',
    electrical: 'bg-yellow-50',
    cabinets: 'bg-amber-50',
    countertops: 'bg-emerald-50',
    newSink: 'bg-teal-50',
    newFixtures: 'bg-cyan-50',
    exhaustHoodDucting: 'bg-sky-50',
    newAppliances: 'bg-indigo-50',
    installation: 'bg-violet-50',
    backsplash: 'bg-purple-50',
    flooring: 'bg-fuchsia-50',
    interiorPainting: 'bg-pink-50',
    finalCleaning: 'bg-rose-50'
  };
  return classes[category] || 'bg-gray-50';
};
</script>

<style scoped>
.customer-portal {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.project-container {
  display: grid;
  gap: 2rem;
}

.project-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.estimate-selector {
  margin-bottom: 2rem;
}

.estimates-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem;
}

.estimate-button {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;
}

.estimate-button.active {
  background: #eff6ff;
  border-color: #3b82f6;
}

.estimate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.estimate-date {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.estimate-range {
  font-weight: 600;
  color: #1e40af;
  margin-top: 0.25rem;
}

.project-section h2 {
  color: #1e40af;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item label {
  font-weight: 600;
  color: #4b5563;
}

.status {
  color: #059669;
  font-weight: 600;
}

.estimate {
  color: #1e40af;
  font-weight: 600;
  font-size: 1.25rem;
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dimension-box {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.dimension-box h3 {
  color: #4f46e5;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.dimension-details {
  display: grid;
  gap: 0.75rem;
}

.dimension-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dimension-item label {
  color: #4b5563;
  font-weight: 500;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-category {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-category:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature-category h3 {
  color: #1e40af;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.5rem;
}

.feature-category ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.feature-header {
  padding: 0.75rem;
  font-size: 0.95rem;
  color: #4b5563;
  background: rgba(255, 255, 255, 0.8);
}

.feature-details {
  padding: 0.75rem;
}

.style-image-container {
  margin-top: 0.5rem;
  text-align: center;
}

.style-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  object-fit: contain;
  max-height: 200px;
}

.style-title {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #4b5563;
  font-weight: 500;
}

.bg-red-50 { background-color: #fef2f2; }
.bg-blue-50 { background-color: #eff6ff; }
.bg-yellow-50 { background-color: #fefce8; }
.bg-amber-50 { background-color: #fffbeb; }
.bg-emerald-50 { background-color: #ecfdf5; }
.bg-teal-50 { background-color: #f0fdfa; }
.bg-cyan-50 { background-color: #ecfeff; }
.bg-sky-50 { background-color: #f0f9ff; }
.bg-indigo-50 { background-color: #eef2ff; }
.bg-violet-50 { background-color: #f5f3ff; }
.bg-purple-50 { background-color: #faf5ff; }
.bg-fuchsia-50 { background-color: #fdf4ff; }
.bg-pink-50 { background-color: #fdf2f8; }
.bg-rose-50 { background-color: #fff1f2; }
.bg-gray-50 { background-color: #f9fafb; }

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item label {
  font-weight: 600;
  color: #4b5563;
}

.loading, .error, .no-project {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error {
  color: #dc2626;
}

.clickable {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}

.modal-description {
  margin-bottom: 1rem;
  color: #64748b;
}

.url-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.url-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.save-button,
.cancel-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.save-button {
  background-color: #2563eb;
  color: white;
  border: none;
}

.save-button:hover {
  background-color: #1d4ed8;
}

.cancel-button {
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.cancel-button:hover {
  background-color: #e2e8f0;
}

.product-link {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.product-domain {
  color: #64748b;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background-color: #f1f5f9;
  border-radius: 4px;
}

.product-link a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.product-link a:hover {
  text-decoration: underline;
}

.existing-selections {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
}

.selection-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

.selection-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.selection-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.primary-badge {
  background: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.make-primary-button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.make-primary-button:hover {
  background: #4f46e5;
}

.remove-button {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background: #dc2626;
}

.add-selection {
  margin-top: 1.5rem;
}

.add-selection h4 {
  margin-bottom: 1rem;
}

.product-selection {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.primary-selection {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.no-selection {
  color: #64748b;
  font-size: 0.875rem;
  font-style: italic;
  padding: 0.5rem;
}

.product-domain {
  color: #64748b;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background-color: #f1f5f9;
  border-radius: 4px;
}

.primary-selection a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.primary-selection a:hover {
  text-decoration: underline;
}

.clickable {
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0.75rem;
  border-radius: 4px;
}

.clickable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .customer-portal {
    padding: 1rem;
  }
  
  .project-section {
    padding: 1.5rem;
  }
  
  .details-grid,
  .dimensions-grid,
  .features-grid,
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .estimate {
    font-size: 1.1rem;
  }
  
  .estimates-list {
    flex-direction: column;
  }
  
  .estimate-button {
    width: 100%;
  }
}
</style>