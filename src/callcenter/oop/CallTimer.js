// /callcenter/utils/CallTimer.js
export class CallTimer {
  constructor(state) {
    this.state = state;
    this.interval = null;
  }

  start() {
    this.state.callStartTime = new Date();
    this.state.callDuration = 0;

    this.stop();

    this.interval = setInterval(() => {
      this.state.callDuration++;
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.state.callStartTime) {
      const endTime = new Date();
      const totalSeconds = Math.floor((endTime - this.state.callStartTime) / 1000);
      this.state.callDuration = totalSeconds;
    }
  }

  clear() {
    this.state.callStartTime = null;
    this.state.callDuration = 0;
    this.stop();
  }

  getFormatted() {
    const minutes = Math.floor((this.state.callDuration % 3600) / 60);
    const seconds = this.state.callDuration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}
