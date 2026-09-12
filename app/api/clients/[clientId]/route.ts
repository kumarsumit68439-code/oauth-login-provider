import { NextRequest, NextResponse } from "next/server";
import { clients } from "@/lib/store";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  if (!clients.has(params.clientId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  clients.delete(params.clientId);
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const client = clients.get(params.clientId);
  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  if (body.name) client.name = body.name;
  if (body.redirectUris) client.redirectUris = body.redirectUris;

  clients.set(params.clientId, client);
  return NextResponse.json(client);
}
