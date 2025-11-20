class SoundEngine {
  constructor() {
    this.ctx = null;
    this.volume = 0.5;
    this.muted = false;
    this.noiseBuffer = null;
    this.lastTestTime = 0;
  }
  init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      const size = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuffer = buffer;
    } catch (e) { }
  }
  playTone(freq, type, duration, volMultiplier = 1) {
    if (this.muted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => { });
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(this.volume * volMultiplier, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(t + duration);
    } catch (e) { }
  }
  playFirework() {
    if (this.muted || !this.ctx || !this.noiseBuffer) return;
    try {
      const t = this.ctx.currentTime;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, t);
      filter.frequency.exponentialRampToValueAtTime(10, t + 0.5);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(t);
      src.stop(t + 0.6);
      // Crackle
      for (let i = 0; i < 4; i++) {
        const delay = Math.random() * 0.3 + 0.1;
        const cSrc = this.ctx.createBufferSource();
        cSrc.buffer = this.noiseBuffer;
        const cFilter = this.ctx.createBiquadFilter();
        cFilter.type = 'highpass';
        cFilter.frequency.value = 3000;
        const cGain = this.ctx.createGain();
        cGain.gain.setValueAtTime(0, t + delay);
        cGain.gain.linearRampToValueAtTime(this.volume * 0.3, t + delay);
        cGain.gain.linearRampToValueAtTime(0, t + delay + 0.05);
        cSrc.connect(cFilter);
        cFilter.connect(cGain);
        cGain.connect(this.ctx.destination);
        cSrc.start(t + delay);
        cSrc.stop(t + delay + 0.1);
      }
    } catch (e) { }
  }
  playMove() { this.playTone(150, 'triangle', 0.1, 0.2); }
  playWin() { if (!this.muted) [523, 659, 783].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.3), i * 100)); }
  playGameOver() { if (!this.muted) [300, 200, 100].forEach((f, i) => setTimeout(() => this.playTone(f, 'sawtooth', 0.3), i * 150)); }
  playPowerUp() { if (!this.muted) [440, 880].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.1, 0.2), i * 100)); }
  playZenRescue() { if (!this.muted) [523, 659, 783].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.2, 0.3), i * 100)); }
  playReward() { if (!this.muted) [880, 1100, 1320].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.1, 0.3), i * 80)); }
  playCombo() { if (!this.muted) this.playTone(600, 'sawtooth', 0.1, 0.4); }
  playTestFeedback() { this.init(); const now = Date.now(); if (now - this.lastTestTime > 150) { this.playTone(600, 'sine', 0.1, 0.3); this.lastTestTime = now; } }
}
export const audio = new SoundEngine();
