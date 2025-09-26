export class AudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.7;
  private backgroundMusic: AudioBufferSourceNode | null = null;
  private musicGainNode: GainNode | null = null;

  constructor() {
    this.initializeAudio();
  }

  private async initializeAudio(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context on user interaction
      document.addEventListener('touchstart', () => this.resumeContext(), { once: true });
      document.addEventListener('click', () => this.resumeContext(), { once: true });
      
      await this.createSounds();
    } catch (error) {
      console.warn('Audio not supported:', error);
      this.enabled = false;
    }
  }

  private async createSounds(): Promise<void> {
    if (!this.audioContext) return;

    // Create jump sound - more professional
    const jumpBuffer = this.createComplexTone([220, 330, 440], 0.15, 'sine');
    this.sounds.set('jump', jumpBuffer);

    // Create enemy defeat sound
    const defeatBuffer = this.createComplexTone([880, 660, 440, 220], 0.3, 'square');
    this.sounds.set('defeat', defeatBuffer);

    // Create power-up sound - ascending notes
    const powerUpBuffer = this.createMelody([523, 659, 784, 1047, 1319], 0.1);
    this.sounds.set('powerup', powerUpBuffer);

    // Create level complete sound - victory fanfare
    const levelCompleteBuffer = this.createMelody([523, 659, 784, 1047, 784, 1047, 1319], 0.2);
    this.sounds.set('levelcomplete', levelCompleteBuffer);

    // Create game over sound - descending
    const gameOverBuffer = this.createMelody([523, 466, 415, 370, 330, 294], 0.25);
    this.sounds.set('gameover', gameOverBuffer);

    // Create coin/collect sound
    const coinBuffer = this.createComplexTone([1047, 1319], 0.1, 'sine');
    this.sounds.set('coin', coinBuffer);

    // Create hurt sound
    const hurtBuffer = this.createComplexTone([200, 150], 0.2, 'sawtooth');
    this.sounds.set('hurt', hurtBuffer);

    // Create menu select sound
    const menuBuffer = this.createTone(660, 0.1, 'sine');
    this.sounds.set('menu', menuBuffer);

    // Create ambient/bird sounds
    const birdBuffer = this.createBirdSound();
    this.sounds.set('bird', birdBuffer);

    // Create background music - simple loop
    const bgMusicBuffer = this.createBackgroundMusic();
    this.sounds.set('bgmusic', bgMusicBuffer);

    // Create footstep sound
    const footstepBuffer = this.createTone(100, 0.05, 'square');
    this.sounds.set('footstep', footstepBuffer);
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not available');

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          sample = Math.sign(Math.sin(2 * Math.PI * frequency * t));
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        case 'triangle':
          sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
          break;
      }

      // Apply envelope
      const envelope = Math.exp(-t * 5);
      data[i] = sample * envelope * this.volume;
    }

    return buffer;
  }

  private createComplexTone(frequencies: number[], duration: number, type: OscillatorType = 'sine'): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not available');

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      // Mix multiple frequencies
      frequencies.forEach((freq, index) => {
        const amplitude = 1 / frequencies.length;
        switch (type) {
          case 'sine':
            sample += Math.sin(2 * Math.PI * freq * t) * amplitude;
            break;
          case 'square':
            sample += Math.sign(Math.sin(2 * Math.PI * freq * t)) * amplitude;
            break;
          case 'sawtooth':
            sample += 2 * (t * freq - Math.floor(t * freq + 0.5)) * amplitude;
            break;
        }
      });

      // Apply envelope
      const envelope = Math.exp(-t * 3);
      data[i] = sample * envelope * this.volume;
    }

    return buffer;
  }

  private createMelody(frequencies: number[], noteDuration: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not available');

    const sampleRate = this.audioContext.sampleRate;
    const totalDuration = frequencies.length * noteDuration;
    const buffer = this.audioContext.createBuffer(1, totalDuration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    frequencies.forEach((freq, noteIndex) => {
      const startSample = noteIndex * noteDuration * sampleRate;
      const endSample = (noteIndex + 1) * noteDuration * sampleRate;

      for (let i = startSample; i < endSample && i < data.length; i++) {
        const t = (i - startSample) / sampleRate;
        const envelope = Math.exp(-t * 4);
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * this.volume;
      }
    });

    return buffer;
  }

  private createBirdSound(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not available');

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.5;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const freq = 800 + Math.sin(t * 20) * 200; // Warbling frequency
      const envelope = Math.exp(-t * 2) * (1 - t / duration);
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * this.volume * 0.3;
    }

    return buffer;
  }

  private createBackgroundMusic(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not available');

    const melody = [523, 587, 659, 698, 784, 698, 659, 587, 523, 466, 523, 587];
    const sampleRate = this.audioContext.sampleRate;
    const noteDuration = 0.5;
    const totalDuration = melody.length * noteDuration;
    const buffer = this.audioContext.createBuffer(1, totalDuration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    melody.forEach((freq, noteIndex) => {
      const startSample = noteIndex * noteDuration * sampleRate;
      const endSample = (noteIndex + 1) * noteDuration * sampleRate;

      for (let i = startSample; i < endSample && i < data.length; i++) {
        const t = (i - startSample) / sampleRate;
        const envelope = 0.3 * (1 - Math.abs(t - noteDuration/2) / (noteDuration/2));
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * this.volume * 0.2;
      }
    });

    return buffer;
  }

  public playSound(soundName: string): void {
    if (!this.enabled || !this.audioContext || !this.sounds.has(soundName)) return;

    try {
      const buffer = this.sounds.get(soundName)!;
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      gainNode.gain.value = this.volume;

      source.start();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  public playBackgroundMusic(): void {
    if (!this.enabled || !this.audioContext || !this.sounds.has('bgmusic')) return;

    try {
      this.stopBackgroundMusic();
      
      const buffer = this.sounds.get('bgmusic')!;
      this.backgroundMusic = this.audioContext.createBufferSource();
      this.musicGainNode = this.audioContext.createGain();

      this.backgroundMusic.buffer = buffer;
      this.backgroundMusic.loop = true;
      this.backgroundMusic.connect(this.musicGainNode);
      this.musicGainNode.connect(this.audioContext.destination);
      this.musicGainNode.gain.value = this.volume * 0.3;

      this.backgroundMusic.start();
    } catch (error) {
      console.warn('Error playing background music:', error);
    }
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
      this.backgroundMusic = null;
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.volume * 0.3;
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
    }
  }

  public async resumeContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}