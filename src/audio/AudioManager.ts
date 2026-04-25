/**
 * AudioManager - Procedural audio for the rail grinder using Web Audio API.
 *
 * Generates sounds without any audio files:
 * - Grinding drone (filtered noise that changes pitch with rail condition)
 * - Spark crackle (random short bursts)
 * - Completion ding (synthesized bell tone)
 * - Diesel rumble (low-frequency oscillator)
 * - Wind ambient (filtered noise)
 */

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
  private _muted = false;

  /** Must be called from a user gesture (click/key) to unlock audio */
  init(): void {
    if (this.initialized) return;

    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);

      this.setupDiesel();
      this.setupWind();
      this.initialized = true;
    } catch {
      // Web Audio not supported
    }
  }

  get muted(): boolean { return this._muted; }
  set muted(v: boolean) {
    this._muted = v;
    if (this.masterGain) {
      this.masterGain.gain.value = v ? 0 : 0.3;
    }
  }

  /** Start or update the grinding sound. grindIntensity 0-1. */
  startGrinding(grindIntensity: number): void {
    if (!this.ctx || !this.masterGain) return;

    if (!this.grindNode) {
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

      // Noise layer for gritty texture
      this.grindNoiseGain = this.ctx.createGain();
      this.grindNoiseGain.gain.value = 0;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 3000;

      const noiseBuffer = this.createNoiseBuffer(2);
      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;
      this.noiseSource.connect(noiseFilter);
      noiseFilter.connect(this.grindNoiseGain);
      this.grindNoiseGain.connect(this.masterGain);
      this.noiseSource.start();
    }

    // Modulate based on intensity
    const now = this.ctx.currentTime;
    this.grindGain!.gain.linearRampToValueAtTime(grindIntensity * 0.15, now + 0.05);
    this.grindNoiseGain!.gain.linearRampToValueAtTime(grindIntensity * 0.08, now + 0.05);
    // Pitch varies with what you're grinding - higher = hitting defect, lower = clean rail
    this.grindNode!.frequency.linearRampToValueAtTime(
      120 + grindIntensity * 100, now + 0.1
    );
  }

  /** Stop the grinding sound */
  stopGrinding(): void {
    if (!this.ctx || !this.grindGain) return;
    const now = this.ctx.currentTime;
    this.grindGain.gain.linearRampToValueAtTime(0, now + 0.15);
    if (this.grindNoiseGain) {
      this.grindNoiseGain.gain.linearRampToValueAtTime(0, now + 0.15);
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

  /** Play click that varies with rail condition — rough on damaged, smooth on good */
  private playClickWithCondition(condition: number): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    // Damaged rail: lower pitch, louder, longer. Good rail: higher pitch, softer, shorter.
    osc.type = condition > 0.7 ? 'sine' : 'triangle';
    osc.frequency.value = 60 + condition * 60 + Math.random() * (30 - condition * 20);
    const gain = this.ctx.createGain();
    const volume = 0.08 - condition * 0.05; // louder on damaged rail
    const decay = 0.1 - condition * 0.05; // longer on damaged rail
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + decay);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 150 + condition * 200; // brighter on good rail
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  /** Update diesel rumble based on speed */
  setDieselSpeed(speed: number): void {
    if (!this.dieselNode || !this.dieselGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    // Idle at low frequency, increases with speed
    this.dieselNode.frequency.linearRampToValueAtTime(
      25 + Math.abs(speed) * 5, now + 0.1
    );
    this.dieselGain.gain.linearRampToValueAtTime(
      0.03 + Math.abs(speed) * 0.01, now + 0.1
    );
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

    const buffer = this.createNoiseBuffer(4);
    this.windSource = this.ctx.createBufferSource();
    this.windSource.buffer = buffer;
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
    this.dieselNode?.stop();
    this.noiseSource?.stop();
    this.windSource?.stop();
    this.ctx?.close();
  }
}
