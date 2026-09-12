import { NextRequest, NextResponse } from "next/server";
import { clients, authCodes, accessTokens } from "@/lib/store";
import { createJWT, generateRandomToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let body: Record<string, string> = {};

  if (contentType.includes("application/json")) {
    body = await req.json();
  } else {
    const formData = await req.formData();
    formData.forEach((value, key) => {
      body[key] = value.toString();
    });
  }

  const grantType = body.grant_type;
  const code = body.code;
  const redirectUri = body.redirect_uri;
  const clientId = body.client_id;
  const clientSecret = body.client_secret;

  if (grantType !== "authorization_code") {
    return NextResponse.json(
      { error: "unsupported_grant_type" },
      { status: 400 }
    );
  }

  if (!code || !clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "invalid_request", error_description: "Missing parameters" },
      { status: 400 }
    );
  }

  const client = clients.get(clientId);
  if (!client || client.clientSecret !== clientSecret) {
    return NextResponse.json(
      { error: "invalid_client" },
      { status: 401 }
    );
  }

  const authCode = authCodes.get(code);
  if (!authCode || authCode.expiresAt < Date.now()) {
    return NextResponse.json(
      { error: "invalid_grant", error_description: "Code expired or invalid" },
      { status: 400 }
    );
  }

  if (authCode.clientId !== clientId || authCode.redirectUri !== redirectUri) {
    return NextResponse.json(
      { error: "invalid_grant" },
      { status: 400 }
    );
  }

  // Consume the code
  authCodes.delete(code);

  // Create access token (JWT)
  const accessToken = await createJWT({
    sub: authCode.userId,
    email: authCode.userEmail,
    name: authCode.userName,
    client_id: clientId,
    scope: authCode.scope,
  });

  const bearerToken = generateRandomToken(48);
  accessTokens.set(bearerToken, {
    token: bearerToken,
    clientId,
    userId: authCode.userId,
    userEmail: authCode.userEmail,
    userName: authCode.userName,
    scope: authCode.scope,
    expiresAt: Date.now() + 3600 * 1000,
  });

  return NextResponse.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    scope: authCode.scope,
    // Also return a simple bearer for convenience
    bearer_token: bearerToken,
    id_token: accessToken, // for OIDC compatibility
  });
}
