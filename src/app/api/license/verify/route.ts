// POST /api/license/verify — desktop app verifies a license key
// Public endpoint (no auth required — the key itself is the credential)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyLicenseKey } from "@/lib/license/keygen";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, deviceInfo } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json({ valid: false, error: "请提供激活码" }, { status: 400 });
    }

    const trimmed = key.trim().toUpperCase();

    // 1. Format check
    if (!verifyLicenseKey(trimmed)) {
      return NextResponse.json({ valid: false, error: "激活码格式无效" });
    }

    // 2. Look up in database
    const record = await prisma.licenseKey.findUnique({
      where: { key: trimmed },
      include: { product: true }
    });

    if (!record) {
      return NextResponse.json({ valid: false, error: "激活码不存在" });
    }

    // 3. Check expiry
    if (record.expiredAt && record.expiredAt < new Date()) {
      return NextResponse.json({ valid: false, error: "激活码已过期" });
    }

    // 4. If not yet activated, activate now
    if (!record.activated) {
      await prisma.licenseKey.update({
        where: { id: record.id },
        data: {
          activated: true,
          activatedAt: new Date(),
          deviceInfo: deviceInfo || null
        }
      });
      return NextResponse.json({
        valid: true,
        activated: true,
        firstActivation: true,
        product: record.product.name
      });
    }

    // 5. Already activated — still valid
    return NextResponse.json({
      valid: true,
      activated: true,
      firstActivation: false,
      product: record.product.name
    });

  } catch (e: any) {
    console.error("Verify error:", e);
    return NextResponse.json({ valid: false, error: "验证服务异常" }, { status: 500 });
  }
}
