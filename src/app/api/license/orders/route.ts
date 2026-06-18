// GET /api/license/orders — list all orders (admin only)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // optional filter

  const where: any = {};
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: {
      product: { select: { name: true, price: true } },
      licenseKey: { select: { key: true, activated: true, createdAt: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(orders);
}
