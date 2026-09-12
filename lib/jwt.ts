import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-jwt-key-change-me-in-production-32chars"
);

export async function createJWT(payload: {
  sub: string;
  email: string;
  name: string;
  client_id: string;
  scope?: string;
}) {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    client_id: payload.client_id,
    scope: payload.scope || "openid profile email",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("1h")
    .setIssuer(process.env.NEXTAUTH_URL || "http://localhost:3000")
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export function generateRandomToken(length = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
