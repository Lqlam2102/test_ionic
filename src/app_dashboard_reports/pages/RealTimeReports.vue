<script setup>
import { onMounted, onBeforeUnmount, ref, reactive } from "vue";
import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import Widget from "../components/widget.vue";
import BarChart from "../components/BarChart.vue";
import DepartmentAmount from "../components/DepartmentAmount.vue";
import DepartmentCandidate from "../components/DepartmentCandidate.vue";
import CandidateWorker from "../components/CandidateWorker.vue";
import { getAccessToken } from "@/helpers/api/token";
import { WS } from "@/helpers/utils/config_system";
import {
  openFullscreen,
  closeFullscreen,
} from "../../base/common/fullscreen.js";

const reportData = ref({
  "recruitment-stats": false,
  "campaign-stats": false,
  "department-stats": false,
  "department-candidates-stats": false,
  "candidates-workers": false,
});
const ActionBar = reactive({
  isFullScreen: false,
  showActionBar: false,
});

const handleMouseMove = () => {
  ActionBar.showActionBar = true;
  clearTimeout(window._actionBarTimeout);
  window._actionBarTimeout = setTimeout(() => {
    ActionBar.showActionBar = false;
  }, 2000); // 2s tự ẩn
};
let socket = null;

const connectWebSocket = () => {
  socket = new WebSocket(
    `${WS}/ws/report/?token=${getAccessToken().replace("Bearer ", "")}`
  );

  socket.onopen = () => {
    console.log(" WebSocket connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(" WS Message:", data);
      reportData.value = data;
    } catch (e) {
      console.error(" WS Parse Error", e);
    }
  };

  socket.onclose = () => {
    console.warn(" WebSocket closed");
  };

  socket.onerror = (err) => {
    console.error(" WebSocket error", err);
  };
};

const handleClickFullscreen = () => {
  ActionBar.isFullScreen = true;
  openFullscreen();
};
const handleClickCloseFullscreen = () => {
  ActionBar.isFullScreen = false;
  closeFullscreen();
};
// Hàm xử lý khi user nhấn ESC hoặc thoát fullscreen theo cách khác
function handleFullscreenChange() {
  const isActive = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );

  if (!isActive) {
    ActionBar.isFullScreen = false;
  }
}

onMounted(() => {
  connectWebSocket();
  window.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("msfullscreenchange", handleFullscreenChange);
});

onBeforeUnmount(() => {
  if (socket) socket.close();
  window.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener(
    "webkitfullscreenchange",
    handleFullscreenChange
  );
  document.removeEventListener("msfullscreenchange", handleFullscreenChange);
});
</script>

<template>
  <Layout
    :address="{
      title: 'Báo cáo thời gian thực',
    }"
    chooseMenu="ban-do"
  >
    <div class="chat-wrapper mx-n4 p-1 h-100 d-flex flex-column">
      <template v-if="ActionBar.showActionBar">
        <button
          v-if="!ActionBar.isFullScreen"
          @click="handleClickFullscreen"
          class="fullscreen-fixed-btn btn btn-soft-info btn-icon waves-effect waves-light"
        >
          <i class="bx bx-fullscreen"></i>
        </button>
        <button
          v-else
          @click="handleClickCloseFullscreen"
          class="fullscreen-fixed-btn btn btn-soft-info btn-icon waves-effect waves-light"
        >
          <i class="mdi mdi-arrow-collapse"></i>
        </button>
      </template>
      <div
        class="mb-0 flex-grow-1 position-relative pt-1"
        style="overflow: hidden auto"
        :class="{ 'view__fullscreen--dashboard': ActionBar.isFullScreen }"
      >
        <BRow class="py-1">
          <Widget :reportData="reportData" />
          <BCol class="px-1" xxl="8" md="12">
            <BarChart :reportData="reportData" />
          </BCol>
          <BCol class="px-0" xxl="4" md="12">
            <DepartmentAmount :reportData="reportData" />
          </BCol>
        </BRow>
        <BRow>
          <BCol xl="8" class="px-1">
            <CandidateWorker :reportData="reportData" />
          </BCol>
          <BCol xl="4" class="px-0">
            <DepartmentCandidate :reportData="reportData" />
          </BCol>
        </BRow>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.view__fullscreen--dashboard {
  position: fixed !important;
  inset: 0;
  z-index: 99999;
  padding: 15px;
  background-color: rgba(
    var(--vz-body-bg-rgb),
    var(--vz-bg-opacity)
  ) !important;
  --vz-bg-opacity: 1;
}
.fullscreen-fixed-btn {
  position: fixed;
  top: 50px;
  left: 50%;
  z-index: 100000;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  font-size: 2rem;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
