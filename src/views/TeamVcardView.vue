<template>
    <!-- This template is intentionally empty as we'll handle the download programmatically -->
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { teamData } from '../data/team';
  
  const route = useRoute();
  const router = useRouter();
  
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  function generateVCard(member) {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${member.name}`,
      `TITLE:${member.role}`,
      `ORG:The ATL Homemaker`,
      member.email ? `EMAIL;type=WORK:${member.email}` : '',
      member.phone ? `TEL;type=WORK:${member.phone}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\r\n');
  
    return vCard;
  }
  
  onMounted(() => {
    const roleSlug = route.params.role;
    const member = teamData.find(m => slugify(m.role) === roleSlug);
  
    if (!member) {
      router.push('/team');
      return;
    }
  
    // Generate vCard content
    const vCardContent = generateVCard(member);
  
    // Create blob and download
    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slugify(member.name)}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  
    // Redirect back to team member's bio page
    router.push(`/team/${roleSlug}`);
  });
  </script>