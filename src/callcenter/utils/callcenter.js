/* eslint-disable */
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import { reactive, ref } from "vue";
import { StringeeClient, StringeeCall } from "stringee";
import Boy from "@/assets/images/users/boy.png";
import ringtoneSound from "@/callcenter/assets/ringtone.mp3";
import { errorToast } from "@/helpers/api/toastStyle";
import { convertToInternational } from "@/helpers/utils/phoneNumber.js";

export const CLIENT_TOKEN = ref(null);

export const CallCenter = reactive({
  callWidget: null,
  stringeeClient: null,
  call: null,
  isLoggedIn: false,
  authenticatedWithUserId: null,
  loggedUserId: null,
  incomingCallFrom: null,
  incomingCallVisible: false,
  callStatus: null,
  callType: null,
  isInCall: false,
  baseNumber: null,
  fromNumber: null,
  toNumber: null,
  avatarUrl: Boy,
  contactName: null,
  accessToken: null,
  callDuration: 0, // Thời gian cuộc gọi tính bằng giây
  callDurationInterval: null, // Biến lưu trữ interval
  callStartTime: null, // Thời điểm bắt đầu cuộc gọi
  ringtoneAudio: new Audio(ringtoneSound),
  isAuth: false,
  customData: {},
  customDataTmp: {},
  candidateId: null,
  answered: false,

  async init(widget) {
    this.callWidget = widget;
    const isAuth = await this.login();
    return isAuth;
  },

  async login() {
    try {
      const data = await useFetch(API_SERVER_URL + "/call-center/v1/token");
      if (data?.error) {
        if (data?.status != 403) errorToast(data?.msg);
        return false;
      }
      this.accessToken = data.token;
      this.baseNumber = data.from;
    } catch {
      errorToast("Lỗi không thể lấy call token!");
      return false;
    }
    this.isAuth = true;

    this.loggedUserId = "Connecting...";
    this.stringeeClient = new StringeeClient();
    this.stringeeClient.connect(this.accessToken);

    this.stringeeClient.on("authen", (res) => {
      if (res.r === 0) {
        this.isLoggedIn = true;
        this.authenticatedWithUserId = res.userId;
        this.loggedUserId = this.authenticatedWithUserId;
      } else {
        this.loggedUserId = res.message;
      }
    });

    this.stringeeClient.on("incomingcall", (incomingcall) => {
      this.answered = false;
      this.call = incomingcall;
      this.incomingCallFrom = incomingcall.fromNumber;
      this.fromNumber = incomingcall.fromNumber;
      this.callStatus = "Cuộc gọi đến";

      this.getCustomDataFromServer(this.call);

      this.incomingCallVisible = true;
      this.startRingtone();
      this.callWidget.open();

      this.attachSignalingEvents(this.call, "incoming");
    });

    return true;
  },

  makeCall(callTo, name, candidateId, avatar) {
    if (!callTo || !this.isAuth) return;
    this.answered = false;
    this.candidateId = candidateId;
    this.candidateName = name;
    this.avatarUrl = avatar;
    this.toNumber = callTo;
    const from = this.baseNumber || this.authenticatedWithUserId;
    this.call = new StringeeCall(
      this.stringeeClient,
      from,
      convertToInternational(callTo)
    );
    this.callWidget.open();
    this.call.makeCall((res) => {
      if (res.r !== 0) {
        this.callStatus = res.message;
      } else {
        this.callType =
          res.toType === "internal" ? "App-to-App call" : "App-to-Phone call";
        this.isInCall = true;

        this.attachSignalingEvents(this.call);
      }
    });
  },

  answerCall() {
    this.stopRingtone();
    if (this.call) {
      this.answered = true;
      this.setCustomData();
      this.call.answer((res) => {
        this.incomingCallVisible = false;
        this.callStatus = "Đã trả lời";
        this.isInCall = true;
        this.stopRingtone();
        this.startCallTimer();
      });
    }
  },

  rejectCall() {
    this.stopRingtone();
    if (this.call) {
      this.call.reject((res) => {
        this.incomingCallVisible = false;
        this.callStatus = "Đã từ chối";
        this.stopCallTimer();
        setTimeout(() => {
          this.incomingCallVisible = false;
        }, 1000);
      });
    }
  },

  hangup() {
    if (this.call) {
      this.call.hangup((res) => {
        this.callStatus = "Cuộc gọi đã kết thúc";
        this.stopCallTimer();
        setTimeout(() => {
          this.isInCall = false;
        }, 1000);
      });
    }
  },

  startCallTimer() {
    this.callStartTime = new Date();
    this.callDuration = 0;

    this.clearCallDuration();

    this.callDurationInterval = setInterval(() => {
      this.callDuration++;

      const hours = Math.floor(this.callDuration / 3600);
      const minutes = Math.floor((this.callDuration % 3600) / 60);
      const seconds = this.callDuration % 60;

      this.callStatus = `Đang gọi ${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
  },

  stopCallTimer() {
    this.clearCallDuration();

    if (this.callStartTime) {
      const endTime = new Date();
      const totalSeconds = Math.floor((endTime - this.callStartTime) / 1000);
      this.callDuration = totalSeconds;
    }
  },

  clearCallDuration() {
    this.callDuration = 0;
    this.callStartTime = null;
    if (this.callDurationInterval) {
      clearInterval(this.callDurationInterval);
      this.callDurationInterval = null;
    }
  },

  getFormattedCallDuration() {
    const minutes = Math.floor((this.callDuration % 3600) / 60);
    const seconds = this.callDuration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  },

  startRingtone() {
    if (this.ringtoneAudio && this.ringtoneAudio.paused) {
      this.ringtoneAudio.loop = true;
      this.ringtoneAudio.volume = 0.3;
      this.ringtoneAudio
        .play()
        .catch((e) => console.warn("Không thể phát âm thanh:", e));
    }
  },

  stopRingtone() {
    if (this.ringtoneAudio) {
      this.ringtoneAudio.pause();
      this.ringtoneAudio.currentTime = 0;
    }
  },

  attachSignalingEvents(call, callDirection = "outgoing") {
    call.on("signalingstate", (state) => {
      switch (state.code) {
        case 0:
          this.callStatus =
            callDirection === "incoming"
              ? "Cuộc gọi đến đang khởi tạo..."
              : "Đang khởi tạo cuộc gọi...";
          break;
        case 1:
          this.callStatus = "Đang gọi...";
          break;
        case 2:
          this.callStatus =
            callDirection === "incoming"
              ? "Đang đổ chuông tới bạn..."
              : "Máy bên kia đang đổ chuông...";
          break;
        case 3:
          this.callStatus = "Đang thiết lập kết nối...";
          this.isInCall = true;
          this.startCallTimer();
          this.stopRingtone();
          break;
        case 4:
          this.callStatus = "Đã kết nối";
          this.isInCall = true;
          this.startCallTimer();
          this.stopRingtone();
          break;
        case 5:
          this.callStatus = "Người nhận đang bận";
          this.isInCall = false;
          this.stopRingtone();
          break;
        case 6:
          this.callStatus = `Cuộc gọi kết thúc: ${state.reason}`;
          this.isInCall = false;
          this.incomingCallVisible = false;
          this.rejectCall();
          this.hangup();
          this.stopCallTimer();
          this.stopRingtone();
          break;
        default:
          this.callStatus = `Trạng thái không xác định: ${state.code}`;
          break;
      }
    });

    call.on("addremotestream", (stream) => {
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

      audio.play().catch((err) => {
        console.error("Audio play error:", err);
      });
    });

    call.on("otherdevice", (msg) => {
      if (msg.code == 200 || msg.code == 486) {
        if (!this.answered) this.rejectCall();
      }
    });
  },

  getCustomDataFromServer(call) {
    const dataFromServer = call?.customDataFromYourServer;

    this.customDataTmp = {};
    this.candidateName = "Mới";

    if (dataFromServer) {
      const data = JSON.parse(dataFromServer);
      if (!data?.customerInfo) return;

      const customerInfo = JSON.parse(data?.customerInfo);
      this.customDataTmp = customerInfo;
      this.candidateName = customerInfo.name;
    }
  },

  setCustomData() {
    console.log("SET CUSTOMDAT: ", this.customDataTmp)
    if (this.customDataTmp?.id) this.customData = this.customDataTmp;
    else this.customData = {};
  },
});