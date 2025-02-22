import { directory } from './googleApiClient.js';

class GoogleDirectoryService {
  async getUsers() {
    try {
      const res = await directory.users.list({
        customer: 'my_customer',
        maxResults: 10,
        orderBy: 'email',
        projection: 'full'
      });

      return res.data.users.map(user => ({ 
        id: user.id,
        name: user.name.fullName,
        email: user.primaryEmail,
        phone: user.phones?.[0]?.value,
        role: user.organizations?.[0]?.title || 'Team Member',
        department: user.organizations?.[0]?.department,
        description: user.organizations?.[0]?.description,
        active: !user.suspended,
        bio: user?.customSchemas?.Custom_User_Fields.Bio,
        bio_short: user?.customSchemas?.Custom_User_Fields.Bio_short,
        expertise: user?.customSchemas?.Custom_User_Fields.Expertise,
        Role: user?.customSchemas?.Custom_User_Fields.Role,
        picture: user.thumbnailPhotoUrl,
        organizations: user.organizations,
        externalIds: user.externalIds,
        emails: user.emails,
        phones: user.phones,
        orgUnitPath: user.orgUnitPath
      }));
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

export const googleDirectoryService = new GoogleDirectoryService();