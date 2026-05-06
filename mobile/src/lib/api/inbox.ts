import { apiFetch } from './client';

export type InboxActionType =
  | 'request_contact'
  | 'request_quote'
  | 'request_meeting'
  | 'send_card'
  | 'ask_collaboration'
  | 'give_feedback';

export type InboxActionStatus = 'pending' | 'accepted' | 'declined' | 'archived';

export type InboxSender = {
  slug: string | null;
  name: string | null;
  title: string | null;
  company: string | null;
  photoPath: string | null;
};

export type InboxItem = {
  id: string;
  type: InboxActionType;
  status: InboxActionStatus;
  message: string | null;
  createdAt: string;
  resolvedAt: string | null;
  sender: InboxSender;
  receiverSlug: string | null;
};

export type InboxResponse = { items: InboxItem[] };

export async function listInbox(status?: string): Promise<InboxResponse> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiFetch<InboxResponse>(`/api/account/inbox${qs}`);
}

export async function resolveAction(
  id: string,
  status: 'accepted' | 'declined' | 'archived',
): Promise<{ id: string; status: string; resolvedAt: string }> {
  return apiFetch<{ id: string; status: string; resolvedAt: string }>(
    `/api/account/inbox/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
  );
}
