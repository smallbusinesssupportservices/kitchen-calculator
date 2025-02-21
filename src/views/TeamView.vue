<template>
  <div class="team-container">
    <h1>Our Team</h1>
    
    <div v-for="(department, key) in teamMembersData" :key="key" class="department-section">
      <h2>{{ department.title }}</h2>
      
      <div class="table-container">
        <table class="team-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Bio</th>
              <th v-if="!hasFounderCEO(department.members)">Contact</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="member in department.members.filter(m => m.active)" 
              :key="member.id"
              @click="navigateToMember(member)"
              class="member-row"
            >
              <td class="name-cell">{{ member.name }}</td>
              <td class="role-cell">{{ member.role }}</td>
              <td class="bio-cell">{{ member.bio }}</td>
              <td v-if="!isFounderCEO(member)" class="contact-cell">
                <div class="contact-info">
                  <a 
                    v-if="member.email"
                    :href="`mailto:${member.email}`" 
                    class="email-link"
                    @click.stop
                  >
                    {{ member.email }}
                  </a>
                  <a 
                    v-if="member.phone"
                    :href="`tel:${member.phone}`" 
                    class="phone-link"
                    @click.stop
                  >
                    {{ member.phone }}
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import teamMembersData from '../data/teamMembers.json' with { type: 'json' };
import axios from 'axios';

const router = useRouter();
const teamMembers = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/users');
    teamMembers.value = response.data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    // Fallback to local data
    teamMembers.value = null;
  }
});

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isFounderCEO(member) {
  return member.role.toLowerCase().includes('founder') || 
         member.role.toLowerCase().includes('ceo');
}

function hasFounderCEO(members) {
  return members.some(member => isFounderCEO(member));
}

function navigateToMember(member) {
  const roleSlug = slugify(member.role);
  router.push(`/team/${roleSlug}`);
}
</script>

<style scoped>
.team-container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 2rem 1rem;
}

.department-section {
  margin-bottom: 3rem;
}

.department-section h2 {
  color: var(--text-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

.table-container {
  background-color: var(--card-background);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-top: 1rem;
}

.team-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.team-table th,
.team-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.team-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: var(--text-color);
}

.team-table tr:last-child td {
  border-bottom: none;
}

.team-table tr:hover {
  background-color: #f8fafc;
}

.name-cell {
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
}

.role-cell {
  color: #64748b;
  white-space: nowrap;
}

.bio-cell {
  max-width: 300px;
  color: var(--text-color);
}

.contact-cell {
  white-space: nowrap;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.email-link,
.phone-link {
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s ease;
}

.email-link:hover,
.phone-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.member-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.member-row:hover {
  background-color: #f1f5f9;
}

.member-row td {
  transition: background-color 0.2s ease;
}

.member-row:hover td {
  background-color: #f1f5f9;
}

@media (max-width: 768px) {
  .team-table {
    display: block;
    overflow-x: auto;
  }

  .bio-cell {
    max-width: 200px;
  }
}
</style>