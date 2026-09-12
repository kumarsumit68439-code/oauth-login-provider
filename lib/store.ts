/**
 * Simple in-memory store for OAuth clients, codes, and tokens.
 * For production: replace with Postgres / Supabase / MongoDB.
 */

export interface OAuthClient {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  createdAt: string;
  // Optional provider configs (for future use)
  googleClientId?: string;
  googleClientSecret?: string;
  githubClientId?: string;
  githubClientSecret?: string;
}

export interface AuthCode {
  code: string;
  clientId: string;
  redirectUri: string;
  userId: string;
  userEmail: string;
  userName: string;
  scope: string;
  expiresAt: number;
}

export interface AccessToken {
  token: string;
  clientId: string;
  userId: string;
  userEmail: string;
  userName: string;
  scope: string;
  expiresAt: number;
}

// Global store (survives in same serverless instance, resets on cold start)
const globalForStore = globalThis as unknown as {
  oauthClients: Map<string, OAuthClient>;
  authCodes: Map<string, AuthCode>;
  accessTokens: Map<string, AccessToken>;
};

if (!globalForStore.oauthClients) {
  globalForStore.oauthClients = new Map();
  globalForStore.authCodes = new Map();
  globalForStore.accessTokens = new Map();
}

export const clients = globalForStore.oauthClients;
export const authCodes = globalForStore.authCodes;
export const accessTokens = globalForStore.accessTokens;

// Seed a demo client
if (clients.size === 0) {
  const demoClient: OAuthClient = {
    id: "demo-1",
    name: "Demo App",
    clientId: "demo_client_id_12345",
    clientSecret: "demo_client_secret_67890",
    redirectUris: ["http://localhost:3001/callback", "https://example.com/callback"],
    createdAt: new Date().toISOString(),
  };
  clients.set(demoClient.clientId, demoClient);
}
