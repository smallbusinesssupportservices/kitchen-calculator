
import OAuthClient from 'intuit-oauth';

let oauthClient = null;

export function initializeOAuthClient(config) {
    oauthClient = new OAuthClient(config);
    return oauthClient;
}

export function getOAuthClient() {
    if (!oauthClient) {
        throw new Error('OAuth client has not been initialized.');
    }
    return oauthClient;
}

export function setOAuthClient(newClient) {
    oauthClient = newClient;
}
