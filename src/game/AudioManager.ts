export class AudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.initializeAudio();
  }

  private async initializeAudio(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await this.createSounds();
    } catch (error) {
      console.warn('Audio not supported:', error);
      this.enabled = false;
    }
  }

  private async createSounds(): Promise<void> {
    if (!this.audioContext) return;

    // Create jump sound
    const jumpBuffer = this.createTone(220, 0.1, 'square');
    this.sounds.set('jump', jumpBuffer);

    // Create enemy defeat sound
    const defeatBuffer = this.createTone(440, 0.2, 'sawtooth');
    this.sounds.set('defeat', defeatBuffer);

    // Create power-up sound
    const powerUpBuffer = this.createTone(660, 0.3, 'sine');
    this.sounds.set('powerup', powerUpBuffer);

    // Create level complete sound
    const levelCompleteBuffer = this.createMelody([523, 659, 784, 1047], 0.15);
    this.sounds.set('levelcomplete', levelCompleteBuffer);

    // Create game over sound
    const gameOverBuffer = this.createMelody([392, 349, 311, 262], 0.3);
    this.sounds.set('gameover', gameOverBuffer);

    // Create background music (simple loop)
    const bgMusicBuffer = this.createMelody([523, 587, 659, 698, 784, 698, 659, 587], 0.5);
    this.sounds.set('bgmusic', bgMusicBuffer);
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
      }

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
        const envelope = Math.exp(-t * 2);
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * this.volume;
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

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public async resumeContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}