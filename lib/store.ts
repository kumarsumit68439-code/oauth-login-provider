/**
 * In-memory store for Users + OAuth clients/codes/tokens.
 * Production: replace with Postgres / Supabase / MongoDB.
 */

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
  provider?: string; // "credentials" | "google" | "github"
}

export interface OAuthClient {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  createdAt: string;
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

const globalForStore = globalThis as unknown as {
  users: Map<string, User>;
  usersByEmail: Map<string, User>;
  oauthClients: Map<string, OAuthClient>;
  authCodes: Map<string, AuthCode>;
  accessTokens: Map<string, AccessToken>;
};

if (!globalForStore.users) {
  globalForStore.users = new Map();
  globalForStore.usersByEmail = new Map();
  globalForStore.oauthClients = new Map();
  globalForStore.authCodes = new Map();
  globalForStore.accessTokens = new Map();
}

export const users = globalForStore.users;
export const usersByEmail = globalForStore.usersByEmail;
export const clients = globalForStore.oauthClients;
export const authCodes = globalForStore.authCodes;
export const accessTokens = globalForStore.accessTokens;

// Seed demo OAuth client
if (clients.size === 0) {
  const demoClient: OAuthClient = {
    id: "demo-1",
    name: "Demo App",
    clientId: "demo_client_id_12345",
    clientSecret: "demo_client_secret_67890",
    redirectUris: [
      "http://localhost:3001/callback",
      "https://example.com/callback",
    ],
    createdAt: new Date().toISOString(),
  };
  clients.set(demoClient.clientId, demoClient);
}
