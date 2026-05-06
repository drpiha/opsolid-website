// -----------------------------------------------------------------------
// OpSolid API response types — mirrors /api/v1/* (Hat B JWT endpoints).
// Keep in sync with the OpenAPI spec at GET /api/v1/openapi.json.
// -----------------------------------------------------------------------

// POST /api/v1/auth/login  {email, password}
// POST /api/v1/auth/refresh {refreshToken}
export type AuthLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

// GET /api/v1/auth/me  (Bearer)
export type AuthMeResponse = {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  emailVerifiedAt: string | null;
};

// POST /api/v1/auth/magic-link  {email, locale}  → 202 no body

// -----------------------------------------------------------------------
// Card types — full ApiCard shape mirrors OpenAPI spec.
// CardSummary is kept for backward compat (C7.1 code).
// New code should use ApiCard.
// -----------------------------------------------------------------------

export type CardStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

// Full card shape — GET /api/v1/cards/{id} and GET /api/v1/cards items
export type ApiCard = {
  id: string;
  slug: string | null;
  status: CardStatus;
  templateId: number;
  layoutKey: string | null;
  themeKey: string | null;
  cardData: Record<string, unknown>;
  brandPrimaryHex: string | null;
  brandAccentHex: string | null;
  photoPath: string | null;
  logoPath: string | null;
  qrStyle: Record<string, unknown> | null;
  videoUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// GET /api/v1/cards (Bearer) — cursor-paginated list
export type CardListResponse = {
  items: ApiCard[];
  nextCursor: string | null;
};

// GET /api/v1/cards/:id (Bearer)
export type CardDetailResponse = { card: ApiCard };

// DELETE /api/v1/cards/:id (Bearer)
export type CardDeleteResponse = { ok: true; id: string };

// Backward-compat summary shape from C7.1 — kept so existing imports don't break.
// Prefer ApiCard for new code.
export type CardSummary = {
  id: string;
  slug: string | null;
  templateId: number;
  contactName: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  updatedAt: string;
};

// Generic API error shape returned by the backend
export type ApiError = {
  error: string;
  message?: string;
  statusCode?: number;
};

// POST /api/v1/cards
export type CardCreateInput = {
  templateId: number;
  cardData: {
    name: string;
    email?: string;
    phone?: string;
    title?: string;
    company?: string;
  };
  desiredSlug?: string;
};

// PATCH /api/v1/cards/:id
export type CardPatchInput = {
  cardData?: {
    name?: string;
    email?: string;
    phone?: string;
    title?: string;
    company?: string;
  };
  photoPath?: string | null;
  logoPath?: string | null;
  status?: 'PUBLISHED' | 'CANCELLED';
  slug?: string;
};

// POST /api/uploads → { path }
export type UploadResponse = { path: string };
