import { directory } from './googleApiClient.js';

class GoogleDirectoryService {
  async getUsers() {
    try {
      const res = await directory.users.list({
        // customer: 'my_customer',
        domain:'smallbusinessessupport.services',
        maxResults: 10,
        orderBy: 'email',
        projection: 'full'
      });

      return buildOrgHierarchy(res.data.users);
    } catch (error) {
      console.error('Failed to get users:', error);
      throw error;
    }
  }

  async getGroups() {
    try {
      const res = await directory.groups.list({
        customer: 'my_customer',
        maxResults: 10,
        orderBy: 'email'
      });
      return res.data.groups;
    } catch (error) {
      console.error('Failed to get groups:', error);
      throw error;
    }
  }

  async getGroupMembers(groupKey) {
    try {
      const res = await directory.members.list({
        groupKey,
      });
      return res.data.members;
    } catch (error) {
      console.error(`Failed to get members for group ${groupKey}:`, error);
      throw error;
    }
  }
  async getOrgUnits() {
    try {
      const res = await directory.orgunits.list({
        customerId: 'my_customer', 
        type: 'all', 
      });
      return res.data.organizationUnits;
    } catch (error) {
      console.error('Failed to get organizational units:', error);
      throw error;
    }
  }
  
}

function buildOrgHierarchy(users) {
  let orgHierarchy = {}; 

  users.forEach(user => {
    console.log("user\n", user.thumbnailPhotoUrl)
      let orgUnitPath = user.orgUnitPath.slice(1);  
      let userData = { 
        id: user.id,
        name: user.name.fullName,
        email: user.primaryEmail,
        phone: formatPhoneNumber(user.phones?.[0]?.value), 
        role: user.organizations?.[0]?.title || 'Team Member',
        department: user.organizations?.[0]?.department,
        description: user.organizations?.[0]?.description,
        active: !user.suspended,
        bio: user?.customSchemas?.Custom_User_Fields.Bio,
        bio_short: user?.customSchemas?.Custom_User_Fields.Bio_short,
        expertise: user?.customSchemas?.Custom_User_Fields.Expertise.map(skill => skill.value),
        Role: user.customSchemas.Custom_User_Fields.Role[0].value,
        image: getProfileImage(user),
        organizations: user.organizations,
        externalIds: user.externalIds,
        emails: user.emails,
        phones: user.phones,
        orgUnitPath: user.orgUnitPath
      };

      if (!orgHierarchy[orgUnitPath]) {
          orgHierarchy[orgUnitPath] = { orgUnitPath, members: [] };
      }

      orgHierarchy[orgUnitPath].members.push(userData);
  });

  return orgHierarchy;
}

const formatPhoneNumber = (phone) => {
  return phone.replace(/\D/g, '')
              .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'); // Format
};

const getProfileImage = (user) => {
  return user.thumbnailPhotoUrl || 
         `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name.fullName)}&background=random`;
};


export const googleDirectoryService = new GoogleDirectoryService();