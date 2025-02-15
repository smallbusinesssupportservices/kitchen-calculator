<template>
  <div class="loading-container">
    <p>Downloading contact information...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const roleSlug = route.params.role;
  
  // Trigger the download by navigating to the server endpoint
  window.location.href = `${import.meta.env.VITE_BASE_URL}/team/${roleSlug}/vcf`;
  
  // Redirect back to team member's bio page after a short delay
  setTimeout(() => {
    router.push(`/team/${roleSlug}`);
  }, 1000);
});
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: var(--text-color);
}
</style>