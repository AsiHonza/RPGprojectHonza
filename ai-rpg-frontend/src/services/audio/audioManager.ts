/**
 * Aethelgard Audio & TTS Lifecycle Manager
 * Centralizes speech synthesis, audio streaming, aborting, and queue management.
 */

type VoiceType = "narrator" | "npc_muz" | "npc_zena";

export interface AudioQueueItem {
  text: string;
  type: VoiceType;
}

class AudioManager {
  private activeAudio: HTMLAudioElement | null = null;
  private activeBlobUrl: string | null = null;
  private abortController: AbortController | null = null;
  private isSpeaking: boolean = false;
  private listeners: Set<(speaking: boolean) => void> = new Set();

  /**
   * Subscribe to speaking state changes for reactive UI indicators.
   */
  public subscribeSpeaking(callback: (speaking: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isSpeaking);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private setSpeaking(speaking: boolean) {
    if (this.isSpeaking !== speaking) {
      this.isSpeaking = speaking;
      this.listeners.forEach((cb) => cb(speaking));
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Immediately stops any currently playing audio, aborts ongoing fetch requests,
   * revokes blob URLs, and terminates sequential queue processing.
   */
  public stopTts(): void {
    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch (e) {
        console.error("Error aborting TTS controller:", e);
      }
      this.abortController = null;
    }

    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
        this.activeAudio.src = "";
      } catch (e) {
        console.error("Error pausing active audio:", e);
      }
      this.activeAudio = null;
    }

    if (this.activeBlobUrl) {
      try {
        URL.revokeObjectURL(this.activeBlobUrl);
      } catch (e) {
        console.error("Error revoking blob URL:", e);
      }
      this.activeBlobUrl = null;
    }

    this.setSpeaking(false);
  }

  /**
   * Plays a single TTS phrase with an abort signal.
   */
  public async playSingleTts(
    apiUrl: string,
    text: string,
    voiceType: VoiceType = "narrator",
    provider: "elevenlabs" | "edge" = "elevenlabs",
    volume: number = 1.0,
    signal?: AbortSignal
  ): Promise<void> {
    if (!text || !text.trim()) return;
    if (signal?.aborted) return;

    let voice = "cs-CZ-AntoninNeural";
    if (voiceType === "npc_zena") voice = "cs-CZ-VlastaNeural";
    if (voiceType === "npc_muz") voice = "cs-CZ-AntoninNeural";

    const url = `${apiUrl}/tts?text=${encodeURIComponent(text)}&voice_type=${voiceType}&provider=${provider}&voice=${voice}`;

    return new Promise(async (resolve) => {
      let resolved = false;
      const safeResolve = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      if (signal?.aborted) {
        safeResolve();
        return;
      }

      const onAbort = () => {
        this.stopTts();
        safeResolve();
      };

      if (signal) {
        signal.addEventListener("abort", onAbort, { once: true });
      }

      try {
        const res = await fetch(url, { signal });
        if (signal?.aborted) {
          safeResolve();
          return;
        }

        const blob = await res.blob();
        if (signal?.aborted) {
          safeResolve();
          return;
        }

        const blobUrl = URL.createObjectURL(blob);
        this.activeBlobUrl = blobUrl;

        const audio = new Audio(blobUrl);
        audio.volume = Math.max(0, Math.min(1, volume));
        this.activeAudio = audio;

        audio.onended = () => {
          if (this.activeBlobUrl === blobUrl) {
            URL.revokeObjectURL(blobUrl);
            this.activeBlobUrl = null;
          }
          if (this.activeAudio === audio) {
            this.activeAudio = null;
          }
          safeResolve();
        };

        audio.onerror = () => {
          if (this.activeBlobUrl === blobUrl) {
            URL.revokeObjectURL(blobUrl);
            this.activeBlobUrl = null;
          }
          if (this.activeAudio === audio) {
            this.activeAudio = null;
          }
          safeResolve();
        };

        await audio.play();
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.warn("TTS playback warning:", err);
        }
        safeResolve();
      }
    });
  }

  /**
   * Plays a list of narrative phrases sequentially, immediately stopping any previous audio.
   */
  public async playSequence(
    apiUrl: string,
    texts: AudioQueueItem[],
    provider: "elevenlabs" | "edge" = "elevenlabs",
    volume: number = 1.0
  ): Promise<void> {
    // 1. Stop any currently playing speech immediately
    this.stopTts();

    if (!texts || texts.length === 0) return;

    // 2. Set up new AbortController
    const controller = new AbortController();
    this.abortController = controller;
    this.setSpeaking(true);

    try {
      for (const item of texts) {
        if (controller.signal.aborted) break;
        if (item.text && item.text.trim()) {
          await this.playSingleTts(
            apiUrl,
            item.text,
            item.type,
            provider,
            volume,
            controller.signal
          );
        }
      }
    } finally {
      if (this.abortController === controller) {
        this.abortController = null;
        this.setSpeaking(false);
      }
    }
  }
}

export const audioManager = new AudioManager();
