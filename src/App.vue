<template>
  <div class="calculator-app">
    <nav class="horizontal-nav">
      ** Nav for testing **
      <div><router-link to="/">Calculator</router-link></div>
      <div><router-link to="/admin">Admin</router-link></div>
      <div><router-link to="/make-appointment">Appointment</router-link></div>
      <div><router-link to="/email">Email</router-link></div>
      <div><router-link to="/portal">Customer Portal</router-link></div>
      ** Nav for testing **
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

.calculator-app {
  width: 100%;
}

body {
  font-family: Arial, sans-serif;
  margin: 20px;
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