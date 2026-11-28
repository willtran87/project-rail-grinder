/**
 * AudioManager - Procedural audio for the rail grinder using Web Audio API.
 *
 * Generates sounds without any audio files:
 * - Grinding drone (filtered noise that changes pitch with rail condition)
 * - Spark crackle (random short bursts)
 * - Completion ding (synthesized bell tone)
 * - Diesel rumble (low-frequency oscillator)
 * - Wind ambient (filtered noise)
 * - Route ambience: birds, crickets, surf, traffic, crossing bell (see Ambience.ts)
 */

import { Ambience } from './Ambience';
import { glide, forgetGlide } from './glide';
import type { Region } from '../types/rail';

export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Sound channels
  private grindNode: OscillatorNode | null = null;
  private grindGain: GainNode | null = null;
  private grindNoiseGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;

  private dieselNode: OscillatorNode | null = null;
  private dieselGain: GainNode | null = null;

  private windGain: GainNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;

  private initialized = false;
  private noise: AudioBuffer | null = null;
  private _muted = false;

  // Route-specific background sound (birds, surf, traffic, crossing bell…)
  private ambience: Ambience | null = null;
  private region: Region = 'prairie';

  /** Which route's background sounds to play (safe to call before init) */
  setRegion(region: Region): void {
    this.region = region;
    this.ambience?.setRegion(region);
  }

  /**
   * Call every frame during play.
   * @param darkness - 0 day .. 1 night; @param rain / @param snow - 0..1;
   * @param bell - 0..1 level-crossing bell loudness
   */
  updateAmbience(dt: number, darkness: number, rain: number, snow: number, bell: number): void {
    this.ambience?.update(dt, darkness, rain, snow, bell);
  }

  /**
   * Must be called from a user gesture (click/key) to unlock audio — or be
   * given a context that was created in one (opening the audio device takes
   * ~90 ms, so main.ts does that on the title click, hidden by the fade).
   */
  init(context?: AudioContext): void {
    if (this.initialized) {
      // Already built (and paused until now, see Game): just start playing
      void this.ctx?.resume();
      return;
    }

    try {
      this.ctx = context ?? new AudioContext();
      this.masterGain = this.ctx.createGain();
      // Effects bus (masterGain, everything but ambience) → master output.
      // The route ambience has its own level and joins at the output.
      this.outGain = this.ctx.createGain();
      this.outGain.connect(this.ctx.destination);
      this.masterGain.connect(this.outGain);
      this.applyVolumes();

      // One noise buffer shared by wind, grinding grit and the route ambience
      // (filling it is the slow part of starting the audio: once is enough)
      this.noise = this.createNoiseBuffer(3);
      this.setupDiesel();
      this.setupWind();
      this.setupClickVoice();
      // The grinding sound is built now, silent, rather than on the first grind
      this.ensureGrindNodes();
      this.ambience = new Ambience(this.ctx, this.outGain, this.noise);
      this.applyVolumes();
      this.ambience.setRegion(this.region);
      this.initialized = true;
    } catch {
      // Web Audio not supported
    }
  }

  get muted(): boolean { return this._muted; }
  set muted(v: boolean) {
    this._muted = v;
    this.applyVolumes();
  }

  /** Volumes 0..1 from the settings menu */
  setVolumes(master: number, effects: number, ambience: number): void {
    this.volumes = { master, effects, ambience };
    this.applyVolumes();
  }
  private volumes = { master: 0.8, effects: 1, ambience: 1 };
  private outGain: GainNode | null = null;

  private applyVolumes(): void {
    if (!this.outGain || !this.masterGain) return;
    this.outGain.gain.value = this._muted ? 0 : this.volumes.master;
    this.masterGain.gain.value = 0.375 * this.volumes.effects; // 0.3 at the old default (0.8 master)
    this.ambience?.setLevel(0.375 * this.volumes.ambience); // 0.3 overall at the defaults, as before
  }

  // "Sweet spot" layer: a clean metallic singing tone when the stone is on a defect
  private singNode: OscillatorNode | null = null;
  private singGain: GainNode | null = null;
  private grindNoiseFilter: BiquadFilterNode | null = null;

  /**
   * Start or update the grinding sound — it tells you how well you're aiming:
   *   - on a defect: a bright "singing" tone rises with how much metal is coming off
   *   - over-grinding: harsh, low scrape (noise opens up, tone drops and wobbles)
   *   - grinding rail that's already good: dull, quiet rumble
   * @param grindIntensity 0-1 (pressure)
   * @param onDefect 0-1, how much excess metal is under the stones
   * @param overgrinding true if a stone is cutting below the target line
   */
  startGrinding(grindIntensity: number, onDefect: number = 0, overgrinding: boolean = false): void {
    if (!this.ctx || !this.masterGain) return;
    this.ensureGrindNodes();
    this.grindingSilent = false;

    const now = this.ctx.currentTime;
    // (glide: smooth, and only sent when the value moves — see glide.ts)
    // Base metallic tone: pitch climbs when you're on a defect, drops when over-grinding
    const basePitch = overgrinding ? 85 + Math.random() * 25 : 110 + onDefect * 140 + grindIntensity * 30;
    glide(this.grindNode!.frequency, basePitch, now);
    glide(this.grindGain!.gain, grindIntensity * (overgrinding ? 0.2 : 0.1 + onDefect * 0.08), now);

    // Grit: loud and wide when over-grinding, quieter on good rail
    glide(this.grindNoiseFilter!.frequency, overgrinding ? 900 : 3000 - onDefect * 800, now);
    glide(this.grindNoiseGain!.gain, grindIntensity * (overgrinding ? 0.2 : 0.05 + onDefect * 0.05), now);

    // Sweet-spot sing: only when actually taking metal off a defect
    const sing = overgrinding ? 0 : onDefect;
    // ...and the closer the section is to perfect, the higher it sings
    glide(this.singNode!.frequency, 620 + sing * 260 + this.accuracyLift * 220, now);
    glide(this.singGain!.gain, sing * grindIntensity * 0.07, now);
    // Rough rail shudders; a finished profile runs smooth
    const rough = 1 - this.accuracyLift;
    if (this.chatterDepth) glide(this.chatterDepth.gain, grindIntensity * 0.06 * rough, now);
  }

  /** Build the grinding sound graph the first time it's needed */
  private ensureGrindNodes(): void {
    if (this.grindNode || !this.ctx || !this.masterGain) return;

    {
      // Grinding tone (sawtooth oscillator + noise for texture)
      this.grindNode = this.ctx.createOscillator();
      this.grindNode.type = 'sawtooth';
      this.grindNode.frequency.value = 180;

      this.grindGain = this.ctx.createGain();
      this.grindGain.gain.value = 0;

      // Filter for metallic quality
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2000;
      filter.Q.value = 2;

      this.grindNode.connect(filter);
      filter.connect(this.grindGain);
      this.grindGain.connect(this.masterGain);
      this.grindNode.start();
      // Chatter: a fast wobble on the grind volume, deeper on rough rail
      const chatter = this.ctx.createOscillator();
      chatter.type = 'square';
      chatter.frequency.value = 17;
      this.chatterDepth = this.ctx.createGain();
      this.chatterDepth.gain.value = 0;
      chatter.connect(this.chatterDepth);
      this.chatterDepth.connect(this.grindGain.gain);
      chatter.start();

      // Noise layer for gritty texture
      this.grindNoiseGain = this.ctx.createGain();
      this.grindNoiseGain.gain.value = 0;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 3000;

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = this.noise ?? this.createNoiseBuffer(3);
      this.noiseSource.loop = true;
      this.noiseSource.connect(noiseFilter);
      noiseFilter.connect(this.grindNoiseGain);
      this.grindNoiseGain.connect(this.masterGain);
      this.noiseSource.start();
      this.grindNoiseFilter = noiseFilter;

      // Sweet-spot "sing": a triangle wave with gentle vibrato through a
      // resonant bandpass — sounds like a clean cut ringing in the steel
      this.singNode = this.ctx.createOscillator();
      this.singNode.type = 'triangle';
      this.singNode.frequency.value = 620;
      const vibrato = this.ctx.createOscillator();
      vibrato.frequency.value = 6;
      const vibratoDepth = this.ctx.createGain();
      vibratoDepth.gain.value = 9; // ±9 Hz wobble
      vibrato.connect(vibratoDepth);
      vibratoDepth.connect(this.singNode.frequency);
      const ring = this.ctx.createBiquadFilter();
      ring.type = 'bandpass';
      ring.frequency.value = 760;
      ring.Q.value = 6;
      this.singGain = this.ctx.createGain();
      this.singGain.gain.value = 0;
      this.singNode.connect(ring);
      ring.connect(this.singGain);
      this.singGain.connect(this.masterGain);
      this.singNode.start();
      vibrato.start();
    }
  }

  /** 0..1 how accurate the section being ground is (raises the "sing" pitch) */
  accuracyLift = 0;
  /** Chatter: rough rail makes the grind sound shudder; it smooths out as the profile improves */
  private chatterDepth: GainNode | null = null;

  /** The stones hit the rail: a heavy clunk and a short scrape */
  playStoneDrop(): void {
    if (!this.ctx || !this.masterGain || !this.noise) return;
    const t = this.ctx.currentTime;
    this.note(70, t, 0.25, 0.22, 'sine');
    this.note(140, t, 0.12, 0.08, 'square');
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const band = this.ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = 1800;
    band.Q.value = 1.5;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    src.connect(band).connect(gain).connect(this.masterGain);
    src.start(t, Math.random());
    src.stop(t + 0.32);
  }

  /** True once stopGrinding() has faded the grinding sound out (it's called every frame while not grinding) */
  private grindingSilent = true;

  /** Stop the grinding sound */
  stopGrinding(): void {
    if (!this.ctx || !this.grindGain) return;
    if (this.grindingSilent) return; // already faded out: nothing to schedule
    this.grindingSilent = true;
    const now = this.ctx.currentTime;
    for (const g of [this.grindGain, this.grindNoiseGain, this.singGain]) {
      if (!g) continue;
      g.gain.cancelScheduledValues(now);
      g.gain.setTargetAtTime(0, now, 0.05); // ~0.15 s fade, as before
      forgetGlide(g.gain); // so the next startGrinding() fades back in
    }
  }

  /** Play a completion ding (synthesized bell) */
  playDing(): void {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Bell tone: two detuned sine waves
    for (const freq of [880, 1320]) {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.8);
    }
  }

  /** Play a short positive jingle for completing a segment */
  playSegmentComplete(): void {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const notes = [523, 659, 784]; // C5, E5, G5 - major chord arpeggio

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = this.ctx!.createGain();
      const start = now + i * 0.08;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  }

  /**
   * Play a two-blast locomotive air horn (revenue train approaching).
   * Real US horns are a chord of several reed tones — we layer three
   * sawtooth oscillators through a lowpass filter for a brassy sound.
   * Deliberately different from the over-grind buzzer so the two warnings
   * can't be confused.
   */
  playTrainHorn(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    filter.connect(this.masterGain);

    // Two blasts: long, short
    const blasts = [{ start: 0, length: 1.1 }, { start: 1.35, length: 0.6 }];
    for (const blast of blasts) {
      const t0 = now + blast.start;
      const t1 = t0 + blast.length;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.09, t0 + 0.06);   // quick swell
      gain.gain.setValueAtTime(0.09, t1 - 0.1);
      gain.gain.linearRampToValueAtTime(0, t1);             // quick release
      gain.connect(filter);

      for (const freq of [277, 349, 415]) { // C#4, F4, G#4 — classic horn chord
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq * 0.97, t0);       // slight pitch rise as air builds
        osc.frequency.linearRampToValueAtTime(freq, t0 + 0.12);
        osc.connect(gain);
        osc.start(t0);
        osc.stop(t1 + 0.05);
      }
    }
  }

  // ---- Skill feedback (sweet spot, combo, fanfares) ----

  /** One short synthesized note (a few nodes that stop themselves) */
  private note(freq: number, start: number, dur: number, vol: number, type: OscillatorType = 'sine'): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain).connect(this.masterGain);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  /** Bright "tink": the stone is aimed right at the worst spot */
  playSweetSpot(): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.note(1568, t, 0.22, 0.07);          // G6
    this.note(2349, t + 0.04, 0.18, 0.04);   // D7
  }

  /** Harsh metal screech: a stone cut below the target line */
  playScreech(): void {
    if (!this.ctx || !this.masterGain || !this.noise) return;
    const t = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const band = this.ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.Q.value = 9;
    band.frequency.setValueAtTime(3200, t);
    band.frequency.exponentialRampToValueAtTime(1100, t + 0.35);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    src.connect(band).connect(gain).connect(this.masterGain);
    src.start(t, Math.random() * 2);
    src.stop(t + 0.45);
  }

  /**
   * Thunder: a low rumble that swells and rolls away.
   * @param delay - seconds after the flash (sound is slower than light)
   * @param loud - 0..1, nearer strikes are louder and sharper
   */
  playThunder(delay: number, loud: number): void {
    if (!this.ctx || !this.masterGain || !this.noise) return;
    const t = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const low = this.ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.setValueAtTime(300 + loud * 500, t);
    low.frequency.exponentialRampToValueAtTime(90, t + 3);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.25 + loud * 0.45, t + 0.08 + (1 - loud) * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 3.5);
    src.connect(low).connect(gain).connect(this.masterGain);
    src.start(t, Math.random() * 2);
    src.stop(t + 3.6);
  }

  /** Two falling tones: the combo was lost */
  playComboBreak(): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.note(587, t, 0.16, 0.08, 'triangle');
    this.note(392, t + 0.12, 0.3, 0.08, 'triangle');
  }

  /**
   * Section finished, scaled to how well:
   *   1 star  - a ding
   *   2 stars - the major arpeggio
   *   3 stars - arpeggio + a sparkling octave on top (pitch rises with the combo)
   *   perfect - all that + a bright held chord
   */
  playSectionFanfare(stars: number, perfect: boolean, combo: number): void {
    if (!this.ctx) return;
    if (stars <= 1 && !perfect) { this.playDing(); return; }
    this.playSegmentComplete();
    const t = this.ctx.currentTime + 0.24;
    if (stars >= 3 || perfect) {
      const lift = Math.pow(2, Math.min(6, Math.max(0, combo - 1)) / 12); // up a semitone per combo step
      this.note(1047 * lift, t, 0.3, 0.07);
      this.note(1319 * lift, t + 0.06, 0.3, 0.06);
      this.note(1568 * lift, t + 0.12, 0.45, 0.06);
    }
    if (perfect) {
      for (const f of [523, 659, 784, 1047]) this.note(f, t + 0.25, 0.9, 0.05, 'triangle');
    }
  }

  /** Play harsh buzzer for over-grinding */
  playOvergrindAlarm(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    for (let pulse = 0; pulse < 2; pulse++) {
      const t = now + pulse * 0.15;
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = 220;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
      gain.gain.linearRampToValueAtTime(0, t + 0.1);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.12);
    }
  }

  private clickTimer = 0;
  private clickInterval = 1;

  /**
   * Call each frame with speed and rail condition to generate wheel clicks.
   * condition: 0 = damaged (rough), 1 = perfect (smooth)
   */
  updateWheelSound(speed: number, dt: number, condition: number = 0): void {
    if (!this.ctx || Math.abs(speed) < 0.3) return;
    this.clickInterval = Math.max(0.15, 1.5 / Math.abs(speed));
    this.clickTimer += dt;
    if (this.clickTimer >= this.clickInterval) {
      this.clickTimer -= this.clickInterval;
      this.playClickWithCondition(condition);
    }
  }

  // Wheel clicks: one permanent voice (oscillator → filter → gain) that is
  // re-triggered for each click, instead of three new audio nodes per click
  private clickOsc: OscillatorNode | null = null;
  private clickFilter: BiquadFilterNode | null = null;
  private clickGain: GainNode | null = null;

  private setupClickVoice(): void {
    if (!this.ctx || !this.masterGain) return;
    this.clickOsc = this.ctx.createOscillator();
    this.clickFilter = this.ctx.createBiquadFilter();
    this.clickFilter.type = 'lowpass';
    this.clickGain = this.ctx.createGain();
    this.clickGain.gain.value = 0;
    this.clickOsc.connect(this.clickFilter).connect(this.clickGain).connect(this.masterGain);
    this.clickOsc.start();
  }

  /** Play click that varies with rail condition — rough on damaged, smooth on good */
  private playClickWithCondition(condition: number): void {
    if (!this.ctx || !this.clickOsc || !this.clickGain || !this.clickFilter) return;
    const now = this.ctx.currentTime;
    // Damaged rail: lower pitch, louder, longer. Good rail: higher pitch, softer, shorter.
    this.clickOsc.type = condition > 0.7 ? 'sine' : 'triangle';
    this.clickOsc.frequency.setValueAtTime(60 + condition * 60 + Math.random() * (30 - condition * 20), now);
    this.clickFilter.frequency.setValueAtTime(150 + condition * 200, now); // brighter on good rail
    const volume = 0.08 - condition * 0.05; // louder on damaged rail
    const decay = 0.1 - condition * 0.05; // longer on damaged rail
    const g = this.clickGain.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(volume, now);
    g.exponentialRampToValueAtTime(0.001, now + Math.min(0.12, 0.05 + decay));
    g.setValueAtTime(0, now + 0.12); // the old click's oscillator stopped at 0.12 s
  }

  /** Update diesel rumble based on speed */
  /**
   * @param speed - m/s
   * @param load - 0..1 how hard the engine works (stone pressure while grinding)
   */
  setDieselSpeed(speed: number, load = 0): void {
    if (!this.dieselNode || !this.dieselGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Idle at low frequency, rising with speed; labouring (deeper and louder) under load
    glide(this.dieselNode.frequency, 25 + Math.abs(speed) * 5 + load * 9, now, 0.04);
    glide(this.dieselGain.gain, 0.03 + Math.abs(speed) * 0.01 + load * 0.035, now, 0.04);
  }

  private setupDiesel(): void {
    if (!this.ctx || !this.masterGain) return;

    this.dieselNode = this.ctx.createOscillator();
    this.dieselNode.type = 'sawtooth';
    this.dieselNode.frequency.value = 28;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 80;

    this.dieselGain = this.ctx.createGain();
    this.dieselGain.gain.value = 0.02;

    this.dieselNode.connect(filter);
    filter.connect(this.dieselGain);
    this.dieselGain.connect(this.masterGain);
    this.dieselNode.start();
  }

  private setupWind(): void {
    if (!this.ctx || !this.masterGain) return;

    this.windSource = this.ctx.createBufferSource();
    this.windSource.buffer = this.noise ?? this.createNoiseBuffer(3);
    this.windSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.value = 0.02;

    this.windSource.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    this.windSource.start();
  }

  private createNoiseBuffer(duration: number): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.ctx!.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  dispose(): void {
    this.grindNode?.stop();
    this.singNode?.stop();
    this.dieselNode?.stop();
    this.noiseSource?.stop();
    this.windSource?.stop();
    this.clickOsc?.stop();
    this.ctx?.close();
  }
}
