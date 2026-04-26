"use client";

import { useRouter } from "next/navigation";
import HandoffRuleList, {
  type HandoffRule,
} from "@/components/voice/dashboard/HandoffRuleList";

interface HandoffRulesClientProps {
  tenantId: string;
  token: string;
  rules: HandoffRule[];
}

export default function HandoffRulesClient({
  tenantId,
  token,
  rules,
}: HandoffRulesClientProps) {
  const router = useRouter();
  return (
    <HandoffRuleList
      tenantId={tenantId}
      token={token}
      rules={rules}
      onUpdate={() => router.refresh()}
    />
  );
}
