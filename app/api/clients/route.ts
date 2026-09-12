import { NextRequest, NextResponse } from "next/server";
import { clients } from "@/lib/store";
import { generateRandomToken } from "@/lib/jwt";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const list = Array.from(clients.values()).map((c) => ({
    id: c.id,
    name: c.name,
    clientId: c.clientId,
    clientSecret: c.clientSecret,
    redirectUris: c.redirectUris,
    createdAt: c.createdAt,
  }));
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, redirectUris } = body;

  if (!name || !redirectUris || !Array.isArray(redirectUris) || redirectUris.length === 0) {
    return NextResponse.json(
      { error: "name and redirectUris are required" },
      { status: 400 }
    );
  }

  const clientId = `client_${generateRandomToken(16)}`;
  const clientSecret = `secret_${generateRandomToken(32)}`;

  const newClient = {
    id: uuidv4(),
    name,
    clientId,
    clientSecret,
    redirectUris,
    createdAt: new Date().toISOString(),
  };

  clients.set(clientId, newClient);

  return NextResponse.json(newClient, { status: 201 });
}
