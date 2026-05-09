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

/**
 * Sprint F4 — last-message preview surfaced on the inbox row so the list can
 * show "you: hi" or "Aylin: thanks!" without a separate request.
 */
export type InboxLastMessage = {
  body: string;
  sentAt: string;
  senderUserId: string;
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
  /**
   * Sprint F4 — id of the CardConnection between sender and receiver. The
   * server lazily upserts a connection when one is missing, so this is only
   * null when sender === receiver (an edge case the inbox shouldn't surface).
   */
  connectionId: string | null;
  /** Last message on the connection thread, or null when the thread is empty. */
  lastMessage: InboxLastMessage | null;
  /** Count of messages the requester hasn't read yet on that thread. */
  unreadCount: number;
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
