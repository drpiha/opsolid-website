-- patch_015_voice_agent_llm_model.sql
-- Add per-agent LLM model selection. Until this patch the model was
-- hardcoded in src/lib/voice/provider/retell.ts to gpt-4.1-mini, which
-- meant every tenant got the same model regardless of latency / cost
-- preferences. This column lets the dashboard pick from the Retell-supported
-- catalog (GPT-5 family, Claude, Gemini, etc.).

ALTER TABLE voice_agents
  ADD COLUMN IF NOT EXISTS llm_model TEXT NOT NULL DEFAULT 'gpt-5-mini';
