/**
 * Professional Audio System
 * Handles all audio playback, mixing, and management
 */

import { Logger } from './Logger';

export interface AudioConfig {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  enabled: boolean;
}

export interface Sound {
  id: string;
  buffer: AudioBuffer;
  category: 'music' | 'sfx';
}

export class AudioSystem {
  private logger: Logger;
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, Sound> = new Map();
  private config: AudioConfig;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private masterGainNode: GainNode | null = null;
  private currentMusic: AudioBufferSourceNode | null = null;

  constructor() {
    this.logger = Logger.getInstance();
    this.config = {
      masterVolume: 0.7,
      musicVolume: 0.5,
      sfxVolume: 0.8,
      enabled: true
    };

    this.initializeAudio();
  }

  private async initializeAudio(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create gain nodes for mixing
      this.masterGainNode = this.audioContext.createGain();
      this.musicGainNode = this.audioContext.createGain();
      this.sfxGainNode = this.audioContext.createGain();

      // Connect gain nodes
      this.musicGainNode.connect(this.masterGainNode);
      this.sfxGainNode.connect(this.masterGainNode);
      this.masterGainNode.connect(this.audioContext.destination);

      // Set initial volumes
      this.updateVolumes();

      // Resume context on user interaction
      document.addEventListener('touchstart', () => this.resumeContext(), { once: true });
      document.addEventListener('click', () => this.resumeContext(), { once: true });

      await this.createSounds();

      this.logger.info('AudioSystem initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize AudioSystem', error);
      this.config.enabled = false;
    }
  }

  private async createSounds(): Promise<void> {
    if (!this.audioContext) return;

    const soundDefinitions = [
      { id: 'jump', frequencies: [220], duration: 0.2, type: 'sine' as OscillatorType, category: 'sfx' as const, slide: true },
      { id: 'defeat', frequencies: [880, 660, 440, 220], duration: 0.3, type: 'square' as OscillatorType, category: 'sfx' as const },
      { id: 'powerup', frequencies: [523, 659, 784, 1047, 1319], duration: 0.1, type: 'sine' as OscillatorType, category: 'sfx' as const },
      { id: 'coin', frequencies: [1047, 1319], duration: 0.1, type: 'sine' as OscillatorType, category: 'sfx' as const },
      { id: 'hurt', frequencies: [200, 150], duration: 0.2, type: 'sawtooth' as OscillatorType, category: 'sfx' as const },
      { id: 'levelcomplete', frequencies: [523, 659, 784, 1047, 784, 1047, 1319], duration: 0.2, type: 'sine' as OscillatorType, category: 'sfx' as const },
      { id: 'gameover', frequencies: [523, 466, 415, 370, 330, 294], duration: 0.25, type: 'sine' as OscillatorType, category: 'sfx' as const },
      { id: 'menu', frequencies: [660], duration: 0.1, type: 'sine' as OscillatorType, category: 'sfx' as const },
      { id: 'bird', frequencies: [800, 1000, 600], duration: 0.5, type: 'sine' as OscillatorType, category: 'sfx' as const }
    ];

    for (const def of soundDefinitions) {
      try {
        const buffer = this.createSoundBuffer(def.frequencies, def.duration, def.type, def.slide);
        this.sounds.set(def.id, { id: def.id, buffer, category: def.category });
      } catch (error) {
        this.logger.warn(`Failed to create sound: ${def.id}`, error);
      }
    }

    // Create background music
    try {
      const musicBuffer = this.createMusicBuffer();
      this.sounds.set('bgmusic', { id: 'bgmusic', buffer: musicBuffer, category: 'music' });
    } catch (error) {
      this.logger.warn('Failed to create background music', error);
    }
  }

  private createSoundBuffer(frequencies: number[], duration: number, type: OscillatorType, slide: boolean = false): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not available');

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      // Mix multiple frequencies
      frequencies.forEach((freq, index) => {
        const amplitude = 1 / frequencies.length;
        let currentFreq = freq;

        if (slide) {
          // Slide frequency up (classic jump sound)
          currentFreq = freq + (t / duration) * 400;
        }

        switch (type) {
          case 'sine':
            sample += Math.sin(2 * Math.PI * currentFreq * t) * amplitude;
            break;
          case 'square':
            sample += Math.sign(Math.sin(2 * Math.PI * currentFreq * t)) * amplitude;
            break;
          case 'sawtooth':
            sample += 2 * (t * currentFreq - Math.floor(t * currentFreq + 0.5)) * amplitude;
            break;
        }
      });

      // Apply envelope
      const envelope = Math.exp(-t * 3);
      data[i] = sample * envelope * 0.3;
    }

    return buffer;
  }

  private createMusicBuffer(): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not available');

    // A slightly more complex melody (Mario-ish style)
    const melody = [
      659, 659, 0, 659, 0, 523, 659, 0, 784, 0, 0, 0, 392, 0, 0, 0, // E E E C E G G
      523, 0, 0, 392, 0, 0, 330, 0, 0, 440, 0, 494, 0, 466, 440, 0  // C G E A B Bb A
    ];
    const sampleRate = this.audioContext.sampleRate;
    const noteDuration = 0.15; // Faster tempo
    const totalDuration = melody.length * noteDuration;
    const buffer = this.audioContext.createBuffer(1, totalDuration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    melody.forEach((freq, noteIndex) => {
      if (freq === 0) return; // Rest

      const startSample = Math.floor(noteIndex * noteDuration * sampleRate);
      const endSample = Math.floor((noteIndex + 1) * noteDuration * sampleRate);

      for (let i = startSample; i < endSample && i < data.length; i++) {
        const t = (i - startSample) / sampleRate;
        // Short decay for staccato feel
        const envelope = Math.exp(-t * 10);

        // Square wave for retro feel
        const sample = Math.sign(Math.sin(2 * Math.PI * freq * t)) * 0.1;

        data[i] += sample * envelope;
      }
    });

    return buffer;
  }

  public playSound(soundId: string): void {
    if (!this.config.enabled || !this.audioContext || !this.sounds.has(soundId)) {
      return;
    }

    try {
      const sound = this.sounds.get(soundId)!;
      const source = this.audioContext.createBufferSource();

      source.buffer = sound.buffer;

      // Connect to appropriate gain node
      const gainNode = sound.category === 'music' ? this.musicGainNode : this.sfxGainNode;
      source.connect(gainNode!);

      source.start();

      this.logger.debug(`Playing sound: ${soundId}`);
    } catch (error) {
      this.logger.warn(`Failed to play sound: ${soundId}`, error);
    }
  }

  public playMusic(musicId: string = 'bgmusic', loop: boolean = true): void {
    if (!this.config.enabled || !this.audioContext || !this.sounds.has(musicId)) {
      return;
    }

    try {
      this.stopMusic();

      const music = this.sounds.get(musicId)!;
      this.currentMusic = this.audioContext.createBufferSource();

      this.currentMusic.buffer = music.buffer;
      this.currentMusic.loop = loop;
      this.currentMusic.connect(this.musicGainNode!);

      this.currentMusic.start();

      this.logger.info(`Playing music: ${musicId}`);
    } catch (error) {
      this.logger.warn(`Failed to play music: ${musicId}`, error);
    }
  }

  public stopMusic(): void {
    if (this.currentMusic) {
      try {
        this.currentMusic.stop();
        this.currentMusic = null;
        this.logger.debug('Music stopped');
      } catch (error) {
        this.logger.warn('Failed to stop music', error);
      }
    }
  }

  public setMasterVolume(volume: number): void {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  public setMusicVolume(volume: number): void {
    this.config.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  public setSfxVolume(volume: number): void {
    this.config.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  private updateVolumes(): void {
    if (this.masterGainNode) {
      this.masterGainNode.gain.value = this.config.masterVolume;
    }
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.config.musicVolume;
    }
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.config.sfxVolume;
    }
  }

  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  public async resumeContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      this.logger.debug('AudioContext resumed');
    }
  }

  public update(deltaTime: number): void {
    // Audio system update logic if needed
  }

  public getConfig(): AudioConfig {
    return { ...this.config };
  }
}