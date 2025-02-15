<template>
  <!-- This template is intentionally empty as we'll handle the download programmatically -->
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import teamMembers from '../data/teamMembers.json';

const route = useRoute();
const router = useRouter();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findMemberByRoleSlug(roleSlug) {
  for (const department of Object.values(teamMembers)) {
    const foundMember = department.members.find(m => 
      slugify(m.role) === roleSlug && m.active
    );
    if (foundMember) return foundMember;
  }
  return null;
}

function generateVCard(member) {
  // Format categories (expertise) as a comma-separated string
  const categories = member.expertise ? member.expertise.join(',') : '';
  
  // General appointments
  const calUri = `https://calendar.google.com/calendar/appointments/schedules/AcZssZ3fyWaQmMk_JZvj6-6RomRzViixeC5Be9-pZ4PJ4f2t7nFCU5CTm_Ioju0_HjNYQayVIOu9jshI`;
  
  // Company logo URL
  const logo = 'https://theatlhomemaker.com/logo.png'; // Replace with actual logo URL
  
  // Defines a URL that shows when the person is "free" or "busy" on their calendar.
  const fbUrl = 'https://calendar.google.com/calendar/u/0?cid=d2lsbGlhbUBzbWFsbGJ1c2luZXNzZXNzdXBwb3J0LnNlcnZpY2Vz'; // Replace with actual Facebook URL

  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${member.name}`,
    member.nickname ? `NICKNAME:${member.nickname}` : '',
    member.title ? `TITLE:${member.title}` : `TITLE:${member.role}`,
    member.organization ? `ORG:${member.organization}` : 'ORG:The ATL Homemaker',
    member.email ? `EMAIL;type=WORK:${member.email}` : '',
    member.phone ? `TEL;type=WORK:${member.phone}` : '',
    member.url ? `URL:${member.url}` : '',
    `CALURI:${calUri}`,
    `CATEGORIES:${categories}`,
    `FBURL:${fbUrl}`,
    `LOGO:${logo}`,
    'MAILER:gmail',
    `ROLE:${member.position || member.role}`,
    member.note ? `NOTE:${member.note}` : '',
    member.image ? `PHOTO;VALUE=URI:${member.image}` : '',
    member.startDate ? `REV:${new Date(member.startDate).toISOString()}` : '',
    'END:VCARD'
  ].filter(Boolean).join('\r\n');

  return vCard;
}

onMounted(() => {
  const roleSlug = route.params.role;
  const member = findMemberByRoleSlug(roleSlug);

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