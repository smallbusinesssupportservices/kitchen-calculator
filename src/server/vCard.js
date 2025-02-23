
import teamMembers from '../data/teamMembers.json' with { type: 'json' };

export const vcard = (req, res) => {
    try {
      const { role } = req.params;
      const member = findMemberByRoleSlug(role);
      
      if (!member) {
        return res.status(404).send('Team member not found');
      }
  
      // Format categories (expertise) as a comma-separated string
      const categories = member.expertise ? member.expertise.join(',') : '';
      
      // General appointments
      const calUri = `https://calendar.google.com/calendar/appointments/schedules/AcZssZ3fyWaQmMk_JZvj6-6RomRzViixeC5Be9-pZ4PJ4f2t7nFCU5CTm_Ioju0_HjNYQayVIOu9jshI`;
      
      // Company logo URL
      const logo = 'https://theatlhomemaker.com/logo.png';
      
      // Calendar URL
      const fbUrl = 'https://calendar.google.com/calendar/u/0?cid=d2lsbGlhbUBzbWFsbGJ1c2luZXNzZXNzdXBwb3J0LnNlcnZpY2Vz';
  
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
  
      // Set response headers
      res.setHeader('Content-Type', 'text/vcard');
      res.setHeader('Content-Disposition', `attachment; filename="${slugify(member.name)}.vcf"`);
      
      // Send the vCard
      res.send(vCard);
    } catch (error) {
      console.error('Error generating vCard:', error);
      res.status(500).send('Error generating vCard');
    }
  }

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