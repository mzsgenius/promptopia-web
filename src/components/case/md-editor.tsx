"use client";

// Markdown editor with image upload support
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function MarkdownEditor({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;
        await uploadImage(file);
      }
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/case/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "上传失败");
        return;
      }

      const { url } = await res.json();
      const imageMd = `![image](${url})`;
      onChange(value + "\n" + imageMd);
      toast.success("图片已上传");
    } catch {
      toast.error("上传失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-color-mode="light" className="flex flex-col gap-1.5">
      <Label>正文（支持 Markdown）*</Label>
      <div
        onPaste={handlePaste}
        className="min-h-[400px] rounded-lg border"
      >
        <MDEditor
          value={value}
          onChange={(val) => onChange(val ?? "")}
          height={500}
          preview="live"
          visibleDragbar={false}
        />
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>支持 Markdown 语法</span>
        <span>·</span>
        <span>拖拽 / Ctrl+V 粘贴图片自动上传</span>
        {uploading && <span className="text-primary">上传中...</span>}
      </div>
    </div>
  );
}
