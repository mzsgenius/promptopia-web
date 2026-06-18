// POST /api/license/seed — create the initial product (admin only)
// Run once after deployment to set up the product
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if product already exists
  const existing = await prisma.licenseProduct.findFirst({ where: { active: true } });
  if (existing) {
    return NextResponse.json({
      message: "产品已存在",
      product: existing
    });
  }

  const product = await prisma.licenseProduct.create({
    data: {
      name: "AI项目导师 · 专业版",
      price: 3990, // ¥39.9 in fen
      duration: null, // lifetime
      active: true
    }
  });

  return NextResponse.json({
    success: true,
    message: "产品创建成功",
    product
  });
}
