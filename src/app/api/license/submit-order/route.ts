// POST /api/license/submit-order
// User submits WeChat payment info after paying
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userName, userEmail, userContact, paymentProof } = body;

    if (!userName || !userContact || !paymentProof) {
      return NextResponse.json(
        { error: "请填写姓名、联系方式（微信）和付款凭证" },
        { status: 400 }
      );
    }

    // Get the active product
    const product = await prisma.licenseProduct.findFirst({
      where: { active: true },
      orderBy: { createdAt: "desc" }
    });

    if (!product) {
      return NextResponse.json(
        { error: "暂无可购买的产品" },
        { status: 400 }
      );
    }

    // Get current user (optional — user can order without login)
    const user = await getCurrentUser();

    // Create order
    const order = await prisma.order.create({
      data: {
        productId: product.id,
        userId: user?.id,
        userName,
        userEmail: userEmail || user?.email || null,
        userContact,
        amount: product.price,
        paymentMethod: "wechat",
        paymentProof,
        status: "pending"
      }
    });

    return NextResponse.json({
      success: true,
      message: "订单已提交，管理员审核通过后将自动生成激活码",
      orderId: order.id
    });

  } catch (e: any) {
    console.error("Submit order error:", e);
    return NextResponse.json({ error: "提交失败，请重试" }, { status: 500 });
  }
}
