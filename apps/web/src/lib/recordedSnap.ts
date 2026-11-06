import { soundAssets } from "./soundTokens";
export async function loadSnapRecording(
  context: BaseAudioContext,
  signal: AbortSignal,
): Promise<AudioBuffer> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}${soundAssets.snap.path}`,
    { signal },
  );
  if (!response.ok) throw new Error("Snap recording unavailable");
  return context.decodeAudioData(await response.arrayBuffer());
}
export function scheduleRecordedSnap(
  context: BaseAudioContext,
  buffer: AudioBuffer,
  at: number,
  destination: AudioNode,
) {
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(destination);
  source.start(at);
  return source;
}
