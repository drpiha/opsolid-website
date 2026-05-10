-- patch_019_voice_llm_default_5_4_mini.sql
-- Bump default LLM from legacy gpt-5-mini to current-generation gpt-5.4-mini.
-- Per-agent value is preserved — only the column default changes, plus any
-- agent still on the previous default (and never explicitly customized) is
-- migrated. Premium-quality voice pilots (e.g. Asya Konak) should run on a
-- current model; legacy gpt-5-mini causes intonation drift in TR/DE.

-- Step 1 — change column default for future rows.
ALTER TABLE voice_agents
  ALTER COLUMN llm_model SET DEFAULT 'gpt-5.4-mini';

-- Step 2 — upgrade any agent still on the old default. Agents that an
-- operator deliberately set to a different model (Claude, Gemini, GPT-5.5,
-- nano, etc.) are NOT touched.
UPDATE voice_agents
   SET llm_model = 'gpt-5.4-mini'
 WHERE llm_model = 'gpt-5-mini';
