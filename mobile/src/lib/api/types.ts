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

// GET /api/v1/cards  (Bearer)
export type CardListResponse = {
  cards: CardSummary[];
};

export type CardSummary = {
  id: string;
  slug: string | null;
  templateId: number;
  contactName: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  updatedAt: string;
};

// GET /api/v1/cards/:id  (Bearer) — placeholder, extend in C7.4
export type CardDetailResponse = CardSummary & {
  // Full card fields will be added during C7.4 (card detail screen)
  [key: string]: unknown;
};

// Generic API error shape returned by the backend
export type ApiError = {
  error: string;
  message?: string;
  statusCode?: number;
};
