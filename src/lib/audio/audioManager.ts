class DetectiveAudioManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private musicOscillators: OscillatorNode[] = [];
  private musicGain: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private currentIntensity: 'calm' | 'tense' | 'climax' = 'calm';

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public playClick() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio autoplay guard
    }
  }

  public playClueDiscovered() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + index * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.65);
      });
    } catch {}
  }

  public playCoin() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08); // E6

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  public playSuccess() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const chord = [392.00, 493.88, 587.33, 783.99]; // G chord
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.05;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 1.25);
      });
    } catch {}
  }

  public playFailure() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(65, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.85);
    } catch {}
  }

  public playAchievement() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = this.ctx.currentTime + i * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.55);
      });
    } catch {}
  }

  public playChapterComplete() {
    if (!this.isEnabled) return;
    this.playSuccess();
    setTimeout(() => {
      this.playAchievement();
    }, 400);
  }

  public setMusicIntensity(intensity: 'calm' | 'tense' | 'climax') {
    this.currentIntensity = intensity;
    if (this.isMusicPlaying) {
      this.restartAmbientLoop();
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public startMusic() {
    if (!this.isEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    this.stopMusic();
    this.isMusicPlaying = true;
    this.restartAmbientLoop();
  }

  public stopMusic() {
    this.musicOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.musicOscillators = [];
    if (this.musicGain) {
      try {
        this.musicGain.disconnect();
      } catch {}
      this.musicGain = null;
    }
    this.isMusicPlaying = false;
  }

  private restartAmbientLoop() {
    if (!this.ctx || !this.isMusicPlaying) return;

    this.musicOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.musicOscillators = [];

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);
    this.musicGain = masterGain;

    let freqs = [65.41, 130.81, 196.00]; // Calm noir C drone
    if (this.currentIntensity === 'tense') {
      freqs = [61.74, 123.47, 185.00, 246.94]; // Tense B diminished
    } else if (this.currentIntensity === 'climax') {
      freqs = [55.00, 110.00, 164.81, 220.00]; // Climax A dramatic
    }

    freqs.forEach(freq => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.connect(masterGain);
      osc.start();
      this.musicOscillators.push(osc);
    });
  }
}

export const audioManager = new DetectiveAudioManager();
