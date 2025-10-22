// /callcenter/utils/CallManager.js
export class CallManager {
  constructor(state, audioManager, callTimer) {
    this.state = state;
    this.audio = audioManager;
    this.timer = callTimer;
  }

  answerCall() {
    this.audio.stopRingtone();
    if (this.state.call) {
      this.state.answered = true;
      this.setCustomData();
      this.state.call.answer((res) => {
        this.state.incomingCallVisible = false;
        this.state.callStatus = "Đã trả lời";
        this.state.isInCall = true;
        this.audio.stopRingtone();
        this.timer.start();
      });
    }
  }

  rejectCall() {
    this.audio.stopRingtone();
    if (this.state.call) {
      this.state.call.reject(() => {
        this.state.incomingCallVisible = false;
        this.state.callStatus = "Đã từ chối";
        this.timer.clear();
      });
    }
  }

  hangup() {
    if (this.state.call) {
      this.state.call.hangup(() => {
        this.state.callStatus = "Cuộc gọi đã kết thúc";
        this.timer.stop();
        setTimeout(() => {
          this.state.isInCall = false;
        }, 1000);
      });
    }
  }

  setCustomData() {
    if (this.state.customDataTmp?.id) this.state.customData = this.state.customDataTmp;
    else this.state.customData = {};
  }

  getFormattedCallDuration() {
    return this.timer.getFormatted();
  }
}