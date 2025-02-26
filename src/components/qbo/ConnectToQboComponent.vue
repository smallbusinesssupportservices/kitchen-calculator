<script setup>
import { ref } from 'vue';
import axios from 'axios';


const authorizeUri = async () => {
  try {
    const uri = `https://appcenter.intuit.com/connect/oauth2?client_id=ABhn2tfb6NhEqvXLMDpCVX73byWhShPMiuUWGM2pmKmzRkx2ay&redirect_uri=${encodeURI(import.meta.env.VITE_QBO_REDIRECT_URI)}&response_type=code&scope=com.intuit.quickbooks.accounting&state=intuit-test`
  

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
    <div class="connect-container">
      <p class="connect-description">
        Connect to QuickBooks Online to enable integration with your accounting system.
        This allows the calculator to create customers and estimates directly in QuickBooks.
      </p>
      <div class="connect-to-qbo-button">
        <a class="imgLink" href="#" @click.prevent="authorizeUri">
          <img src="./images/C2QB_green_btn_lg_default.png" width="178" alt="Connect to QuickBooks" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connect-to-qbo {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.connect-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.connect-description {
  margin-bottom: 2rem;
  color: #666;
  line-height: 1.6;
}

.connect-to-qbo-button {
  margin-top: auto;
  margin-bottom: auto;
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
</style>