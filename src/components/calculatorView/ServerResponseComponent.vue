<template>
  <div class="response-container">
    <div class="response-content">
      <!-- Estimate Box -->
      <div class="estimate-box">
        <div class="estimate-header">
          <h2>Your Kitchen Estimate</h2>
          <div class="estimate-badge">Personalized Estimate</div>
        </div>
        
        <div class="estimate-details">
          <p class="estimate-description">Based on your selections, here's your estimated price range:</p>
          <div class="estimate-amount">
            {{ formatCurrency(response.estimate.calculations.lowRange) }} - {{ formatCurrency(response.estimate.calculations.highRange) }}
          </div>
          <p class="estimate-disclaimer">*This estimate is based on the specifications you provided and may vary based on final design choices and site conditions.</p>
        </div>
      </div>

      <!-- Action Cards -->
      <div class="action-cards">
        <!-- Schedule Card -->
        <div class="action-card primary">
          <!-- <h3>Ready to Start?</h3> -->
          
          <button 
            class="action-button primary" 
            @click="handleButtonClick('schedule')"
          >
            Start Your Kitchen Transformation Now
            <!-- <span class="icon">→</span> -->
          </button>
          <br>
          <p style="text-align: center;">Schedule a free consultation to refine your project scope and receive a more precise cost estimate.</p>
          <!-- <p>Schedule a consultation with our designer to bring your kitchen vision to life. At this meeting, a 30% design and materials deposit is required to cover design labor and secure cabinet and countertop materials once selections are finalized.</p> -->
        </div>

        <!-- Design Card -->
        <div class="action-card secondary">
          <!-- <h3>Need More Time?</h3> -->
          <button 
            class="action-button secondary" 
            @click="handleButtonClick('design')"
          >
          I'm still thinking through my design and selection options
            <!-- <span class="icon">→</span> -->
          </button>
          <br>
          <p style="text-align: center;">Explore design concepts, appliance reviews, and color combinations.</p>
        </div>

        <!-- Budget Card -->
        <div class="action-card secondary">
          <!-- <h3>Budget Concerns?</h3> -->
          
          <button 
            class="action-button secondary" 
            @click="handleButtonClick('budget')"
          >
            This is way over my budget. What are my other options?
            <!-- <span class="icon">→</span> -->
          </button>
          <br>
          <p style="text-align: center;">Explore cheap altertive renovation options.</p>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="info-section">
        <h3>What's Next?</h3>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Free Consultation</h4>
              <p>Meet with our design expert to discuss your vision</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Design & Planning</h4>
              <p>Refine your selections and finalize the design</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Transform Your Kitchen</h4>
              <p>Watch your dream kitchen come to life</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const props = defineProps({
  response: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const handleButtonClick = async (selection) => {
  try {
    // Get the visitor ID
    const visitorId = localStorage.getItem('atlhm');
    
    // Get the current visitor data
    const response = await axios.get(`http://localhost:3000/get-visitor/${visitorId}`);
    const visitorData = response.data;
    
    if (visitorData && visitorData.estimates && visitorData.estimates.length > 0) {
      // Get the latest estimate
      const latestEstimate = visitorData.estimates[visitorData.estimates.length - 1];
      
      // Add the selection to the estimate
      latestEstimate.userSelection = selection;
      
      // Save the updated visitor data
      await axios.post('http://localhost:3000/add-visitor', {
        id: visitorId,
        data: visitorData
      });
    }
    
    // Navigate based on selection
    switch(selection) {
      case 'schedule':
        router.push('/make-appointment');
        break;
      case 'design':
      case 'budget':
        router.push('/portal');
        break;
    }
  } catch (error) {
    console.error('Error saving selection:', error);
  }
};
</script>

<style scoped>
.response-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8fafc;
}

.response-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Estimate Box Styles */
.estimate-box {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.estimate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.estimate-badge {
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.estimate-details {
  text-align: center;
}

.estimate-amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(173, 49, 52);
  margin: 1rem 0;
}

.estimate-disclaimer {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 1rem;
}

/* Action Cards Styles */
.action-cards {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: transform 0.2s ease;
}

.action-card:hover {
  transform: translateY(-4px);
}

.action-card h3 {
  color: rgb(173, 49, 52);
  margin-bottom: 1rem;
}

.action-card p {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.action-button {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.action-button.primary {
  background: rgb(173, 49, 52);
  color: white;
}

.action-button.primary:hover {
  background: rgb(173, 49, 52);
}

.action-button.secondary {
  background: rgb(173, 49, 52, 80%);
  color: white;
}

.action-button.secondary:hover {
  background: rgb(173, 49, 52);
}

.icon {
  transition: transform 0.2s ease;
}

.action-button:hover .icon {
  transform: translateX(4px);
}

/* Steps Section Styles */
.info-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.info-section h3 {
  color: rgb(173, 49, 52);
  margin-bottom: 2rem;
  text-align: center;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-number {
  background: rgb(173, 49, 52);
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  color: rgb(173, 49, 52);
  margin-bottom: 0.5rem;
}

.step-content p {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .response-container {
    padding: 1rem;
  }

  .estimate-amount {
    font-size: 2rem;
  }

  .steps {
    grid-template-columns: 1fr;
  }
}
</style>