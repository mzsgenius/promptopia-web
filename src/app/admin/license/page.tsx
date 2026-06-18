"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Order = {
  id: string;
  userName: string;
  userEmail: string | null;
  userContact: string;
  amount: number;
  paymentProof: string;
  status: "pending" | "approved" | "rejected";
  adminNotes: string | null;
  createdAt: string;
  product: { name: string; price: number };
  licenseKey: { key: string; activated: boolean; createdAt: string } | null;
};

type LicenseKey = {
  id: string;
  key: string;
  activated: boolean;
  activatedAt: string | null;
  deviceInfo: string | null;
  createdAt: string;
  product: { name: string };
  order: { userName: string; userContact: string } | null;
};

type Tab = "orders" | "keys";

export default function AdminLicensePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/license/orders");
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      if (data.error) { router.push("/login"); return; }
      setOrders(data);
    } catch {
      setError(true);
    }
  };

  const loadKeys = async () => {
    try {
      const res = await fetch("/api/license/keys");
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      if (data.error) { router.push("/login"); return; }
      setKeys(data);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    Promise.all([loadOrders(), loadKeys()]).finally(() => setLoading(false));
  }, [router]);

  const handleApprove = async (orderId: string) => {
    const res = await fetch(`/api/license/orders/${orderId}/approve`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      toast.success(`激活码已生成: ${data.key}`);
      loadOrders();
      loadKeys();
    } else {
      toast.error(data.error || "操作失败");
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt("输入拒绝原因（可选）：");
    const res = await fetch(`/api/license/orders/${orderId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reason || undefined })
    });
    const data = await res.json();
    if (data.success) {
      toast.success("订单已拒绝");
      loadOrders();
    } else {
      toast.error(data.error || "操作失败");
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">加载中...</div>;
  if (error) return <div className="p-8 text-center text-muted-foreground">加载失败</div>;

  const pendingOrders = orders.filter(o => o.status === "pending");
  const approvedOrders = orders.filter(o => o.status === "approved");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">许可证管理</h1>
        <div className="flex gap-2 bg-muted rounded-lg p-1">
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              tab === "orders" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
            }`}
          >
            订单 ({pendingOrders.length})
          </button>
          <button
            onClick={() => setTab("keys")}
            className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
              tab === "keys" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
            }`}
          >
            激活码 ({keys.length})
          </button>
        </div>
      </div>

      {tab === "orders" && (
        <div className="space-y-4">
          {/* Pending orders */}
          {pendingOrders.map(order => (
            <div key={order.id} className="border rounded-xl p-4 bg-amber-50/30 border-amber-200/50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 mb-2">
                    待审核
                  </span>
                  <h3 className="font-semibold">{order.userName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.userContact} · {order.userEmail || "无邮箱"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">¥{(order.amount / 100).toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("zh-CN")}
                  </div>
                </div>
              </div>

              <div className="bg-background rounded-lg p-3 mb-3">
                <div className="text-xs text-muted-foreground mb-1">付款凭证（订单号/截图说明）</div>
                <div className="text-sm font-mono bg-muted/50 rounded px-2 py-1 break-all">
                  {order.paymentProof}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(order.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  ✓ 通过并生成激活码
                </button>
                <button
                  onClick={() => handleReject(order.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                >
                  ✕ 拒绝
                </button>
              </div>
            </div>
          ))}

          {/* Approved orders */}
          {approvedOrders.length > 0 && (
            <>
              <h2 className="text-lg font-semibold pt-4">已处理订单</h2>
              {approvedOrders.map(order => (
                <div key={order.id} className="border rounded-xl p-4 bg-green-50/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 mb-2">
                        ✓ 已通过
                      </span>
                      <h3 className="font-semibold">{order.userName}</h3>
                      <p className="text-sm text-muted-foreground">{order.userContact}</p>
                    </div>
                    <div className="text-right">
                      {order.licenseKey && (
                        <div>
                          <div className="text-xs text-muted-foreground">激活码</div>
                          <div className="font-mono text-sm font-bold tracking-wider">
                            {order.licenseKey.key}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {order.licenseKey.activated ? "✅ 已激活" : "⏳ 未使用"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {orders.length === 0 && (
            <p className="text-center text-muted-foreground py-12">暂无订单</p>
          )}
        </div>
      )}

      {tab === "keys" && (
        <div className="overflow-x-auto">
          {keys.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">暂无激活码</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground text-xs">
                  <th className="text-left py-2 px-2">激活码</th>
                  <th className="text-left py-2 px-2">用户</th>
                  <th className="text-left py-2 px-2">状态</th>
                  <th className="text-left py-2 px-2">激活时间</th>
                  <th className="text-left py-2 px-2">设备</th>
                  <th className="text-left py-2 px-2">创建时间</th>
                </tr>
              </thead>
              <tbody>
                {keys.map(k => (
                  <tr key={k.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2 px-2 font-mono text-xs font-bold tracking-wider">{k.key}</td>
                    <td className="py-2 px-2">
                      {k.order ? `${k.order.userName} (${k.order.userContact})` : "—"}
                    </td>
                    <td className="py-2 px-2">
                      {k.activated ? (
                        <span className="text-green-600 font-medium">已激活</span>
                      ) : (
                        <span className="text-amber-600">未使用</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-xs text-muted-foreground">
                      {k.activatedAt ? new Date(k.activatedAt).toLocaleString("zh-CN") : "—"}
                    </td>
                    <td className="py-2 px-2 text-xs text-muted-foreground max-w-[200px] truncate">
                      {k.deviceInfo || "—"}
                    </td>
                    <td className="py-2 px-2 text-xs text-muted-foreground">
                      {new Date(k.createdAt).toLocaleString("zh-CN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
