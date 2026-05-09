// -----------------------------------------------------------------------
// Sprint F4 — Inbox messaging API client.
//
// Wraps `/api/v1/connections/:id/messages` for the mobile thread screen.
// Both endpoints are bearer-auth gated; the server enforces that the
// requester sits on one side of the connection.
// -----------------------------------------------------------------------

import { apiFetch } from './client';

export type ChatMessage = {
  id: string;
  senderUserId: string;
  body: string;
  sentAt: string;
  readAt: string | null;
};

/**
 * Other side of the connection — used to render the thread header.
 */
export type ChatOtherParty = {
  cardId: string;
  slug: string | null;
  name: string | null;
  title: string | null;
  company: string | null;
  photoPath: string | null;
};

/**
 * Latest pending CardAction between the two cards where the requester is
 * the receiver. Drives the accept/decline pill on the thread header.
 */
export type ChatPendingAction = {
  id: string;
  type: string;
  message: string | null;
  createdAt: string;
};

export type ListMessagesResponse = {
  messages: ChatMessage[];
  other: ChatOtherParty;
  pendingAction: ChatPendingAction | null;
};

export type SendMessageResponse = {
  message: ChatMessage;
};

export async function listMessages(
  connectionId: string,
): Promise<ListMessagesResponse> {
  return apiFetch<ListMessagesResponse>(
    `/api/v1/connections/${encodeURIComponent(connectionId)}/messages`,
  );
}

export async function sendMessage(
  connectionId: string,
  body: string,
): Promise<SendMessageResponse> {
  return apiFetch<SendMessageResponse>(
    `/api/v1/connections/${encodeURIComponent(connectionId)}/messages`,
    {
      method: 'POST',
      body: JSON.stringify({ body }),
    },
  );
}
