<script setup>

const authorizeUri = async () => {

    try {
      const uri = 'https://appcenter.intuit.com/connect/oauth2?client_id=AB9I7O0UlN8E8aQsJFZng7eX508QVNwArk1y49nHKLm40kfp5q&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&response_type=code&scope=com.intuit.quickbooks.accounting&state=intuit-test' //response.data
  
      const parameters = `location=1,width=800,height=650,left=${
        (window.screen.width - 800) / 2
      },top=${(window.screen.height - 650) / 2}`
      const win = window.open(uri, 'connectPopup', parameters)
  
      const pollOAuth = setInterval(() => {
        try {
          if (win.document.URL.includes('code')) {
            clearInterval(pollOAuth)
            win.close()
            window.location.reload()
          }
        } catch (e) {
          console.log(e)
        }
      }, 100)
    } catch (error) {
      console.error('Error fetching authUri:', error)
    }
  }

</script>

<template>
    <h3> QBO </h3>
    <div class="connect-to-qbo-button">
        <a class="imgLink" href="#" @click.prevent="authorizeUri">
            <img src="./images/C2QB_green_btn_lg_default.png" width="178" alt="Connect to QuickBooks" />
        </a>
    </div>
</template>

<style scoped>
.connect-to-qbo-button {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    width: 250px;
  }

</style>