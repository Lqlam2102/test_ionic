<template>
  <div class="h-100">
    <section id="page-incoming-call" class="margin-top-40">
      <!-- Incoming Call Info -->
      <div class="incoming-call-info box-shadow1 border-radius-18 bg-gradient-purple overflow-hidden mb-20">
        <div class="wrap-info-text bg-white pt-20 pb-20">
          <!-- Status Section -->
          <section class="wrap-status p-l-r-20 top-0 position-relative d-flex">
            <div class="wrap-status-text line-height-30">
              <span class="status-text">Có cuộc gọi đến</span>
              <div class="line-red-short"></div>
            </div>
          </section>

          <!-- Info Section -->
          <section class="wrap-info p-20">
            <div class="info-name pb-10">
              {{ callCenter.fromNumber }}
            </div>
            <div class="wrap-location d-flex gap-2">
              <span class="location-via">Ứng viên: </span>
              <span class="location-text">&nbsp;{{ callCenter.candidateName }}</span>
            </div>
          </section>
        </div>

        <!-- Background Section -->
        <section class="wrap-background bg-gradient-purple height-210 width-100-percent">
          <div class="wrap-avatar-round text-center">
            <img :src="avatar" class="mt-50" />
          </div>
        </section>
      </div>

      <!-- Incoming Call Actions -->
      <div class="incoming-call-action d-flex justify-content-between">
        <!-- Decline Button -->
        <button id="btn-incoming-decline"
          class="btn-action-incoming btn-round btn-red btn-size-55 d-table-cell border-0"
          @click="callCenter.rejectCall">
          <img :src="declineIcon" class="icon" style="transform: rotate(135deg)" />
        </button>

        <!-- Dotted Icons -->
        <img :src="dottedEndIcon" />
        <img :src="dottedCallIcon" />

        <!-- Accept Button -->
        <button id="btn-incoming-accept"
          class="btn-action-incoming btn-round btn-green btn-size-55 d-table-cell border-0"
          @click="callCenter.answerCall">
          <img :src="acceptIcon" class="icon" />
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import avatar from "@/callcenter/assets/stringee-widget/images/avatar.png";
import declineIcon from "@/callcenter/assets/stringee-widget/images/icon-phone.svg";
import acceptIcon from "@/callcenter/assets/stringee-widget/images/icon-phone.svg";
import dottedEndIcon from "@/callcenter/assets/stringee-widget/images/icon-dotted-end.svg";
import dottedCallIcon from "@/callcenter/assets/stringee-widget/images/icon-dotted-call.svg";

export default {
  name: "IncomingCall",
  data() {
    return {
      avatar,
      declineIcon,
      acceptIcon,
      dottedEndIcon,
      dottedCallIcon,
    };
  },
  props: {
    callCenter: {
      type: Object,
      required: true,
    }
  }
}
</script>

<style scoped>
/* Reset and base styles */
body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
form,
fieldset,
input,
textarea,
p,
blockquote,
th,
td {
  margin: 0;
  padding: 0;
}

html,
body {
  margin: 0;
  padding: 0;
}

* {
  outline: none;
}

button {
  cursor: pointer;
}

/* Utility classes */
.h-100 {
  height: 100%;
}

.mt-5 {
  margin-top: 5px;
}

.mb-20 {
  margin-bottom: 20px;
}

.pt-20 {
  padding-top: 20px;
}

.pb-20 {
  padding-bottom: 20px;
}

.p-l-r-20 {
  padding-left: 20px;
  padding-right: 20px;
}

.p-20 {
  padding: 20px;
}

.pb-10 {
  padding-bottom: 10px;
}

.top-0 {
  top: 0;
}

.position-relative {
  position: relative;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}

.text-center {
  text-align: center;
}

.line-height-30 {
  line-height: 30px !important;
}

.bg-white {
  background: #fff !important;
}

.bg-gradient-purple {
  background: linear-gradient(90deg, #818FF5 0%, #A0A4E9 93.03%);
}

.overflow-hidden {
  overflow: hidden;
}

.box-shadow1 {
  box-shadow: 0px 12px 45px rgba(51, 49, 140, 0.25);
}

.border-radius-18 {
  border-radius: 18px;
}

.width-100-percent {
  width: 100%;
}

.height-210 {
  height: 210px;
}

.mt-50 {
  margin-top: 50px;
}

.d-table-cell {
  display: table-cell;
}

.btn-round {
  border-radius: 3rem;
}

.btn-red {
  background: linear-gradient(262.92deg, #FF5B65 6.49%, #EF3B67 108.73%);
  box-shadow: 0px 4px 24px rgba(176, 43, 67, 0.25);
}

.btn-green {
  background: linear-gradient(262.92deg, #66D54B 6.49%, #17C653 108.73%);
  box-shadow: 0px 4px 24px rgba(50, 153, 150, 0.25);
}

.btn-size-55 {
  width: 55px;
  height: 55px;
}

.border-0 {
  border: none;
}

/* Component specific styles */
#page-incoming-call {
  height: calc(100% - 30px) !important;
}

.incoming-call-info {
  width: 90%;
  margin-left: 5%;
}

.incoming-call-action {
  width: 90%;
  margin-left: 5%;
}

.wrap-status {
  width: 100%;
}

.status-text {
  width: 100px;
  height: 15px;
  line-height: normal;
  font-size: 12px;
  letter-spacing: 0.03em;
  color: #BFBFC4;
}

.line-red-short {
  position: absolute;
  width: 30px;
  height: 2px;
  background: #FF5B65;
  border-radius: 12px;
}

.info-name {
  font-size: 24px;
  color: #333333;
}

.location-via {
  font-size: 12px;
  color: #BFBFC4;
}

.location-text {
  color: #7272aa;
}

.wrap-avatar-round img {
  border-radius: 36px;
  border: 4px solid #fff;
}

.btn-action-incoming {
  text-align: center;
}

.icon {
  vertical-align: middle;
}

/* Custom gap utility */
.gap-2 {
  gap: 0.5rem;
}
</style>