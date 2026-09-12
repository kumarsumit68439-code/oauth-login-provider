import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { accessTokens } from "@/lib/store";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = auth.slice(7);

  // Try JWT first
  const payload = await verifyJWT(token);
  if (payload) {
    return NextResponse.json({
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      client_id: payload.client_id,
    });
  }

  // Fallback to bearer token store
  const stored = accessTokens.get(token);
  if (stored && stored.expiresAt > Date.now()) {
    return NextResponse.json({
      sub: stored.userId,
      email: stored.userEmail,
      name: stored.userName,
      client_id: stored.clientId,
    });
  }

  return NextResponse.json({ error: "invalid_token" }, { status: 401 });
}
