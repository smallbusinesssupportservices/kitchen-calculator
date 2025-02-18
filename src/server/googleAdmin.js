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
        client_email: "webapp-google-admin@aqueous-cargo-406518.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCUN7s4HVHsDQgb\nmpsLoR/Wp+x8pb65Ki3NQ5iuBO8HN+uvdb0OXdR/dlHL4D8PSQ7627HYZW1t7k6k\nBv5J8e8JMBQDoHJf0gj6XP3SSWw/q3HpTgPCj7U6tK2QpwVoNEUNRLq6xK5gqseU\ndcBznddgds1d8Xss2KaKrpcv0wHpKSAq4eRqdl/cied7iYjTYdDoCnMCETALWMlg\nXSbnu/68lQGSNF+5qLZAcNWgxlBalVDP08JC53ZrjNG/IpmMsU3t45NUL7DPpRYl\n8FTmbBoEBCkPWeMa7FgPnlfxqEf0VmX/JGYO9vroTAYui5mT14bRoU8tPKhE2JKE\nzrIUbLRJAgMBAAECggEADWfTA5rHR5HQK2r63fznO8t5XLbC/s1dUiTsgMTKd70r\nkHWWMV/0MckaUdXI7lF9zNulBLz7vkchDr3hLv/2Tj7ueHuBDMCa9kYF4QiqBUI0\n7dSUC3ti+VnRHvW0S/36Rt5yAyV53h1kKr3Rt8NNcRidr4MBUIeR3JY472bm09c0\npiiwxpcCb2NfOxQVNJhYWKXlSAUaOqhyKbaSQ+3NMEKBYbo5m1aC4B+v1FpKvNZR\n1GEyhWU7hL1JmyBRWGp3Hky1MdouxS3om13h80zBU+HID8WuNb44qz9yHkODftHH\nITbjn1LzV49TvOYqsIdNKcf0PVXCLm41ZRMcBffxXwKBgQDHXcdKMhumet7RD07q\np9SCf/LILZDCyVhG1d6AuEeHdHsczaSASW6aun8qzm0LDaFZ0IkYifDRsqZcdrTU\nbZJDr4Thm+itUc+lVod6+Be8kaN7qXY5Nuu9ri5AlFCv3FKDw6G8TUpPh03KmoIL\nQMfB/uFayBD+Dq/5dspouQzwUwKBgQC+UljyqHsoW94nI4z82nEVyWhIIFiChFT+\nklLFQm70T04lSAt8S+D1CVIhgIXWXYNoiAD3ToOt5qq2pwlbn52EIb5QWUSW/H97\nrosmoDxeSHVd+NPsFJIhbrafuS1HnoOYKhrHuF09Ey6BMDuWBnIOwikNlU3kHoSC\ntswdmoRlcwKBgQDGfX6qR0MyOAjZOhWHGTtCBmNQm9URqebi95HEtDQ7D2R3Y+KQ\n+wtMr7tmggkcxSBMzIuCS+vgy65IRsN47/J8wyZYfKJm1RoYchMHAjSXwKR0vV6A\nTkbdHardDw1aWdApcb/4OzduALcZrUUmMQPxCHOTr7cDSto3U+bn5r2UEwKBgQCk\nRz5Bzo3n60xZakVTKFZ+YMgjoc/kcMdQqgrJ/Cr7tMyWP5ayZmi5+Z6sDlz4COXZ\nv7NdxKbC350xZgMc1CzJlbrJbhRXY4HCx4mTALK7Cz5Lq/F5ENSGCSOXwOZFsJyU\nJpvREuFgS4NTvcdhGxUuigeXku2V34WvsouDbhGj4wKBgQCZj5YRWWIffpxJSC8z\nI+obzcjJplwngL+5JTufftwnFEk64czOtV8MKNEOd6QeT8zssgMx1ltsnbf7iLS9\nTedUCkQloFH345tZWi1SwTMAZTkGf66Q5QKRVybE8k9R8D6GuRRyfh0ms4ZHOo4g\nNn8U3JqeuNH0gIvPM4r4K2IZoQ==\n-----END PRIVATE KEY-----\n",
        client_id: "110683048298389073968"
      };

      // Create JWT with proper claims
      const jwtClaims = {
        iss: credentials.client_email,
        // sub: "webapp-google-admin@aqueous-cargo-406518.iam.gserviceaccount.com", // The user to impersonate
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
        subject: process.env.GOOGLE_ADMIN_EMAIL,
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