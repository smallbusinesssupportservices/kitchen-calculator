<template>
  <div class="bio-container">
    <div v-if="member" class="bio-card">
      <div class="bio-header">
        <div class="header-content">
          <div class="headshot-container">
            <img 
              :src="member.image" 
              :alt="`${member.name} headshot`"
              class="headshot"
            />
          </div>
          <div class="header-text">
            <h1>{{ member.name }}</h1>
            <div class="role-badge">{{ member.role }}</div>
            <a :href="`/team/${roleSlug}/vcf`" class="download-vcf">
              Add to Contacts
            </a>
          </div>
        </div>
      </div>
      
      <div class="bio-content">
        <div class="bio-section">
          <h2>About</h2>
          <p>{{ member.bio }}</p>
          <p>{{ member.extendedBio }}</p>
        </div>

        <div class="bio-section">
          <h2>Expertise</h2>
          <ul class="expertise-list">
            <li v-for="skill in member.expertise" :key="skill">{{ skill }}</li>
          </ul>
        </div>

        <div class="bio-section">
          <h2>Contact</h2>
          <div class="contact-details">
            <a v-if="member.email" :href="`mailto:${member.email}`" class="contact-link">
              {{ member.email }}
            </a>
            <a v-if="member.phone" :href="`tel:${member.phone}`" class="contact-link">
              {{ member.phone }}
            </a>
          </div>
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
import { teamData } from '../data/team';

const route = useRoute();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const roleSlug = computed(() => slugify(route.params.role));

const member = computed(() => {
  return teamData.find(m => slugify(m.role) === roleSlug.value);
});
</script>

<style scoped>
.bio-container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 2rem 1rem;
}

.bio-card {
  background-color: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.bio-header {
  padding: 2rem;
  background-color: #f8fafc;
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.headshot-container {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: var(--shadow);
  flex-shrink: 0;
}

.headshot {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-text {
  flex-grow: 1;
}

.bio-header h1 {
  margin: 0;
  text-align: left;
}

.role-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.download-vcf {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  text-decoration: none;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.download-vcf:hover {
  background-color: #059669;
}

.bio-content {
  padding: 2rem;
}

.bio-section {
  margin-bottom: 2rem;
}

.bio-section:last-child {
  margin-bottom: 0;
}

.bio-section h2 {
  color: var(--text-color);
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.expertise-list {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.expertise-list li {
  background-color: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  color: var(--text-color);
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-link {
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
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

@media (max-width: 768px) {
  .bio-container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .header-text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .bio-header h1 {
    text-align: center;
  }

  .expertise-list {
    grid-template-columns: 1fr;
  }

  .headshot-container {
    width: 150px;
    height: 150px;
  }
}
</style>