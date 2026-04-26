"use client";

import { useRouter } from "next/navigation";
import AgentForm, {
  type AgentLike,
} from "@/components/voice/dashboard/AgentForm";

interface NewAgentFormProps {
  tenantId: string;
  tenantSlug: string;
  token: string;
}

export default function NewAgentForm({
  tenantId,
  tenantSlug,
  token,
}: NewAgentFormProps) {
  const router = useRouter();
  const tokenQ = `?token=${encodeURIComponent(token)}`;

  const onSaved = (agent: AgentLike) => {
    if (agent?.id) {
      router.push(`/voice/${tenantSlug}/agents/${agent.id}${tokenQ}`);
    } else {
      router.push(`/voice/${tenantSlug}/agents${tokenQ}`);
    }
    router.refresh();
  };

  return <AgentForm tenantId={tenantId} token={token} onSaved={onSaved} />;
}
