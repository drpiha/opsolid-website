// =============================================================================
// GET /api/v1/openapi.json — OpenAPI 3.1 machine-readable spec for the v1 API.
//
// Used by the mobile app (C7.3 auth implementation, B0.8 plan) and any
// 3rd-party consumers to introspect endpoints, schemas, and security schemes.
//
// Spec is derived directly from the actual route implementations — not
// auto-generated. Every field listed here is verified against the code.
// No endpoints are invented or omitted.
//
// Cache: 1 hour (CDN-friendly). The spec only changes on deployments.
// =============================================================================

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const spec = {
  openapi: "3.1.0",
  info: {
    title: "OpSolid API v1",
    version: "1.0.0",
    description:
      "OpSolid mobile + 3rd-party API. JWT bearer auth. No cookie-based auth accepted on v1 endpoints.",
    contact: { email: "support@opsolid.de" },
  },
  servers: [{ url: "https://opsolid.de", description: "Production" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      // -------------------------------------------------------------------------
      // Auth
      // -------------------------------------------------------------------------
      AuthLoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", maxLength: 254 },
          password: { type: "string", minLength: 1, maxLength: 1024 },
        },
      },
      AuthResponse: {
        type: "object",
        required: ["accessToken", "refreshToken", "sessionExpiresAt", "user"],
        properties: {
          accessToken: {
            type: "string",
            description: "Short-lived JWT (15 min). Use as Bearer token.",
          },
          refreshToken: {
            type: "string",
            description: "Opaque single-use token (30 days). Rotated on each refresh call.",
          },
          sessionExpiresAt: {
            type: "string",
            format: "date-time",
            description: "Absolute expiry of the refresh token.",
          },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      AuthRefreshRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string", minLength: 20, maxLength: 200 },
        },
      },
      AuthLogoutRequest: {
        type: "object",
        properties: {
          refreshToken: {
            type: "string",
            maxLength: 200,
            description: "Optional. When supplied the session is revoked server-side.",
          },
        },
      },
      MagicLinkRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email", maxLength: 254 },
          locale: {
            type: "string",
            enum: ["de", "en", "tr"],
            description: "Controls the language of the emailed link. Defaults to 'de'.",
          },
        },
      },
      // -------------------------------------------------------------------------
      // Users
      // -------------------------------------------------------------------------
      User: {
        type: "object",
        required: ["id", "email"],
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email" },
          name: { type: ["string", "null"] },
          locale: { type: ["string", "null"], enum: ["de", "en", "tr", null] },
          emailVerifiedAt: {
            type: ["string", "null"],
            format: "date-time",
          },
        },
      },
      // -------------------------------------------------------------------------
      // Cards — authenticated (full shape)
      // -------------------------------------------------------------------------
      ApiCard: {
        type: "object",
        required: [
          "id", "status", "templateId", "cardData", "createdAt", "updatedAt",
        ],
        properties: {
          id: { type: "string" },
          slug: { type: ["string", "null"] },
          status: {
            type: "string",
            enum: ["DRAFT", "PUBLISHED", "CANCELLED"],
          },
          templateId: { type: "integer" },
          layoutKey: { type: ["string", "null"] },
          themeKey: { type: ["string", "null"] },
          cardData: {
            type: "object",
            description: "Freeform contact + design data for the card.",
          },
          brandPrimaryHex: {
            type: ["string", "null"],
            pattern: "^#[0-9a-fA-F]{6}$",
          },
          brandAccentHex: {
            type: ["string", "null"],
            pattern: "^#[0-9a-fA-F]{6}$",
          },
          photoPath: { type: ["string", "null"] },
          logoPath: { type: ["string", "null"] },
          qrStyle: { type: ["object", "null"] },
          videoUrl: { type: ["string", "null"] },
          publishedAt: { type: ["string", "null"], format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      // -------------------------------------------------------------------------
      // Cards — public (unauthenticated, no internal IDs)
      // -------------------------------------------------------------------------
      PublicApiCard: {
        type: "object",
        required: ["slug", "status", "templateId", "cardData"],
        properties: {
          slug: { type: "string" },
          status: { type: "string", enum: ["PUBLISHED"] },
          templateId: { type: "integer" },
          layoutKey: { type: ["string", "null"] },
          themeKey: { type: ["string", "null"] },
          cardData: { type: "object" },
          brandPrimaryHex: { type: ["string", "null"] },
          brandAccentHex: { type: ["string", "null"] },
          photoPath: { type: ["string", "null"] },
          logoPath: { type: ["string", "null"] },
          publishedAt: { type: ["string", "null"], format: "date-time" },
        },
      },
      // -------------------------------------------------------------------------
      // Cards — create request
      // -------------------------------------------------------------------------
      CreateCardRequest: {
        type: "object",
        required: ["templateId", "cardData"],
        properties: {
          templateId: { type: "integer", minimum: 1 },
          cardData: { type: "object" },
          desiredSlug: { type: "string", minLength: 3, maxLength: 40 },
          layoutKey: { type: "string", maxLength: 64 },
          themeKey: { type: "string", maxLength: 32 },
          brandPrimaryHex: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
          brandAccentHex: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
        },
      },
      // -------------------------------------------------------------------------
      // Cards — PATCH request
      // -------------------------------------------------------------------------
      PatchCardRequest: {
        type: "object",
        properties: {
          cardData: { type: "object" },
          status: { type: "string", enum: ["PUBLISHED", "CANCELLED"] },
          slug: { type: "string", minLength: 3, maxLength: 40 },
          layoutKey: { type: "string", maxLength: 64 },
          themeKey: { type: "string", maxLength: 32 },
          brandPrimaryHex: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
          brandAccentHex: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
        },
        additionalProperties: false,
      },
      // -------------------------------------------------------------------------
      // Leads
      // -------------------------------------------------------------------------
      LeadRequest: {
        type: "object",
        required: ["name", "consent"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 160 },
          email: { type: "string", format: "email", maxLength: 200 },
          phone: { type: "string", maxLength: 40 },
          company: { type: "string", maxLength: 160 },
          message: { type: "string", maxLength: 2000 },
          interest: { type: "string", maxLength: 160 },
          meetingContext: { type: "string", maxLength: 160 },
          consent: {
            type: "boolean",
            enum: [true],
            description: "Must be true. Visitor acknowledges data processing.",
          },
        },
      },
      LeadResponse: {
        type: "object",
        required: ["ok", "lead"],
        properties: {
          ok: { type: "boolean", enum: [true] },
          lead: {
            type: "object",
            required: ["id", "createdAt"],
            properties: {
              id: { type: "string", format: "uuid" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
      // -------------------------------------------------------------------------
      // Shared
      // -------------------------------------------------------------------------
      OkResponse: {
        type: "object",
        required: ["ok"],
        properties: { ok: { type: "boolean", enum: [true] } },
      },
      Error: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "string",
            description: "Machine-readable error code (snake_case).",
          },
          message: {
            type: "string",
            description: "Human-readable explanation.",
          },
          details: {
            type: "array",
            description: "Validation issue list, present on 400 invalid_payload.",
            items: { type: "object" },
          },
        },
      },
    },
  },
  // Global security default — overridden per-operation where endpoint is public.
  security: [{ bearerAuth: [] }],
  paths: {
    // =========================================================================
    // Auth
    // =========================================================================
    "/api/v1/auth/login": {
      post: {
        operationId: "authLogin",
        tags: ["auth"],
        summary: "Login with email + password",
        description:
          "Returns an access token (JWT, 15 min) and a refresh token (opaque, 30 days). No cookies are set. Rate-limited: 10 req / hour / IP + 3-fail lockout per email.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthLoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Authenticated successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": {
            description: "Malformed request body.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "invalid_credentials", message: "Invalid email or password." },
              },
            },
          },
          "401": {
            description: "Wrong credentials.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "invalid_credentials", message: "Invalid email or password." },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded.",
            headers: {
              "Retry-After": { schema: { type: "integer" } },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "rate_limited", message: "Too many sign-in attempts. Try again later." },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/refresh": {
      post: {
        operationId: "authRefresh",
        tags: ["auth"],
        summary: "Rotate a refresh token",
        description:
          "Consumes the supplied refreshToken (single-use rotation) and returns a new token pair. Returns 401 if the token is unknown, revoked, or expired.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRefreshRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "New token pair issued.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": {
            description: "Missing or malformed refreshToken.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Session expired or token revoked.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "session_invalid", message: "Session expired. Please sign in again." },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded (60 req / hour / IP).",
            headers: {
              "Retry-After": { schema: { type: "integer" } },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/logout": {
      post: {
        operationId: "authLogout",
        tags: ["auth"],
        summary: "Revoke a refresh token",
        description:
          "Revokes the session associated with the supplied refreshToken. Always returns 200 — revoking an unknown or already-revoked token is a no-op. The access JWT (stateless) continues to work until its 15-min TTL expires; drop it locally on the client.",
        security: [],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthLogoutRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Session revoked (or was already revoked / unknown).",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OkResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/me": {
      get: {
        operationId: "authMe",
        tags: ["auth"],
        summary: "Get the current authenticated user",
        description:
          "Validates the Bearer token and returns the canonical user profile. Never cached (Cache-Control: no-store). Accepts bearer tokens only — cookie auth is rejected.",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Authenticated user profile.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["user"],
                  properties: { user: { $ref: "#/components/schemas/User" } },
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid Bearer token.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/auth/magic-link": {
      post: {
        operationId: "authMagicLink",
        tags: ["auth"],
        summary: "Request a magic-link sign-in email",
        description:
          "Sends a sign-in link to the given email address. Always returns 202 — the response never confirms or denies whether the address is registered (anti-enumeration). The emailed link opens in the web session-cookie flow; the mobile client should present it in the system browser or a webview. Rate-limited: 5 req / hour / IP.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MagicLinkRequest" },
            },
          },
        },
        responses: {
          "202": {
            description: "Request accepted (regardless of whether the email exists).",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ok", "message"],
                  properties: {
                    ok: { type: "boolean", enum: [true] },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded.",
            headers: {
              "Retry-After": { schema: { type: "integer" } },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    // =========================================================================
    // Cards — authenticated
    // =========================================================================
    "/api/v1/cards": {
      get: {
        operationId: "listCards",
        tags: ["cards"],
        summary: "List cards owned by the authenticated user",
        description:
          "Cursor-paginated, newest-first. Pass `cursor` from `nextCursor` in the previous response to fetch the next page. Rate-limited: 60 req / hour / user.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "limit",
            in: "query",
            description: "Page size (1–100). Defaults to 20.",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
          },
          {
            name: "cursor",
            in: "query",
            description: "Opaque pagination cursor returned by `nextCursor` in a previous response.",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Paginated card list.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["items"],
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ApiCard" },
                    },
                    nextCursor: {
                      type: ["string", "null"],
                      description: "Pass to `cursor` to fetch the next page. Null when no more pages.",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid Bearer token.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        operationId: "createCard",
        tags: ["cards"],
        summary: "Create a FREE-tier card",
        description:
          "Creates a card immediately in PUBLISHED status. Only FREE-tier cards are created here — paid tiers go through the web /api/orders Stripe checkout flow. Rate-limited: 10 req / hour / user.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCardRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Card created.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["card"],
                  properties: { card: { $ref: "#/components/schemas/ApiCard" } },
                },
              },
            },
          },
          "400": {
            description: "Validation error or invalid slug.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Missing or invalid Bearer token.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Unknown templateId.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "unknown_template", message: "Unknown template." },
              },
            },
          },
          "409": {
            description: "desiredSlug is already taken.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "slug_taken", message: "Slug already taken." },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/cards/{id}": {
      get: {
        operationId: "getCard",
        tags: ["cards"],
        summary: "Get a single card by ID",
        description:
          "Returns the card only when it belongs to the authenticated user. Returns 404 even when the card exists but belongs to a different user (to avoid leaking card ID existence). Rate-limited: 60 req / hour / user.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Card detail.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["card"],
                  properties: { card: { $ref: "#/components/schemas/ApiCard" } },
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid Bearer token.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Card not found (or belongs to another user).",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      patch: {
        operationId: "updateCard",
        tags: ["cards"],
        summary: "Update a card",
        description:
          "Partial update of cardData, status, slug, theme, and brand color fields. Only the owner can update. Changing the slug preserves the previous slug for permanent redirect support. Rate-limited: 30 writes / hour / user (shared with DELETE).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PatchCardRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated card.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["card"],
                  properties: { card: { $ref: "#/components/schemas/ApiCard" } },
                },
              },
            },
          },
          "400": {
            description: "Validation error or invalid slug.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Missing or invalid Bearer token.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Card not found (or belongs to another user).",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "409": {
            description: "Desired slug is already taken.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        operationId: "deleteCard",
        tags: ["cards"],
        summary: "Soft-delete a card (status → CANCELLED)",
        description:
          "This is a SOFT delete. The card status is set to CANCELLED; the record is not removed from the database. Hard deletion is intentionally not exposed in v1 — it would cascade to leads, views, and connections and requires a deliberate admin-side affordance. Rate-limited: 30 writes / hour / user (shared with PATCH).",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Card soft-deleted.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ok", "id"],
                  properties: {
                    ok: { type: "boolean", enum: [true] },
                    id: { type: "string" },
                  },
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid Bearer token.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Card not found (or belongs to another user).",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    // =========================================================================
    // Public cards (unauthenticated)
    // =========================================================================
    "/api/v1/public/cards/{slug}": {
      get: {
        operationId: "getPublicCard",
        tags: ["public"],
        summary: "Get a published card by slug (public)",
        description:
          "Returns the public card payload when status === PUBLISHED. Intended for share screens, NFC tap targets, and 3rd-party indexers. Cached for 60 seconds (CDN-friendly). Rate-limited: 120 req / hour / IP.",
        security: [],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 3, maxLength: 60, pattern: "^[a-z0-9-]+$" },
          },
        ],
        responses: {
          "200": {
            description: "Published card.",
            headers: {
              "Cache-Control": {
                schema: { type: "string" },
                example: "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
              },
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["card"],
                  properties: {
                    card: { $ref: "#/components/schemas/PublicApiCard" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Card not found or not published.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/api/v1/public/cards/{slug}/leads": {
      post: {
        operationId: "submitLead",
        tags: ["public"],
        summary: "Submit a lead for a published card",
        description:
          "Anonymous lead capture. Triggers email + Telegram + webhook notifications to the card owner. Rate-limited: 5 req / 10 min per (slug, IP) pair to prevent spam.",
        security: [],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string", minLength: 3, maxLength: 60, pattern: "^[a-z0-9-]+$" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LeadRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Lead recorded.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LeadResponse" },
              },
            },
          },
          "400": {
            description: "Validation error.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Card not found or not published.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded.",
            headers: {
              "Retry-After": { schema: { type: "integer" } },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
