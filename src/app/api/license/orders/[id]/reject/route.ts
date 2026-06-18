// POST /api/license/orders/[id]/reject — admin rejects order
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

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
    const body = await req.json().catch(() => ({}));
    const reason = body.reason || "";

    await prisma.order.update({
      where: { id },
      data: {
        status: "rejected",
        adminNotes: reason || "管理员拒绝了此订单"
      }
    });

    return NextResponse.json({ success: true, message: "订单已拒绝" });

  } catch (e: any) {
    console.error("Reject error:", e);
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
