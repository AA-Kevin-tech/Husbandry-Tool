import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: teamId } = await params;
  const member = await prisma.teamMember.findFirst({
    where: { teamId, userId: appUser.id },
    include: { team: true },
  });
  if (!member || member.team.facilityId !== appUser.facilityId)
    return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const cursor = searchParams.get("cursor");

  const messages = await prisma.chatMessage.findMany({
    where: { teamId },
    include: { sender: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor
      ? { cursor: { id: cursor }, skip: 1 }
      : {}),
  });

  const nextCursor = messages.length > limit ? messages[limit - 1]?.id : null;
  const list = messages.slice(0, limit).reverse();

  return NextResponse.json({ messages: list, nextCursor });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: teamId } = await params;
  const member = await prisma.teamMember.findFirst({
    where: { teamId, userId: appUser.id },
    include: { team: true },
  });
  if (!member || member.team.facilityId !== appUser.facilityId)
    return NextResponse.json({ error: "Team not found" }, { status: 404 });

  const body = await request.json();
  const { body: messageBody } = body as { body?: string };
  if (!messageBody || typeof messageBody !== "string" || !messageBody.trim())
    return NextResponse.json(
      { error: "body is required" },
      { status: 400 }
    );

  const message = await prisma.chatMessage.create({
    data: {
      teamId,
      senderId: appUser.id,
      body: messageBody.trim().slice(0, 4000),
    },
    include: { sender: { select: { id: true, name: true, email: true } } },
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  await supabase.channel(`team:${teamId}`).send({
    type: "broadcast",
    event: "message",
    payload: message,
  });

  return NextResponse.json(message);
}
