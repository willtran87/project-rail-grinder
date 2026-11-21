/**
 * Ambience - Background sound that makes each route feel like a place.
 * Everything is synthesized (no audio files), like the rest of the game.
 *
 *   prairie   breeze; meadowlark-ish birdsong by day, crickets at night
 *   mountain  gusty wind; a hawk's cry by day, an owl at night
 *   city      low traffic rumble; distant car horns, the odd siren
 *   coast     surf rolling in and out; seagulls by day
 *
 * Plus: rain hiss (follows the weather) and the level-crossing bell.
 *
 * How it works: one looping noise "bed" per route (filtered differently per
 * region), plus short one-off sounds ("events") scheduled at random times.
 */

import type { Region } from '../types/rail';

interface BedSettings {
  type: BiquadFilterType;
  freq: number;
  q: number;
  gain: number;
  /** Slow volume swell: seconds per cycle (0 = steady) and how deep (0..1) */
  swellPeriod: number;
  swellDepth: number;
}

const BEDS: Record<Region, BedSettings> = {
  prairie:  { type: 'bandpass', freq: 650, q: 0.4, gain: 0.025, swellPeriod: 11, swellDepth: 0.5 },
  mountain: { type: 'lowpass',  freq: 520, q: 0.7, gain: 0.06,  swellPeriod: 6,  swellDepth: 0.8 },
  city:     { type: 'lowpass',  freq: 190, q: 0.5, gain: 0.07,  swellPeriod: 17, swellDepth: 0.3 },
  coast:    { type: 'lowpass',  freq: 750, q: 0.5, gain: 0.08,  swellPeriod: 8,  swellDepth: 0.9 },
};

export class Ambience {
  private ctx: AudioContext;
  private out: GainNode;
  private bedFilter: BiquadFilterNode;
  private bedGain: GainNode;
  private rainGain: GainNode;
  private region: Region = 'prairie';
  private time = 0;
  private eventTimer = 4;
  private cricketTimer = 0;
  private bellTimer = 0;

  /**
   * @param ctx - the game's AudioContext
   * @param destination - where to send the sound (the master volume)
   * @param noise - a looping white-noise buffer to filter into wind / surf / rain
   */
  constructor(ctx: AudioContext, destination: AudioNode, noise: AudioBuffer) {
    this.ctx = ctx;
    this.out = ctx.createGain();
    this.out.gain.value = 1;
    this.out.connect(destination);

    // Bed: looping noise through a filter (wind / traffic / surf)
    const bedSrc = ctx.createBufferSource();
    bedSrc.buffer = noise;
    bedSrc.loop = true;
    this.bedFilter = ctx.createBiquadFilter();
    this.bedGain = ctx.createGain();
    this.bedGain.gain.value = 0;
    bedSrc.connect(this.bedFilter).connect(this.bedGain).connect(this.out);
    bedSrc.start();

    // Rain: bright hiss
    const rainSrc = ctx.createBufferSource();
    rainSrc.buffer = noise;
    rainSrc.loop = true;
    rainSrc.playbackRate.value = 0.9; // offset from the bed so they don't phase
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'highpass';
    rainFilter.frequency.value = 1800;
    this.rainGain = ctx.createGain();
    this.rainGain.gain.value = 0;
    rainSrc.connect(rainFilter).connect(this.rainGain).connect(this.out);
    rainSrc.start();

    this.setRegion('prairie');
  }

  setRegion(region: Region): void {
    this.region = region;
    const b = BEDS[region];
    this.bedFilter.type = b.type;
    this.bedFilter.frequency.value = b.freq;
    this.bedFilter.Q.value = b.q;
    this.eventTimer = 3 + Math.random() * 4;
  }

  /**
   * @param darkness - 0 (day) .. 1 (night): switches day birds for night creatures
   * @param rain - 0..1 rain intensity
   * @param snow - 0..1 snow intensity (snow muffles the critters)
   * @param bell - 0..1 level-crossing bell loudness
   */
  update(dt: number, darkness: number, rain: number, snow: number, bell: number): void {
    this.time += dt;
    const now = this.ctx.currentTime;
    const b = BEDS[this.region];

    // Bed volume swells slowly (gusts, waves); storms make the wind louder
    const swell = b.swellPeriod > 0
      ? 1 - b.swellDepth * (0.5 + 0.5 * Math.sin((this.time / b.swellPeriod) * Math.PI * 2))
      : 1;
    const storm = 1 + rain * 0.8 + snow * 0.6;
    this.bedGain.gain.setTargetAtTime(b.gain * swell * storm, now, 0.3);
    this.rainGain.gain.setTargetAtTime(rain * 0.07, now, 0.5);

    // Critters keep quiet in heavy weather
    const calm = Math.max(0, 1 - rain * 1.5 - snow);

    // One-off events every few seconds
    this.eventTimer -= dt;
    if (this.eventTimer <= 0) {
      this.eventTimer = 5 + Math.random() * 9;
      if (calm > 0.2) this.playEvent(darkness, calm);
    }

    // Crickets: steady chirping on warm nights out on the prairie
    if (this.region === 'prairie' && darkness > 0.45 && calm > 0.5) {
      this.cricketTimer -= dt;
      if (this.cricketTimer <= 0) {
        this.cricketTimer = 0.42 + Math.random() * 0.25;
        const pitch = Math.random() < 0.5 ? 4300 : 4750;
        this.chirp(pitch, 0.012 * darkness * calm);
      }
    }

    // Crossing bell: a bright "ding" about twice a second
    if (bell > 0.01) {
      this.bellTimer -= dt;
      if (this.bellTimer <= 0) {
        this.bellTimer = 0.5;
        this.ding(bell);
      }
    } else {
      this.bellTimer = 0;
    }
  }

  /** A random sound that fits the place and time of day */
  private playEvent(darkness: number, calm: number): void {
    const night = darkness > 0.5;
    const vol = calm;
    switch (this.region) {
      case 'prairie':
        if (!night) this.birdSong(vol);
        break;
      case 'mountain':
        if (night) this.owl(vol); else this.hawk(vol);
        break;
      case 'city':
        if (Math.random() < 0.15) this.siren(vol);
        else this.carHorn(vol);
        break;
      case 'coast':
        if (!night) this.gulls(vol);
        break;
    }
  }

  // ---- Building blocks ----

  /**
   * One synthesized note that glides from f0 to f1.
   * @param when - start time (ctx.currentTime based)
   * @param vibrato - wobble depth in Hz (0 = none)
   */
  private tone(f0: number, f1: number, dur: number, vol: number, when: number,
               type: OscillatorType = 'sine', vibrato = 0, vibratoRate = 0): void {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, when);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), when + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vol, when + Math.min(0.04, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    if (vibrato > 0) {
      const lfo = ctx.createOscillator();
      lfo.frequency.value = vibratoRate;
      const depth = ctx.createGain();
      depth.gain.value = vibrato;
      lfo.connect(depth).connect(osc.frequency);
      lfo.start(when);
      lfo.stop(when + dur);
    }
    osc.connect(g).connect(this.out);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }

  /** Meadowlark-ish: a few clear whistled notes, rising then tumbling down */
  private birdSong(vol: number): void {
    let t = this.ctx.currentTime;
    const notes = [[2400, 2700], [3100, 2900], [2600, 2200], [3300, 2500], [2800, 2000]];
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const [a, b] = notes[(i + Math.floor(Math.random() * 2)) % notes.length];
      const d = 0.09 + Math.random() * 0.12;
      this.tone(a, b, d, 0.018 * vol, t);
      t += d + 0.03;
    }
  }

  /** Red-tailed hawk: a long hoarse scream sliding down */
  private hawk(vol: number): void {
    const t = this.ctx.currentTime;
    this.tone(2900, 1500, 1.4, 0.016 * vol, t, 'sawtooth', 60, 30);
  }

  /** Owl: two soft low hoots */
  private owl(vol: number): void {
    const t = this.ctx.currentTime;
    this.tone(420, 380, 0.45, 0.03 * vol, t);
    this.tone(400, 360, 0.7, 0.03 * vol, t + 0.65);
  }

  /** Distant car horn: two detuned square tones, muffled */
  private carHorn(vol: number): void {
    const t = this.ctx.currentTime;
    const dur = 0.25 + Math.random() * 0.4;
    this.tone(415, 410, dur, 0.006 * vol, t, 'square');
    this.tone(523, 518, dur, 0.005 * vol, t, 'square');
  }

  /** Far-off siren: slow wail up and down */
  private siren(vol: number): void {
    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      this.tone(650, 1050, 1.2, 0.006 * vol, t + i * 2.4);
      this.tone(1050, 650, 1.2, 0.006 * vol, t + i * 2.4 + 1.2);
    }
  }

  /** Seagulls: a few squawky downward cries */
  private gulls(vol: number): void {
    let t = this.ctx.currentTime;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      this.tone(1900, 1150, 0.28, 0.014 * vol, t, 'triangle', 90, 22);
      t += 0.32 + Math.random() * 0.2;
    }
  }

  /** One cricket chirp: three very short pulses */
  private chirp(freq: number, vol: number): void {
    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) this.tone(freq, freq, 0.025, vol, t + i * 0.045);
  }

  /** Level-crossing bell: a bright metallic ding */
  private ding(vol: number): void {
    const t = this.ctx.currentTime;
    this.tone(1650, 1640, 0.35, 0.05 * vol, t, 'triangle');
    this.tone(2780, 2770, 0.2, 0.02 * vol, t, 'sine');
  }
}
