// Browser Web Audio API Synthesizer for rich Duolingo audio feedback

class SoundEffects {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Cheerful correct answer chime (Major triad arpeggio: C5 -> E5 -> G5 -> C6)
  playCorrect() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const startTime = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime + idx * 0.08);

        gain.gain.setValueAtTime(0.01, startTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.25, startTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime + idx * 0.08);
        osc.stop(startTime + idx * 0.08 + 0.4);
      });
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  }

  // Incorrect answer thud / buzz (Low dissonance descending: F3 -> C#3)
  playIncorrect() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime;
      const notes = [174.61, 138.59]; // F3, C#3

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, startTime + idx * 0.12);

        gain.gain.setValueAtTime(0.2, startTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.12 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime + idx * 0.12);
        osc.stop(startTime + idx * 0.12 + 0.35);
      });
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  }

  // Snappy click sound for tokens / buttons
  playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      // Ignore audio error
    }
  }

  // Victory fanfare on lesson completion
  playVictory() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50];
      const durations = [0.1, 0.1, 0.1, 0.2, 0.2, 0.5];
      let offset = 0;
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const dur = durations[idx];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + offset);

        gain.gain.setValueAtTime(0.01, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.3, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + dur + 0.05);

        offset += dur + 0.03;
      });
    } catch (e) {
      // Ignore
    }
  }

  // Heartbreak thud
  playHeartBreak() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      // Ignore
    }
  }
}

export const sounds = new SoundEffects();
