// -----------------------------------------------------------------------
// Templates API client — list of active card templates for the picker UI.
// Backed by GET /api/v1/templates (Bearer-auth, 5-minute browser cache).
// -----------------------------------------------------------------------

import { apiFetch } from './client';

export type Template = {
  id: number;
  slug: string;
  name: string;
  sectorHint: string | null;
  previewPath: string | null;
  themeKey?: 'aurora' | 'editorial' | 'cinema' | null;
};

export async function listTemplates(): Promise<{ items: Template[] }> {
  return apiFetch<{ items: Template[] }>('/api/v1/templates');
}
