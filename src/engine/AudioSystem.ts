import { Logger } from './Logger';
import { AssetManager } from './AssetManager';

export class AudioSystem {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private musicGain: GainNode;
  private sfxGain: GainNode;
  private isMuted: boolean = false;
  private logger: Logger;
  private currentMusic: OscillatorNode | AudioBufferSourceNode | null = null;
  private loadedSounds: Map<string, AudioBuffer> = new Map();
  private assetManager: AssetManager;

  constructor() {
    this.logger = Logger.getInstance();
    this.assetManager = new AssetManager(); // Or pass it in if shared

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.setupAudioNodes();
      this.logger.info('AudioSystem initialized');
    } catch (error) {
      this.logger.error('Web Audio API not supported', error);
      // Create dummy context to prevent crashes
      this.audioContext = {
        createGain: () => ({ connect: () => { }, gain: { value: 0 } }),
        currentTime: 0,
        resume: () => Promise.resolve(),
        destination: {}
      } as any;
    }
  }

  private setupAudioNodes(): void {
    this.masterGain = this.audioContext.createGain();
    this.musicGain = this.audioContext.createGain();
    this.sfxGain = this.audioContext.createGain();

    this.masterGain.connect(this.audioContext.destination);
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);

    this.masterGain.gain.value = 0.5;
    this.musicGain.gain.value = 0.5;
    this.sfxGain.gain.value = 0.8;
  }

  public async loadSound(key: string, url: string): Promise<void> {
    try {
      const arrayBuffer = await this.assetManager.loadAsset(key, url, 'audio');
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer.slice(0)); // slice to clone if needed
      this.loadedSounds.set(key, audioBuffer);
      this.logger.info(`Sound loaded: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to load sound: ${key}`, error);
    }
  }

  public playSound(name: string): void {
    if (this.isMuted) return;

    // Resume context if suspended (browser policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Check if we have a loaded external sound
    if (this.loadedSounds.has(name)) {
      this.playLoadedSound(name);
      return;
    }

    // Fallback to synthesized sounds
    switch (name) {
      case 'jump':
        this.playJumpSound();
        break;
      case 'coin':
        this.playCoinSound();
        break;
      case 'shoot':
        this.playShootSound();
        break;
      case 'explosion':
        this.playExplosionSound();
        break;
      case 'powerup':
        this.playPowerupSound();
        break;
      case 'hurt':
        this.playHurtSound();
        break;
      case 'gameover':
        this.playGameOverSound();
        break;
      case 'levelcomplete':
        this.playLevelCompleteSound();
        break;
      case 'bird':
        this.playBirdSound();
        break;
      default:
        this.logger.warn(`Sound not found: ${name}`);
    }
  }

  public playLoadedSound(name: string): void {
    const buffer = this.loadedSounds.get(name);
    if (buffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.sfxGain);
      source.start(0);
    }
  }

  public playMusic(name: string): void {
    if (this.isMuted) return;

    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }

    // Check if we have loaded music
    if (this.loadedSounds.has(name)) {
      const buffer = this.loadedSounds.get(name);
      if (buffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(this.musicGain);
        source.start(0);
        this.currentMusic = source;
        return;
      }
    }

    // Fallback to synthesized music
    if (name === 'bgmusic') {
      this.playBackgroundMusic();
    }
  }

  public stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.masterGain.gain.value = 0;
    } else {
      this.masterGain.gain.value = 0.5;
    }
  }

  // --- Synthesized Sound Methods (Fallback) ---

  private playJumpSound(): void {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1);

    gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  private playCoinSound(): void {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    osc.frequency.setValueAtTime(1500, this.audioContext.currentTime + 0.1);

    gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  private playShootSound(): void {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  private playExplosionSound(): void {
    const bufferSize = this.audioContext.sampleRate * 0.5; // 0.5 seconds
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    const gain = this.audioContext.createGain();

    noise.connect(gain);
    gain.connect(this.sfxGain);

    gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

    noise.start();
  }

  private playPowerupSound(): void {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(1000, this.audioContext.currentTime + 0.3);

    gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  private playHurtSound(): void {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.1);

    gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  private playGameOverSound(): void {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
    osc.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 1.0);

    gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1.0);

    osc.start();
    osc.stop(this.audioContext.currentTime + 1.0);
  }

  private playLevelCompleteSound(): void {
    // Simple arpeggio
    const notes = [440, 554, 659, 880]; // A major
    let time = this.audioContext.currentTime;

    notes.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.type = 'sine';
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.3, time + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, time + index * 0.1 + 0.3);

      osc.start(time + index * 0.1);
      osc.stop(time + index * 0.1 + 0.3);
    });
  }

  private playBirdSound(): void {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, this.audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(2000, this.audioContext.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  private playBackgroundMusic(): void {
    // Simple bass loop
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, this.audioContext.currentTime); // A2

    // LFO for some movement
    const lfo = this.audioContext.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 2; // 2 Hz
    const lfoGain = this.audioContext.createGain();
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    gain.gain.value = 0.2;

    osc.start();
    this.currentMusic = osc;
  }
}