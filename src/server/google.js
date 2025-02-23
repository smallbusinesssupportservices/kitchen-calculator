import { googleDirectoryService } from './google/googleDirectoryService.js';
import { verifyGoogleToken } from './auth/googleAuth.js';

export const signInWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    const authResult = await verifyGoogleToken(token);
    res.json(authResult);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      authorized: false,
      message: 'Authentication failed'
    });
  }
}

export const orgUnits = async (req, res) => {
  try {
    const OrgUnits = await googleDirectoryService.getOrgUnits();
    res.json(OrgUnits);
  } catch (error) {
    console.error('Failed to get users:', error);
    res.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: 'Failed to get users'
    });
  }
}

export const members = async (req, res) => {
    try {
      const members = await googleDirectoryService.getGroupMembers(req.params.groupKey);
      res.json(members);
    } catch (error) {
      console.error(`Failed to get members for group ${req.params.groupKey}:`, error);
      res.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: req.url,
        message: `Failed to get members for group ${req.params.groupKey}`
      });
    }
  }

  export const groups = async (req, res) => {
    try {
      const groups = await googleDirectoryService.getGroups();
      res.json(groups);
    } catch (error) {
      console.error('Failed to get groups:', error);
      res.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: req.url,
        message: 'Failed to get groups'
      });
    }
  }

  export const users = async (req, res) => {
    try {
      const users = await googleDirectoryService.getUsers();
      res.json(users);
    } catch (error) {
      console.error('Failed to get users:', error);
      res.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: req.url,
        message: 'Failed to get users'
      });
    }
  }