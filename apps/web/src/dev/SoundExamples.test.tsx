import { loadSnapRecording, scheduleRecordedSnap } from "../lib/recordedSnap";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useLibrarySound } from "./SoundExamples";
import { scheduleSnap, scheduleSuction } from "../lib/snapSound";
import { soundTokens } from "../lib/soundTokens";
vi.mock("../lib/snapSound", () => ({
  scheduleSnap: vi.fn(),
  scheduleSuction: vi.fn(() => ({ stop: vi.fn() })),
}));
vi.mock("../lib/recordedSnap", () => ({
  loadSnapRecording: vi.fn(async () => ({ duration: 0.099 })),
  scheduleRecordedSnap: vi.fn(),
}));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.clearAllMocks();
});
function audioMock(resume = () => Promise.resolve()) {
  const close = vi.fn(() => Promise.resolve());
  const gain = { gain: { value: 0 }, connect: vi.fn() };
  const ctor = vi.fn(function () {
    return {
      currentTime: 10,
      state: "running",
      resume,
      close,
      destination: {},
      createGain: () => gain,
    };
  });
  vi.stubGlobal("AudioContext", ctor);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  return { ctor, close, gain };
}
describe("library sound lifecycle", () => {
  it("defaults off and does not create audio for a muted logo replay", async () => {
    const { ctor } = audioMock();
    const visual = vi.fn();
    const { result } = renderHook(useLibrarySound);
    await act(async () => {
      await result.current.play("logo", visual);
    });
    expect(result.current.enabled).toBe(false);
    expect(ctor).not.toHaveBeenCalled();
    expect(visual).toHaveBeenCalledOnce();
  });
  it("schedules one snap at release and closes prior playback on replay or mute", async () => {
    const { close, gain } = audioMock();
    const { result } = renderHook(useLibrarySound);
    act(() => result.current.toggle(true));
    const visual = vi.fn();
    await act(async () => {
      await result.current.play("logo", visual);
    });
    expect(scheduleRecordedSnap).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ duration: 0.099 }),
      10 + soundTokens.logoReleaseMs / 1000,
      gain,
    );
    expect(gain.gain.value).toBe(soundTokens.defaultVolume);
    expect(visual).toHaveBeenCalledOnce();
    await act(async () => {
      await result.current.play("logo", undefined, true);
    });
    expect(close).toHaveBeenCalledOnce();
    expect(scheduleRecordedSnap).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ duration: 0.099 }),
      10,
      gain,
    );
    act(() => result.current.toggle(false));
    expect(close).toHaveBeenCalledTimes(2);
  });
  it("cancels an in-flight audio resume and never emits a late snap", async () => {
    let resolve!: () => void;
    const pending = new Promise<void>((done) => {
      resolve = done;
    });
    const { close } = audioMock(() => pending);
    const { result } = renderHook(useLibrarySound);
    act(() => result.current.toggle(true));
    let playback!: Promise<void>;
    act(() => {
      playback = result.current.play("logo");
    });
    act(() => result.current.stopPreview());
    await act(async () => {
      resolve();
      await playback;
    });
    expect(close).toHaveBeenCalledOnce();
    expect(scheduleSnap).not.toHaveBeenCalled();
  });
  it("cancellation fades the preparation without scheduling a snap", async () => {
    vi.useFakeTimers();
    audioMock();
    const { result, unmount } = renderHook(useLibrarySound);
    act(() => result.current.toggle(true));
    await act(async () => {
      await result.current.play("cancel");
    });
    act(() => vi.advanceTimersByTime(300));
    expect(
      vi.mocked(scheduleSuction).mock.results[0].value.stop,
    ).toHaveBeenCalledOnce();
    expect(scheduleSnap).not.toHaveBeenCalled();
    unmount();
  });
  it("keeps the visual available when browser audio is unavailable", async () => {
    vi.stubGlobal("AudioContext", undefined);
    const { result } = renderHook(useLibrarySound);
    const visual = vi.fn();
    act(() => result.current.toggle(true));
    await act(async () => {
      await result.current.play("logo", visual);
    });
    expect(result.current.status).toMatch(/unavailable or blocked/);
    expect(visual).toHaveBeenCalledOnce();
  });
});

it("uses the recording for snap previews and labels synthesis when loading fails", async () => {
  audioMock();
  const { result } = renderHook(useLibrarySound);
  act(() => result.current.toggle(true));
  await act(async () => {
    await result.current.play("snap");
  });
  expect(scheduleRecordedSnap).toHaveBeenCalledOnce();
  expect(scheduleSnap).not.toHaveBeenCalled();
  vi.mocked(loadSnapRecording).mockRejectedValueOnce(new Error("offline"));
  await act(async () => {
    await result.current.play("snap");
  });
  expect(result.current.status).toMatch(
    /Recording unavailable.*synthetic fallback/,
  );
  expect(scheduleSnap).toHaveBeenCalledOnce();
});
