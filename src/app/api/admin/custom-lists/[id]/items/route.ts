import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: listTypeId } = await params;
  const listType = await prisma.customListType.findFirst({
    where: { id: listTypeId, facilityId: appUser.facilityId },
  });
  if (!listType)
    return NextResponse.json({ error: "List type not found" }, { status: 404 });

  const body = await request.json();
  const { value, sortOrder } = body as { value?: string; sortOrder?: number };
  if (!value || typeof value !== "string" || !value.trim())
    return NextResponse.json(
      { error: "value is required" },
      { status: 400 }
    );

  const maxOrder = await prisma.customListItem.aggregate({
    where: { listTypeId },
    _max: { sortOrder: true },
  });
  const order = typeof sortOrder === "number" ? sortOrder : (maxOrder._max.sortOrder ?? -1) + 1;

  const item = await prisma.customListItem.create({
    data: { listTypeId, value: value.trim(), sortOrder: order },
  });
  return NextResponse.json(item);
}
