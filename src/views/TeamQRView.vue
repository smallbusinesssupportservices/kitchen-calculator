<template>
    <div class="qr-container">
      <div v-if="member" class="qr-card">
        <h1>{{ member.name }}'s Contact Information</h1>
        <div class="qr-content">
          <img 
            :src="qrUrl"
            :alt="`QR Code for ${member.name}'s contact info`"
            class="qr-code"
          />
          <p class="instructions">
            Scan this QR code to add {{ member.name }} to your contacts
          </p>
          <div class="actions">
            <router-link :to="`/team/${roleSlug}`" class="back-button">
              Return to Profile
            </router-link>
            <a :href="`/team/${roleSlug}/vcf`" class="download-button">
              Download vCard
            </a>
          </div>
        </div>
      </div>
      <div v-else class="not-found">
        <h2>Team Member Not Found</h2>
        <router-link to="/team" class="back-link">Return to Team</router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import teamMembers from '../data/teamMembers.json';
  
  const route = useRoute();
  
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  const roleSlug = computed(() => route.params.role);
  
  const member = computed(() => {
    for (const department of Object.values(teamMembers)) {
      const foundMember = department.members.find(m => 
        slugify(m.role) === roleSlug.value && m.active
      );
      if (foundMember) return foundMember;
    }
    return null;
  });
  
  const qrUrl = computed(() => {
    return `${import.meta.env.VITE_BASE_URL}/team/${roleSlug.value}/qr`;
  });
  </script>
  
  <style scoped>
  .qr-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .qr-card {
    background-color: var(--card-background);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
    text-align: center;
  }
  
  .qr-card h1 {
    padding: 2rem;
    margin: 0;
    background-color: #f8fafc;
    border-bottom: 1px solid var(--border-color);
  }
  
  .qr-content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .qr-code {
    width: 300px;
    height: 300px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: white;
    padding: 1rem;
  }
  
  .instructions {
    color: #4b5563;
    font-size: 1.1rem;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .back-button,
  .download-button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius);
    font-weight: 500;
    text-decoration: none;
    transition: background-color 0.2s ease;
  }
  
  .back-button {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  
  .back-button:hover {
    background-color: #e5e7eb;
  }
  
  .download-button {
    background-color: #6366f1;
    color: white;
    border: none;
  }
  
  .download-button:hover {
    background-color: #4f46e5;
  }
  
  .not-found {
    text-align: center;
    padding: 4rem 2rem;
    background-color: var(--card-background);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }
  
  .back-link {
    display: inline-block;
    margin-top: 1rem;
    color: var(--primary-color);
    text-decoration: none;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 640px) {
    .qr-code {
      width: 250px;
      height: 250px;
    }
  
    .actions {
      flex-direction: column;
    }
  }
  </style>