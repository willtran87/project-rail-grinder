/**
 * Music - A procedural score that follows the play (Web Audio, no files).
 *
 * Four layers over a slow four-chord loop (96 bpm, one chord a bar):
 *
 *   PAD     two detuned saws through a soft filter: always on, quiet
 *   PULSE   a bass note on the beat: while grinding
 *   TICKS   noise "clacks" on the eighths: while grinding with a combo going
 *   ARP     a bright arpeggio over the chord: combo 3+, brighter at 5+
 *
 * `setIntensity(level)` picks the layers (Game calls it every frame from what
 * is happening); `sting()` plays a little rising flourish (perfect pass).
 * Notes are scheduled a fraction of a second ahead on the audio clock, so the
 * timing stays tight even when a frame is late.
 */

const BPM = 96;
const BEAT = 60 / BPM;
/** Chord roots (Hz) and their chord tones as semitone offsets: Am – F – C – G */
const CHORDS: { root: number; tones: number[] }[] = [
  { root: 110.0, tones: [0, 3, 7, 12] },   // A minor
  { root: 87.31, tones: [0, 4, 7, 12] },   // F
  { root: 130.81, tones: [0, 4, 7, 12] },  // C
  { root: 98.0, tones: [0, 4, 7, 12] },    // G
];
const semi = (f: number, n: number) => f * Math.pow(2, n / 12);

export interface MusicState {
  /** 0 menu/silent, 1 travelling, 2 grinding, 3 combo going, 4 hot combo (5+) */
  level: number;
}

export class Music {
  private out: GainNode;
  private padGain: GainNode;
  private padFilter: BiquadFilterNode;
  private padOsc: OscillatorNode[] = [];
  private beatGain: GainNode;
  private arpGain: GainNode;
  private arpFilter: BiquadFilterNode;
  private nextBeat = 0;
  private beatIndex = 0;
  private level = 0;
  private volume = 0.6;

  constructor(private ctx: AudioContext, destination: AudioNode, private noise: AudioBuffer) {
    this.out = ctx.createGain();
    this.out.gain.value = 0;
    this.out.connect(destination);
    // Pad
    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.frequency.value = 600;
    this.padGain = ctx.createGain();
    this.padGain.gain.value = 0.05;
    this.padFilter.connect(this.padGain);
    this.padGain.connect(this.out);
    for (const detune of [-7, 7, 1200 - 5]) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = CHORDS[0].root * 2;
      o.detune.value = detune;
      o.connect(this.padFilter);
      o.start();
      this.padOsc.push(o);
    }
    this.beatGain = ctx.createGain();
    this.beatGain.gain.value = 0;
    this.beatGain.connect(this.out);
    this.arpFilter = ctx.createBiquadFilter();
    this.arpFilter.type = 'lowpass';
    this.arpFilter.frequency.value = 1800;
    this.arpGain = ctx.createGain();
    this.arpGain.gain.value = 0;
    this.arpFilter.connect(this.arpGain);
    this.arpGain.connect(this.out);
    this.nextBeat = ctx.currentTime + 0.1;
  }

  /** 0..1 music volume (Settings) */
  setVolume(v: number): void {
    this.volume = v;
    this.applyLevel();
  }

  setIntensity(level: number): void {
    if (level === this.level) return;
    this.level = level;
    this.applyLevel();
  }

  private applyLevel(): void {
    const t = this.ctx.currentTime;
    const l = this.level;
    this.out.gain.setTargetAtTime(l > 0 ? this.volume * 0.9 : 0, t, 0.8);
    this.padGain.gain.setTargetAtTime(l >= 1 ? 0.05 : 0, t, 0.6);
    this.padFilter.frequency.setTargetAtTime(l >= 3 ? 1100 : l >= 2 ? 800 : 550, t, 0.8);
    this.beatGain.gain.setTargetAtTime(l >= 2 ? 1 : 0, t, 0.3);
    this.arpGain.gain.setTargetAtTime(l >= 3 ? 0.05 : 0, t, 0.4);
    this.arpFilter.frequency.setTargetAtTime(l >= 4 ? 4200 : 1800, t, 0.6);
  }

  /** Schedule the next notes (call every frame) */
  update(): void {
    const ctx = this.ctx;
    // If the tab slept, don't try to catch up on missed beats
    if (this.nextBeat < ctx.currentTime - 0.5) this.nextBeat = ctx.currentTime + 0.05;
    while (this.nextBeat < ctx.currentTime + 0.25) {
      this.scheduleBeat(this.nextBeat, this.beatIndex);
      this.nextBeat += BEAT / 2; // eighths
      this.beatIndex++;
    }
  }

  private scheduleBeat(time: number, i: number): void {
    const eighth = i % 8;
    const bar = Math.floor(i / 8);
    const chord = CHORDS[bar % CHORDS.length];
    // New bar: move the pad to the new chord (gently)
    if (eighth === 0) {
      this.padOsc[0].frequency.setTargetAtTime(chord.root * 2, time, 0.15);
      this.padOsc[1].frequency.setTargetAtTime(semi(chord.root * 2, chord.tones[2]), time, 0.15);
      this.padOsc[2].frequency.setTargetAtTime(semi(chord.root * 2, chord.tones[1]), time, 0.15);
    }
    if (this.level >= 2 && eighth % 4 === 0) this.tone(chord.root, time, 0.32, 0.16, 'sine', this.beatGain);
    if (this.level >= 3) this.tick(time, eighth % 2 === 0 ? 0.05 : 0.025);
    if (this.level >= 3) {
      const tone = chord.tones[(i * (this.level >= 4 ? 3 : 1)) % chord.tones.length];
      this.tone(semi(chord.root * 4, tone), time, BEAT / 2 * 0.9, 1, 'triangle', this.arpFilter);
    }
  }

  private tone(freq: number, start: number, dur: number, vol: number, type: OscillatorType, dest: AudioNode): void {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g);
    g.connect(dest);
    o.start(start);
    o.stop(start + dur + 0.02);
  }

  /** A short, filtered noise "clack", like a rail joint */
  private tick(start: number, vol: number): void {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 3200;
    f.Q.value = 2;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.05);
    src.connect(f); f.connect(g); g.connect(this.beatGain);
    src.start(start, Math.random() * 2, 0.06);
  }

  /** Perfect pass: a quick rising chime over the current chord */
  sting(): void {
    const t = this.ctx.currentTime + 0.02;
    const chord = CHORDS[Math.floor(this.beatIndex / 8) % CHORDS.length];
    [0, 1, 2, 3].forEach((k) => this.tone(semi(chord.root * 8, chord.tones[k]), t + k * 0.07, 0.5, 0.09 * this.volume, 'sine', this.out));
  }
}
