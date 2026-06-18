// POST /api/license/orders/[id]/approve — admin approves order, generates key
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { generateLicenseKey } from "@/lib/license/keygen";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { licenseKey: true }
    });

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }
    if (order.status !== "pending") {
      return NextResponse.json({ error: "订单已处理" }, { status: 400 });
    }
    if (order.licenseKey) {
      return NextResponse.json({ error: "激活码已生成" }, { status: 400 });
    }

    // Generate unique key (retry on collision)
    let keyStr: string;
    let attempts = 0;
    while (true) {
      keyStr = generateLicenseKey();
      const existing = await prisma.licenseKey.findUnique({ where: { key: keyStr } });
      if (!existing) break;
      attempts++;
      if (attempts > 100) {
        return NextResponse.json({ error: "生成激活码失败，请重试" }, { status: 500 });
      }
    }

    // Create license key + update order atomically
    const [licenseKey] = await prisma.$transaction([
      prisma.licenseKey.create({
        data: {
          key: keyStr,
          productId: order.productId,
          orderId: order.id,
          userId: order.userId
        }
      }),
      prisma.order.update({
        where: { id },
        data: { status: "approved" }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: "审核通过，激活码已生成",
      key: licenseKey.key
    });

  } catch (e: any) {
    console.error("Approve error:", e);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
