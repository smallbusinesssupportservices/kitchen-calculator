import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

class GoogleAdminClient {
  constructor() {
    this.auth = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      const now = Math.floor(Date.now() / 1000);
      const credentials = {
        client_email: "adminsdk@aqueous-cargo-406518.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDSPJjz0YmyfZmE\nX+wkyqXeW+ilT032GKQ4z6Daf9DUARZppHKZlrvU+La/b3jY9dOQnwYKnURD37YD\neBH7/7KnKRYPBPCw2yHUS0YwF1WqqxI8dvCXtNr5lpM4jPiVcji4rXZPrD1EXUUS\nWYrmzxKraIaoyPm1mvn1INoO22w/fB5pXm6/Z/plTdJot4rBcwSSRyBQd+cOMWdR\nD+LuQtDix1hodnkpjPMRZCZvZ5X/frDLoMHlAIoxoJhB7bRlNzfPmIeJiblUYeiW\nLi50iAYJ9od8K2dlGZV94QKGlKD/ufMKdUP7afNwlkxIhzLyVZSjK1uprmWrK8db\nQWYQwA9jAgMBAAECggEACw+VHH7Rt8pT4VsKmYTv5RsAynG5sFDrkvGZjOVcn0rP\nWw+D2ADOMQ5Ezx2WRhPo5Zr4Pma3yLpkYRpYF+IEDDdlKbUg1K0ywnCTaMRRhYEq\nnHPFhLXHL4p0hG0mRvaTdWPq7ZYqQwaFM8nyPOJ4IPyG2Sp5uMxGilcIIe/5af2N\nRK9tLuuOIJMK4r2cPEERVDIl2vQAPX2VPFgXWBIBtu7BDYvDPTkf+4ZEVcX9+tJ7\nFQbyGdPtn/SKn8E3aXM/sL52XHdo6fuvQJJKffo/cv1o0BzIbDqOyy7V4PXmmnYz\nFkrFJzI+0AUXNLAQnpe9Q8taFn+0y86q47h1gFnMwQKBgQD4Ft3tuEi2wQHDa426\nCNxpuAsXOOuFZVriYoRTr+FYc1cE6TgSTqFj/4XuLOyzFOv7/WY3SjYmq2tYMshC\nVvfzptlvUhCdZD4F665toVzZCNskb1Q8l2MnCR/RslbwPPkFo6o4eaDBWwpR5b9u\n0lQlB7+l2ks6vRY6U/Y8P2vWbQKBgQDY8L4jTb/azAGOQzb1aJpZIBCGClfgEFmV\na3oPh1algdEk2StWJp+9DdcaQua1tt0bmTcK2B2VuSDdJD50O8j7Zg/wzCFlfJGt\nfKYiNzJ+lTz18bJNLbbNEIzXv8P1olKhollXY4nJ+L8d5FHEOYUCphD9ivKpxzgZ\nBwuEonUbDwKBgQDn8MEFmc/phGK4qBo1vkkLUbSUvnN7IHoqwr5CW2HLxvGpNr1k\naDz894zoUvnsp3fE/HCO6oPb/VF7gOa3FwXztp78M3YzH9/YuzI1brIWevAejTLs\n/wAFI8Oq0hfzvJ14Rz5CVHwVqZ7pWGl0G5HtmOP1FDRXMybP22WPiB+ytQKBgHeC\nD8yU/TbEIatEPddte3HTpyagNg6aEy+sGH7LeKEOZa+d7zCzcFYOdMvjxQKfrSiR\n++9+ZLXhWUhZugoAEVTkwa1OVqt4tyvSOhcpPyjaf82hCy9XGpfXIS+NVZ9Qf6LJ\nM9xfWj2oSWhnKeAmK67s2vlBfTKoK7Al4GN9t3NjAoGBANM/e6C4NCaUN8XjZxL3\noaBo/eSy3Fj6SCwcBO182SZ9vzKVxQT61nmU0M6j+yjYg9bkuBkRiVufKg/jbA9d\n+paHsDomNo0DCR2l+V9slAfbEMdkvCSi7CYL/gTRAHsUZDgG4OyoxiZJqrHoz11g\n8yFSEXZc1aHZHQZDcM+D966A\n-----END PRIVATE KEY-----\n",
        client_id: "116954533269619252681"
      };

      // Create JWT with proper claims
      const jwtClaims = {
        iss: credentials.client_email,
        scope: [
          'https://www.googleapis.com/auth/admin.directory.user',
          'https://www.googleapis.com/auth/admin.directory.group',
          'https://www.googleapis.com/auth/admin.directory.orgunit'
        ].join(' '),
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now
      };

      this.auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: [
          'https://www.googleapis.com/auth/admin.directory.user',
          'https://www.googleapis.com/auth/admin.directory.group',
          'https://www.googleapis.com/auth/admin.directory.orgunit'
        ],
        additionalClaims: jwtClaims
      });

      await this.auth.authorize();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing Google Admin client:', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      await this.initialize();

      const admin = google.admin({ version: 'directory_v1', auth: this.auth });
      const domain = process.env.GOOGLE_DOMAIN;

      console.log('** /api/team-members **');
      console.log('domain: ', domain);

      const response = await admin.users.list({
        domain,
        orderBy: 'email',
        projection: 'full',
        viewType: 'admin_view',
        maxResults: 100
      });

      if (!response.data.users) {
        console.log('No users found, falling back to local data');
        return this.getFallbackData();
      }

      return this.transformUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users from Google Admin:', error);
      return this.getFallbackData();
    }
  }

  transformUsers(googleUsers) {
    const departments = {
      leadership: { title: 'Leadership', members: [] },
      design: { title: 'Design Team', members: [] },
      'project-management': { title: 'Project Management', members: [] },
      'client-relations': { title: 'Client Relations', members: [] }
    };

    for (const user of googleUsers) {
      // Extract department from custom schema or organizational unit
      const department = this.getDepartment(user);
      if (!departments[department]) continue;

      const member = {
        id: user.id,
        name: `${user.name.givenName} ${user.name.familyName}`,
        role: user.organizations?.[0]?.title || 'Team Member',
        email: user.primaryEmail,
        phone: user.phones?.[0]?.value,
        bio: user.customSchemas?.employeeInfo?.bio || '',
        extendedBio: user.customSchemas?.employeeInfo?.extendedBio || '',
        expertise: user.customSchemas?.employeeInfo?.expertise || [],
        image: user.thumbnailPhotoUrl || '',
        active: !user.suspended,
        startDate: user.customSchemas?.employeeInfo?.startDate || '',
        department,
        position: user.organizations?.[0]?.title?.toLowerCase().replace(/\s+/g, '-') || '',
        nickname: user.customSchemas?.employeeInfo?.nickname || '',
        title: user.organizations?.[0]?.title || '',
        organization: 'The ATL Homemaker',
        url: user.customSchemas?.employeeInfo?.url || '',
        note: user.customSchemas?.employeeInfo?.note || ''
      };

      departments[department].members.push(member);
    }

    return departments;
  }

  getDepartment(user) {
    // Try to get department from custom schema
    const dept = user.customSchemas?.employeeInfo?.department;
    if (dept) return dept;

    // Fall back to organizational unit mapping
    const orgUnit = user.orgUnitPath;
    const deptMapping = {
      '/Leadership': 'leadership',
      '/Design': 'design',
      '/Project Management': 'project-management',
      '/Client Relations': 'client-relations'
    };

    return deptMapping[orgUnit] || null;
  }

  async getFallbackData() {
    try {
      const filePath = path.join(__dirname, '..', 'data', 'teamMembers.json');
      const data = await readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading fallback data:', error);
      return {};
    }
  }
}

export default new GoogleAdminClient();