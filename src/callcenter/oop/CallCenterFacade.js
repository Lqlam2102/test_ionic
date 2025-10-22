// /callcenter/utils/CallCenterFacade.js
import { StringeeClient, StringeeCall } from "stringee";
import { CallCenterState } from "./state";
import { fetchCallToken } from "./api";

export class CallCenterFacade {
  constructor(audioManager, callManager) {
    this.state = CallCenterState;
    this.audio = audioManager;
    this.callManager = callManager;
  }

  async init(widget) {
    this.state.callWidget = widget;
    const tokenData = await fetchCallToken();
    if (!tokenData) return false;

    this.state.accessToken = tokenData.token;
    this.state.baseNumber = tokenData.from;
    this.state.isAuth = true;
    this.state.loggedUserId = "Connecting...";

    this.state.stringeeClient = new StringeeClient();
    this.state.stringeeClient.connect(this.state.accessToken);

    this.state.stringeeClient.on("authen", (res) => {
      if (res.r === 0) {
        this.state.isLoggedIn = true;
        this.state.authenticatedWithUserId = res.userId;
        this.state.loggedUserId = res.userId;
      } else {
        this.state.loggedUserId = res.message;
      }
    });

    this.state.stringeeClient.on("incomingcall", (incomingCall) => {
      this.state.answered = false;
      this.state.call = incomingCall;
      this.state.incomingCallFrom = incomingCall.fromNumber;
      this.state.fromNumber = incomingCall.fromNumber;
      this.state.callStatus = "Cuộc gọi đến";
      this.state.incomingCallVisible = true;

      const customData = incomingCall?.customDataFromYourServer;
      this.state.customDataTmp = {};
      this.state.candidateName = "Mới";
      if (customData) {
        const parsed = JSON.parse(customData);
        if (parsed?.customerInfo) {
          this.state.customDataTmp = JSON.parse(parsed.customerInfo);
          this.state.candidateName = this.state.customDataTmp.name;
        }
      }

      this.audio.playRingtone();
      this.state.callWidget.open();
      this.attachSignalingEvents(incomingCall, "incoming");
    });

    return true;
  }

  attachSignalingEvents(call, direction = "outgoing") {
    call.on("signalingstate", (state) => {
      switch (state.code) {
        case 0:
          this.state.callStatus = direction === "incoming" ? "Cuộc gọi đến đang khởi tạo..." : "Đang khởi tạo cuộc gọi...";
          break;
        case 1:
          this.state.callStatus = "Đang gọi...";
          break;
        case 2:
          this.state.callStatus = direction === "incoming" ? "Đang đổ chuông tới bạn..." : "Máy bên kia đang đổ chuông...";
          break;
        case 3:
        case 4:
          this.state.callStatus = "Đã kết nối";
          this.state.isInCall = true;
          this.audio.stopRingtone();
          this.callManager.timer.start();
          break;
        case 5:
          this.state.callStatus = "Người nhận đang bận";
          this.state.isInCall = false;
          this.audio.stopRingtone();
          break;
        case 6:
          this.state.callStatus = `Cuộc gọi kết thúc: ${state.reason}`;
          this.state.isInCall = false;
          this.state.incomingCallVisible = false;
          this.callManager.rejectCall();
          this.callManager.hangup();
          break;
        default:
          this.state.callStatus = `Trạng thái không xác định: ${state.code}`;
          break;
      }
    });

    call.on("addremotestream", (stream) => {
      this.audio.attachRemoteStream(stream);
    });

    call.on("otherdevice", (msg) => {
      if (msg.code === 200 || msg.code === 486) {
        if (!this.state.answered) this.callManager.rejectCall();
      }
    });
  }
}
