import { NextResponse } from "next/server";
import { getAppUser } from "@/lib/auth-server";
import { prisma } from "@/lib/db";

export async function GET() {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const labels = await prisma.label.findMany({
    where: { facilityId: appUser.facilityId },
    orderBy: [{ type: "asc" }, { text: "asc" }],
  });
  return NextResponse.json(labels);
}

export async function POST(request: Request) {
  const appUser = await getAppUser();
  if (!appUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (appUser.role !== "Admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { type, text, color } = body as { type?: string; text?: string; color?: string };
  const validTypes = ["general", "section", "medical", "business", "animal", "daily_report"];
  if (!type || !validTypes.includes(type))
    return NextResponse.json(
      { error: "type is required and must be one of: " + validTypes.join(", ") },
      { status: 400 }
    );

  const label = await prisma.label.create({
    data: {
      facilityId: appUser.facilityId,
      type: type as "general" | "section" | "medical" | "business" | "animal" | "daily_report",
      text: typeof text === "string" ? text : null,
      color: typeof color === "string" && color ? color : "#6b7280",
    },
  });
  return NextResponse.json(label);
}
