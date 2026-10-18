// Japanese EEW & Emergency Siren Synthesizer using Web Audio API

class SoundSystem {
  private audioCtx: AudioContext | null = null;
  private isSirenPlaying: boolean = false;
  private sirenIntervalId: any = null;
  private isUnlocked: boolean = false;

  public init(): boolean {
    if (typeof window === "undefined") return false;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      this.isUnlocked = true;
      return true;
    } catch (e) {
      console.warn("AudioContext init error:", e);
      return false;
    }
  }

  public isAudioUnlocked(): boolean {
    return this.isUnlocked && !!this.audioCtx && this.audioCtx.state === "running";
  }

  // Play short EEW chime (authentic Japanese NHK/NERV style 5-tone chord)
  public playEEWChime() {
    if (!this.init() || !this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Frequencies inspired by Japanese EEW Chime: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    const tones = [
      { freq: 523.25, time: 0.0, dur: 0.22 },
      { freq: 659.25, time: 0.15, dur: 0.22 },
      { freq: 783.99, time: 0.3, dur: 0.25 },
      { freq: 1046.5, time: 0.45, dur: 0.4 },
    ];

    tones.forEach((tone) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(tone.freq, now + tone.time);

      gain.gain.setValueAtTime(0.001, now + tone.time);
      gain.gain.exponentialRampToValueAtTime(0.4, now + tone.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + tone.time + tone.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + tone.time);
      osc.stop(now + tone.time + tone.dur);
    });
  }

  // High-intensity "Titut-Titut" Japanese Disaster Alert Siren
  public startEmergencySiren() {
    if (this.isSirenPlaying) return;
    if (!this.init() || !this.audioCtx) return;

    this.isSirenPlaying = true;

    // First trigger the initial warning chime
    this.playEEWChime();

    // After chime, pulse the two-tone "titut-titut" (950Hz - 720Hz siren)
    let flip = false;
    const playBurst = () => {
      if (!this.isSirenPlaying || !this.audioCtx) return;
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Two rapid beeps ("tit-tut")
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "square";
      const f1 = flip ? 987.77 : 830.61; // B5 or G#5
      osc1.frequency.setValueAtTime(f1, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.28, now + 0.02);
      gain1.gain.linearRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.2);

      // Follow-up second beep
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sawtooth";
      const f2 = flip ? 783.99 : 659.25; // G5 or E5
      osc2.frequency.setValueAtTime(f2, now + 0.22);

      gain2.gain.setValueAtTime(0.001, now + 0.22);
      gain2.gain.linearRampToValueAtTime(0.25, now + 0.24);
      gain2.gain.linearRampToValueAtTime(0.001, now + 0.42);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.22);
      osc2.stop(now + 0.44);

      flip = !flip;
    };

    // First burst after 0.8s
    setTimeout(playBurst, 800);
    this.sirenIntervalId = setInterval(playBurst, 950);
  }

  public stopEmergencySiren() {
    this.isSirenPlaying = false;
    if (this.sirenIntervalId) {
      clearInterval(this.sirenIntervalId);
      this.sirenIntervalId = null;
    }
  }

  // Play subtle warning beep for WASPADA
  public playWarningBeep() {
    if (!this.init() || !this.audioCtx) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Test sound function
  public playTestSound() {
    if (!this.init()) return;
    this.playEEWChime();
    setTimeout(() => {
      this.playWarningBeep();
    }, 600);
  }

  public getSirenStatus(): boolean {
    return this.isSirenPlaying;
  }
}

export const audioSystem = new SoundSystem();
