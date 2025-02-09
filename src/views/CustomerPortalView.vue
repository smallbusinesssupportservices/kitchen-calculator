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
                <div class="feature-header">
                  {{ formatItemName(item.name) }}
                </div>
                <div v-if="item.description" class="feature-details">
                  <div v-if="item.description.imagePath" class="style-image-container">
                    <img 
                      :src="getImageUrl(item.description.imagePath)"
                      :alt="item.description.title"
                      class="style-image"
                      @error="handleImageError"
                    />
                    <p class="style-title">{{ item.description.title }}</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import visitors from '../components/adminView/visitors/visitors.json';

const currentProject = ref(null);
const loading = ref(true);
const error = ref(null);
const selectedEstimateIndex = ref(0);

// Computed property to get the selected estimate
const selectedEstimate = computed(() => {
  if (!currentProject.value?.estimates?.length) return null;
  return currentProject.value.estimates[selectedEstimateIndex.value];
});

// Computed property to filter valid categories
const validCategories = computed(() => {
  if (!selectedEstimate.value?.categories) return [];
  return selectedEstimate.value.categories.filter(category => 
    category && 
    category.items && 
    Array.isArray(category.items) && 
    category.items.length > 0 &&
    category.category !== 'user' // Exclude user category
  );
});

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

const getImageUrl = (path) => {
  if (!path) return '';
  try {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return new URL(`../assets/${cleanPath}`, import.meta.url).href;
  } catch (error) {
    console.error('Error loading image:', error);
    return '';
  }
};

const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src);
  // Hide the image container instead of just the image
  const container = event.target.closest('.style-image-container');
  if (container) {
    container.style.display = 'none';
  }
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

/* Estimate Selector Styles */
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

/* Category Background Colors */
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