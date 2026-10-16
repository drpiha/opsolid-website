/**
 * Shared, mutable state for the scripted 3D-agent demo. The DOM demo widget
 * (AgentDemo) writes `mode`; the 3D stage and the DOM wave read `amp`.
 * A scripted scenario, not a live voice call.
 */
export type VoiceMode = "idle" | "listen" | "speak";

export const voice: { mode: VoiceMode; amp: number } = { mode: "idle", amp: 0.05 };

/** Advance the smoothed amplitude toward the target for the current mode. */
export function stepVoice(tSeconds: number): number {
  const target =
    voice.mode === "speak"
      ? 0.35 + 0.65 * Math.abs(Math.sin(tSeconds * 9.3) * Math.sin(tSeconds * 3.1 + 1))
      : voice.mode === "listen"
        ? 0.14 + 0.1 * Math.sin(tSeconds * 2.4)
        : 0.05 + 0.03 * Math.sin(tSeconds * 1.5);
  voice.amp += (target - voice.amp) * 0.22;
  return voice.amp;
}
