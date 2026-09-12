import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { clients, authCodes } from "@/lib/store";
import { generateRandomToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const responseType = searchParams.get("response_type");
  const scope = searchParams.get("scope") || "openid profile email";
  const state = searchParams.get("state") || "";

  if (!clientId || !redirectUri || responseType !== "code") {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Missing required parameters" },
      { status: 400 }
    );
  }

  const client = clients.get(clientId);
  if (!client) {
    return NextResponse.json(
      { error: "invalid_client", error_description: "Unknown client_id" },
      { status: 400 }
    );
  }

  if (!client.redirectUris.includes(redirectUri)) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "redirect_uri not registered" },
      { status: 400 }
    );
  }

  // Check if user is already logged in
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // Redirect to login page with return params
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("client_id", clientId);
    loginUrl.searchParams.set("redirect_uri", redirectUri);
    loginUrl.searchParams.set("scope", scope);
    loginUrl.searchParams.set("state", state);
    loginUrl.searchParams.set("response_type", "code");
    return NextResponse.redirect(loginUrl);
  }

  // User is logged in → generate auth code and redirect back
  const code = generateRandomToken(40);
  authCodes.set(code, {
    code,
    clientId,
    redirectUri,
    userId: (session.user as any).id || session.user.email || "unknown",
    userEmail: session.user.email || "",
    userName: session.user.name || "",
    scope,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  const redirect = new URL(redirectUri);
  redirect.searchParams.set("code", code);
  if (state) redirect.searchParams.set("state", state);

  return NextResponse.redirect(redirect.toString());
}
