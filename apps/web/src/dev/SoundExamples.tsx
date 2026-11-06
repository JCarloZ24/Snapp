import { loadSnapRecording, scheduleRecordedSnap } from "../lib/recordedSnap";
import { SnappLogo } from "../components/SnappLogo";
import { useCallback, useEffect, useRef, useState } from "react";
import { scheduleSnap, scheduleSuction } from "../lib/snapSound";
import {
  soundTokens,
  soundAssets,
  soundTokenDescriptions,
} from "../lib/soundTokens";
import { SnappSlider, SnappSwitch } from "../components/ui/SnappControls";

type Cue = "snap" | "prepare" | "cancel" | "logo" | "synthetic";
export function useLibrarySound() {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState<number>(soundTokens.defaultVolume * 100);
  const [status, setStatus] = useState("Sound is off. Enable it to preview.");
  const context = useRef<AudioContext | null>(null);
  const sequence = useRef(0);
  const loading = useRef<AbortController | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const frame = useRef<number>();
  const stop = useCallback(() => {
    sequence.current++;
    loading.current?.abort();
    loading.current = null;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    const current = context.current;
    context.current = null;
    if (current && current.state !== "closed")
      void current.close().catch(() => {});
  }, []);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) {
        stop();
        setStatus("Preview stopped while the page is hidden.");
      }
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      stop();
    };
  }, [stop]);
  const play = async (cue: Cue, startVisual?: () => void, reduced = false) => {
    stop();
    if (!enabled || volume <= 0) {
      startVisual?.();
      return;
    }
    const version = sequence.current;
    try {
      if (typeof AudioContext === "undefined") throw new Error("unavailable");
      const current = new AudioContext();
      context.current = current;
      await current.resume();
      if (version !== sequence.current) return;
      if (current.state !== "running")
        throw new Error("Audio context did not start");
      let recording: AudioBuffer | null = null;
      let fallback = false;
      if (cue === "snap" || cue === "logo") {
        const controller = new AbortController();
        loading.current = controller;
        setStatus("Loading the finger-snap recording...");
        try {
          recording = await loadSnapRecording(current, controller.signal);
        } catch {
          if (version !== sequence.current) return;
          fallback = true;
        }
        if (version !== sequence.current) return;
      }
      frame.current = requestAnimationFrame(() => {
        if (version !== sequence.current) return;
        try {
          const gain = current.createGain();
          gain.gain.value = Math.max(0, Math.min(1, volume / 100));
          gain.connect(current.destination);
          const at = current.currentTime;
          startVisual?.();
          let length = recording
            ? recording.duration * 1000 + 100
            : soundTokens.bodyMs + soundTokens.tailMs + 100;
          if (cue === "logo") {
            const delay = reduced ? 0 : soundTokens.logoReleaseMs;
            if (recording)
              scheduleRecordedSnap(current, recording, at + delay / 1000, gain);
            else scheduleSnap(current, at + delay / 1000, 1, 1, gain);
            length += delay;
          } else if (cue === "snap" || cue === "synthetic") {
            if (recording) scheduleRecordedSnap(current, recording, at, gain);
            else scheduleSnap(current, at, 1, 1, gain);
          } else {
            const suction = scheduleSuction(
              current,
              at,
              soundTokens.holdMs,
              1,
              gain,
            );
            length = soundTokens.holdMs + 150;
            if (cue === "cancel")
              timers.current.push(
                setTimeout(() => {
                  suction.stop();
                }, 300),
              );
          }
          setStatus(
            fallback
              ? "Recording unavailable. Playing the synthetic fallback."
              : `Playing ${cue === "logo" ? "logo release" : cue} preview${recording ? " with the recorded finger snap" : ""}.`,
          );
          timers.current.push(
            setTimeout(() => {
              if (version === sequence.current) {
                stop();
                setStatus("Preview finished.");
              }
            }, length),
          );
        } catch {
          stop();
          setStatus(
            "Audio could not play. Try another browser or audio output.",
          );
        }
      });
    } catch {
      if (version === sequence.current) {
        stop();
        setStatus(
          "Audio is unavailable or blocked. The visual preview still works.",
        );
        startVisual?.();
      }
    }
  };
  return {
    enabled,
    volume,
    status,
    play,
    stop,
    toggle: (value: boolean) => {
      stop();
      setEnabled(value);
      setStatus(value ? "Sound enabled. Choose a preview." : "Sound is off.");
    },
    changeVolume: (value: number) => {
      stop();
      setVolume(value);
      setStatus("Volume updated. Choose a preview.");
    },
    stopPreview: () => {
      stop();
      setStatus("Preview stopped.");
    },
  };
}
export type LibrarySound = ReturnType<typeof useLibrarySound>;
export function SoundExamples({
  sound,
  replayLogo,
  motion,
}: {
  sound: LibrarySound;
  replayLogo: () => void;
  motion: number;
}) {
  return (
    <div className="lib-sound-library">
      <div className="lib-sound-controls">
        <SnappSwitch
          label="Enable library sound"
          selected={sound.enabled}
          onChange={sound.toggle}
        />
        <SnappSlider
          label="Sound volume"
          value={sound.volume}
          min={0}
          max={100}
          suffix="%"
          onChange={sound.changeVolume}
        />
        <button className="lib-button" onClick={sound.stopPreview}>
          Stop sound
        </button>
      </div>
      <p className="lib-note">
        Recorded finger snap; synthesized preparation and cancellation. Loading
        loops and report updates remain silent. No sound signifies a confirmed
        payment.
      </p>
      <div className="lib-motion-stage">
        <div key={motion} className={motion ? "lib-sting" : ""}>
          <SnappLogo variant="mark" release="var(--logo-release)" />
        </div>
        <div>
          <h3>Logo release preview</h3>
          <p>One gesture, one snap. Enable sound, then preview below.</p>
        </div>
      </div>
      <div className="lib-demo-toolbar">
        <button
          className="lib-button"
          disabled={!sound.enabled || !sound.volume}
          onClick={() => void sound.play("snap")}
        >
          Preview snap
        </button>
        <button
          className="lib-button"
          disabled={!sound.enabled || !sound.volume}
          onClick={() => void sound.play("prepare")}
        >
          Preview preparation
        </button>
        <button
          className="lib-button"
          disabled={!sound.enabled || !sound.volume}
          onClick={() => void sound.play("cancel")}
        >
          Preview cancellation
        </button>
        <button
          className="lib-button"
          disabled={!sound.enabled || !sound.volume}
          onClick={replayLogo}
        >
          Preview logo with sound
        </button>
      </div>
      <p role="status" className="lib-note">
        {sound.status}
      </p>
      <p className="lib-note">
        Recording by{" "}
        <a
          href="https://opengameart.org/content/snap-of-the-fingers-sounds"
          target="_blank"
          rel="noreferrer"
        >
          Vinrax (CC0)
        </a>
        . Trimmed to 99 ms; no added bass or reverb.{" "}
        <a href="/audio/LICENSE.md">Source and processing notes</a>.
      </p>
      <button
        className="lib-text-button"
        disabled={!sound.enabled || !sound.volume}
        onClick={() => void sound.play("synthetic")}
      >
        Preview synthetic fallback
      </button>
      <p className="lib-note">
        The logo snap lands at 310 ms: after 250 ms preparation and 60 ms hold.
        Reduced motion plays the snap immediately with the static mark.
      </p>
      <div
        className="lib-report-table-wrap"
        tabIndex={0}
        role="region"
        aria-label="Sound token reference"
      >
        <table className="lib-report-table">
          <caption>
            Sound tokens - playback timing and synthetic fallback
          </caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Value</th>
              <th scope="col">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(soundTokens).map(([key, value]) => (
              <tr key={key}>
                <th scope="row">
                  <code>{key}</code>
                </th>
                <td className="lib-numeric">
                  {value}
                  {key.endsWith("Ms")
                    ? " ms"
                    : key.endsWith("Hz")
                      ? " Hz"
                      : key.endsWith("Db")
                        ? " dB"
                        : ""}
                </td>
                <td>
                  {soundTokenDescriptions[key as keyof typeof soundTokens]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="lib-text-button"
        onClick={() => {
          const url = URL.createObjectURL(
            new Blob(
              [
                JSON.stringify(
                  { tokens: soundTokens, assets: soundAssets },
                  null,
                  2,
                ),
              ],
              {
                type: "application/json",
              },
            ),
          );
          const link = document.createElement("a");
          link.href = url;
          link.download = "snapp-sound-tokens.json";
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 0);
        }}
      >
        Download sound tokens
      </button>
    </div>
  );
}
