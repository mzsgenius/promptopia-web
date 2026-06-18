// GET /api/license/keys — list all license keys (admin only)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await prisma.licenseKey.findMany({
    include: {
      product: { select: { name: true } },
      order: { select: { userName: true, userContact: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(keys);
}
