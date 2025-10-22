// /callcenter/utils/AudioManager.js
export class AudioManager {
  constructor(audioSrc) {
    this.audio = new Audio(audioSrc);
    this.audio.loop = true;
    this.audio.volume = 0.3;
  }

  playRingtone() {
    if (this.audio.paused) {
      this.audio.play().catch((e) => console.warn("Không thể phát âm thanh:", e));
    }
  }

  stopRingtone() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  attachRemoteStream(stream) {
    let audio = document.getElementById("stringee-remote-audio");
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "stringee-remote-audio";
      audio.autoplay = true;
      audio.playsInline = true;
      audio.style.display = "none";
      document.body.appendChild(audio);
    }
    audio.srcObject = stream;
    audio.play().catch((err) => console.error("Audio play error:", err));
  }
}