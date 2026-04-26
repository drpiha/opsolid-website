"use client";

import { useRouter } from "next/navigation";
import KnowledgeBaseEditor, {
  type KnowledgeBaseItem,
} from "@/components/voice/dashboard/KnowledgeBaseEditor";

interface KnowledgeBaseClientProps {
  tenantId: string;
  token: string;
  items: KnowledgeBaseItem[];
}

export default function KnowledgeBaseClient({
  tenantId,
  token,
  items,
}: KnowledgeBaseClientProps) {
  const router = useRouter();
  return (
    <KnowledgeBaseEditor
      tenantId={tenantId}
      token={token}
      items={items}
      onUpdate={() => router.refresh()}
    />
  );
}
