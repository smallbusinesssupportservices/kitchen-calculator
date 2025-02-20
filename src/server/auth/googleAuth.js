import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Verify the email domain matches your organization
    if (!email.endsWith('@' + process.env.GOOGLE_DOMAIN)) {
      return {
        authorized: false,
        message: 'Invalid email domain'
      };
    }

    // Create a session token
    const sessionToken = jwt.sign(
      { 
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      authorized: true,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      },
      token: sessionToken
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return {
      authorized: false,
      message: 'Token verification failed'
    };
  }
}