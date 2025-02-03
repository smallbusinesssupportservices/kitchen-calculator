<script setup>
import { ref } from 'vue';
import axios from 'axios';

const authorizeUri = async () => {
  try {
    const uri = 'https://appcenter.intuit.com/connect/oauth2?client_id=ABhn2tfb6NhEqvXLMDpCVX73byWhShPMiuUWGM2pmKmzRkx2ay&redirect_uri=https%3A%2F%2F0ada-73-43-20-230.ngrok-free.app%2Fcallback&response_type=code&scope=com.intuit.quickbooks.accounting&state=intuit-test' //response.data
  

    const parameters = `location=1,width=800,height=650,left=${
      (window.screen.width - 800) / 2
    },top=${(window.screen.height - 650) / 2}`;
    
    window.open(uri, 'connectPopup', parameters);

  } catch (error) {
    console.error('Error initiating QBO auth:', error);
  }
};
</script>

<template>
  <div class="connect-to-qbo">
    <h3>Services</h3>
    <div class="connect-to-qbo-button">
      <a class="imgLink" href="#" @click.prevent="authorizeUri">
        <img src="./images/C2QB_green_btn_lg_default.png" width="178" alt="Connect to QuickBooks" />
      </a>
    </div>
    
  </div>
 
</template>

<style scoped>
.connect-to-qbo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.connect-to-qbo-button {
  grid-column: 1 / 1;
  grid-row: 1 / 1;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  width: 250px;
}

.imgLink {
  display: block;
  text-align: center;
}

.imgLink img {
  transition: opacity 0.2s ease;
}

.imgLink:hover img {
  opacity: 0.9;
}

  .input-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

</style>