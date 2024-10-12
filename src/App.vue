<script setup>

</script>

<template>
  <div>
    <nav class="horizontal-nav">
      <div><router-link to="/">Calculator</router-link></div>
      <div><router-link to="/admin">Admin</router-link></div>
    </nav>
    <router-view />
  </div>
</template>


<style scoped> 

.horizontal-nav {
  display: flex;
  flex-direction: row; /* Stack items horizontally */
  align-items: center; /* Align items vertically centered */
  gap: 20px; /* Add space between the links */
}

body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

form {
  width: 97%;
}

.button-container {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
}

button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
