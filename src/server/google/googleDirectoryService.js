import { directory } from './googleApiClient.js';

class GoogleDirectoryService {
  async getUsers() {
    try {
      const res = await directory.users.list({
        customer: 'my_customer',
        maxResults: 10,
        orderBy: 'email',
      });
      return res.data.users;
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
        orderBy: 'email',
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
}

export const googleDirectoryService = new GoogleDirectoryService();