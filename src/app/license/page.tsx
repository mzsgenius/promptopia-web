"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function LicensePage() {
  const [step, setStep] = useState<"info" | "pay" | "submit" | "done">("info");
  const [form, setForm] = useState({ userName: "", userContact: "", paymentProof: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.userName || !form.userContact || !form.paymentProof) {
      toast.error("请填写完整信息");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/license/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("订单已提交，等待管理员审核");
        setStep("done");
      } else {
        toast.error(data.error || "提交失败");
      }
    } catch {
      toast.error("网络错误");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl mb-2">✦</div>
          <h1 className="text-2xl font-bold">AI项目导师</h1>
          <p className="text-muted-foreground text-sm mt-1">专业版激活码购买</p>
        </div>

        {/* Step: Info */}
        {step === "info" && (
          <div className="border rounded-2xl p-6 bg-card shadow-sm">
            <h2 className="text-lg font-semibold mb-2">AI项目导师 · 专业版</h2>
            <div className="text-3xl font-bold mb-4">
              ¥39.9
              <span className="text-sm font-normal text-muted-foreground ml-2">永久使用</span>
            </div>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 解锁所有分析报告完整内容
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 无限次项目分析
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 完整 MVP 方案规划
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 7-30-90 天执行路线图
              </li>
            </ul>
            <button
              onClick={() => setStep("pay")}
              className="w-full py-3 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              立即购买
            </button>
          </div>
        )}

        {/* Step: Pay instructions */}
        {step === "pay" && (
          <div className="border rounded-2xl p-6 bg-card shadow-sm">
            <h2 className="text-lg font-semibold mb-4">微信支付</h2>

            <div className="bg-muted rounded-xl p-4 mb-4 text-center">
              <div className="text-sm text-muted-foreground mb-2">请使用微信扫描二维码付款</div>
              <div className="w-48 h-48 mx-auto bg-muted-foreground/10 rounded-xl flex items-center justify-center mb-2">
                <span className="text-4xl opacity-30">[QR]</span>
              </div>
              <div className="text-lg font-bold">¥39.9</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800 mb-4">
              <strong>付款后请截图保存</strong>，下一步需要提交付款凭证（订单号或截图说明）
            </div>

            <button
              onClick={() => setStep("submit")}
              className="w-full py-3 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              我已付款，提交凭证
            </button>
            <button
              onClick={() => setStep("info")}
              className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
            >
              ← 返回
            </button>
          </div>
        )}

        {/* Step: Submit order */}
        {step === "submit" && (
          <div className="border rounded-2xl p-6 bg-card shadow-sm">
            <h2 className="text-lg font-semibold mb-4">提交付款凭证</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">你的名字</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                  placeholder="如：张三"
                  value={form.userName}
                  onChange={e => setForm(f => ({ ...f, userName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">微信号 / 手机号</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                  placeholder="用于接收激活码"
                  value={form.userContact}
                  onChange={e => setForm(f => ({ ...f, userContact: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">付款凭证</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg bg-background text-sm"
                  placeholder="微信交易单号 或 截图文件名"
                  value={form.paymentProof}
                  onChange={e => setForm(f => ({ ...f, paymentProof: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  微信 → 我 → 服务 → 钱包 → 账单 → 找到这笔交易 → 复制交易单号
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? "提交中..." : "提交订单"}
              </button>

              <button
                onClick={() => setStep("pay")}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← 返回付款页
              </button>
            </div>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div className="border rounded-2xl p-6 bg-card shadow-sm text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-lg font-semibold mb-2">订单已提交</h2>
            <p className="text-sm text-muted-foreground mb-6">
              管理员审核通过后，激活码将通过你留下的联系方式发送。<br />
              通常 24 小时内处理。
            </p>
            <p className="text-xs text-muted-foreground">
              如有疑问，请联系管理员
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
