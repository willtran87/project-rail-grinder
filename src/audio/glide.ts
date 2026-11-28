/**
 * glide - Move a Web Audio parameter smoothly toward a value, without
 * flooding the audio engine.
 *
 * WHY: the game used to schedule a new ramp on ~10 audio parameters every
 * frame (60 a second each), even when nothing had changed. The audio engine
 * has to queue and process every one of those, and with the grinding sound
 * playing that showed up as stutter (frames of 40–110 ms). Sound changes this
 * slowly can't be heard faster than ~20 updates a second anyway.
 *
 * glide() only sends a change when the value really moved, at most every
 * MIN_INTERVAL seconds, and lets the parameter ease there (setTargetAtTime).
 */

const MIN_INTERVAL = 0.05;   // seconds between updates to one parameter
const EPSILON = 0.002;       // relative change that counts as "moved"

const sent = new WeakMap<AudioParam, { value: number; time: number }>();

/**
 * @param timeConstant - seconds to cover ~63% of the way (like a ramp's length / 3)
 */
export function glide(param: AudioParam, value: number, now: number, timeConstant = 0.03): void {
  const last = sent.get(param);
  if (last) {
    if (now - last.time < MIN_INTERVAL) return;
    if (Math.abs(last.value - value) <= EPSILON * Math.max(1, Math.abs(value))) return;
    last.value = value;
    last.time = now;
  } else {
    sent.set(param, { value, time: now });
  }
  param.setTargetAtTime(value, now, timeConstant);
}

/**
 * Forget what glide() last sent for a parameter. Call after moving it some
 * other way (e.g. a fade-out ramp), so the next glide() isn't skipped as "no change".
 */
export function forgetGlide(param: AudioParam): void {
  sent.delete(param);
}
