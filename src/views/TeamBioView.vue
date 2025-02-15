<template>
  <div class="bio-container">
    <div v-if="member" class="bio-card">
      <div class="edit-controls">
        <button @click="toggleEdit" class="edit-button">
          {{ isEditing ? 'Cancel' : 'Edit Profile' }}
        </button>
        <button v-if="isEditing" @click="saveChanges" class="save-button">
          Save Changes
        </button>
      </div>

      <div class="bio-header">
        <div class="header-content">
          <div class="headshot-container">
            <img 
              :src="editedMember.image" 
              :alt="`${editedMember.name} headshot`"
              class="headshot"
            />
            <input 
              v-if="isEditing"
              v-model="editedMember.image"
              type="text"
              placeholder="Image URL"
              class="image-input"
            />
          </div>
          <div class="header-text">
            <div v-if="!isEditing">
              <h1>{{ editedMember.name }}</h1>
              <div class="role-badge">{{ editedMember.role }}</div>
              <div class="department-badge">{{ getDepartmentTitle(editedMember.department) }}</div>
            </div>
            <div v-else class="edit-fields">
              <input v-model="editedMember.name" placeholder="Name" class="edit-input" />
              <input v-model="editedMember.role" placeholder="Role" class="edit-input" />
            </div>
            <div class="contact-actions">
              <router-link :to="`/team/${roleSlug}/qr`" class="qr-link">
                View Contact QR Code
              </router-link>
              <a :href="`/team/${roleSlug}/vcf`" class="download-vcf">
                Add to Contacts
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bio-content">
        <div class="bio-section">
          <h2>About</h2>
          <div v-if="!isEditing">
            <p>{{ editedMember.bio }}</p>
            <p>{{ editedMember.extendedBio }}</p>
          </div>
          <div v-else class="edit-fields">
            <textarea 
              v-model="editedMember.bio" 
              placeholder="Short bio"
              class="edit-textarea"
            ></textarea>
            <textarea 
              v-model="editedMember.extendedBio" 
              placeholder="Extended bio"
              class="edit-textarea"
            ></textarea>
          </div>
        </div>

        <div class="bio-section">
          <h2>Expertise</h2>
          <div v-if="!isEditing">
            <ul class="expertise-list">
              <li v-for="skill in editedMember.expertise" :key="skill">{{ skill }}</li>
            </ul>
          </div>
          <div v-else class="edit-fields">
            <div v-for="(skill, index) in editedMember.expertise" :key="index" class="expertise-edit">
              <input 
                v-model="editedMember.expertise[index]" 
                placeholder="Skill"
                class="edit-input"
              />
              <button @click="removeExpertise(index)" class="remove-button">Remove</button>
            </div>
            <button @click="addExpertise" class="add-button">Add Expertise</button>
          </div>
        </div>

        <div class="bio-section">
          <h2>Contact & Additional Information</h2>
          <div v-if="!isEditing" class="contact-details">
            <a v-if="editedMember.email" :href="`mailto:${editedMember.email}`" class="contact-link">
              {{ editedMember.email }}
            </a>
            <a v-if="editedMember.phone" :href="`tel:${editedMember.phone}`" class="contact-link">
              {{ editedMember.phone }}
            </a>
            <p v-if="editedMember.startDate" class="start-date">
              Started: {{ new Date(editedMember.startDate).toLocaleDateString() }}
            </p>
          </div>
          <div v-else class="edit-fields">
            <input 
              v-model="editedMember.email" 
              type="email" 
              placeholder="Email"
              class="edit-input"
            />
            <input 
              v-model="editedMember.phone" 
              type="tel" 
              placeholder="Phone"
              class="edit-input"
            />
            <input 
              v-model="editedMember.startDate" 
              type="date" 
              class="edit-input"
            />
            <div class="vcard-fields">
              <h3>Additional vCard Fields</h3>
              <input 
                v-model="editedMember.nickname" 
                placeholder="Nickname"
                class="edit-input"
              />
              <input 
                v-model="editedMember.title" 
                placeholder="Title"
                class="edit-input"
              />
              <input 
                v-model="editedMember.organization" 
                placeholder="Organization"
                class="edit-input"
              />
              <textarea 
                v-model="editedMember.note" 
                placeholder="Note"
                class="edit-textarea"
              ></textarea>
              <input 
                v-model="editedMember.url" 
                type="url" 
                placeholder="Website URL"
                class="edit-input"
              />
            </div>
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
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import teamMembers from '../data/teamMembers.json';

const route = useRoute();
const router = useRouter();
const isEditing = ref(false);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const roleSlug = computed(() => slugify(route.params.role));

const member = computed(() => {
  for (const department of Object.values(teamMembers)) {
    const foundMember = department.members.find(m => 
      slugify(m.role) === roleSlug.value && m.active
    );
    if (foundMember) return foundMember;
  }
  return null;
});

const editedMember = ref({ ...member.value });

function getDepartmentTitle(departmentKey) {
  return teamMembers[departmentKey]?.title || departmentKey;
}

function toggleEdit() {
  if (isEditing.value) {
    editedMember.value = { ...member.value };
  }
  isEditing.value = !isEditing.value;
}

function addExpertise() {
  editedMember.value.expertise.push('');
}

function removeExpertise(index) {
  editedMember.value.expertise.splice(index, 1);
}

async function saveChanges() {
  try {
    // Here you would typically make an API call to save the changes
    // For now, we'll just log the changes
    console.log('Saving changes:', editedMember.value);
    isEditing.value = false;
  } catch (error) {
    console.error('Error saving changes:', error);
  }
}
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

.department-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
  margin-left: 0.5rem;
}

.contact-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.qr-link,
.download-vcf {
  display: inline-block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.qr-link {
  background-color: #4f46e5;
  color: white;
}

.qr-link:hover {
  background-color: #4338ca;
}

.download-vcf {
  background-color: #6366f1;
  color: white;
}

.download-vcf:hover {
  background-color: #4f46e5;
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

.edit-controls {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  justify-content: flex-end;
}

.edit-button,
.save-button {
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.edit-button {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.save-button {
  background-color: #10b981;
  color: white;
  border: none;
}

.edit-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.edit-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: var(--radius);
  font-size: 0.875rem;
  width: 100%;
}

.edit-textarea {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: var(--radius);
  font-size: 0.875rem;
  width: 100%;
  min-height: 100px;
  resize: vertical;
}

.expertise-edit {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.remove-button {
  padding: 0.25rem 0.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 0.75rem;
  cursor: pointer;
}

.add-button {
  padding: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  margin-top: 0.5rem;
}

.vcard-fields {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: var(--radius);
  border: 1px solid #e2e8f0;
}

.vcard-fields h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #4b5563;
}

.image-input {
  margin-top: 0.5rem;
  width: 100%;
}

.start-date {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.5rem;
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