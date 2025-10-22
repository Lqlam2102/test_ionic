// /callcenter/utils/state.js
import { reactive, ref } from "vue";

export const CallCenterState = reactive({
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
  avatarUrl: null,
  contactName: null,
  accessToken: null,
  callDuration: 0,
  callDurationInterval: null,
  callStartTime: null,
  isAuth: false,
  customData: {},
  customDataTmp: {},
  candidateId: null,
  answered: false,
});

export const CLIENT_TOKEN = ref(null);