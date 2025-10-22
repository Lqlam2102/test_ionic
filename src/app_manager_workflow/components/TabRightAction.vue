<template>
  <div class="card mt-2 position-relative">
    <div id="myTab" class="tab" :class="{ collapsed: !isContentVisible }">
      <div class="content p-2" :class="{ show: isContentVisible }">
        <div class="d-flex align-items-center mb-2">
          <div class="flex-shrink-0 me-1">
            <i
              class="ri-user-settings-line fs-24 align-middle text-success me-1"
            ></i>
          </div>
          <div class="flex-grow-1">
            <h5 class="fs-16 mb-0 fw-semibold">{{ currentNode.name || "Không tên" }}</h5>
            <small v-if="currentNode.description" class="text-secondary">
              {{ currentNode.description }}
            </small>
          </div>
          <div>
            <i
              @click="setShowModalFullScreenSteps(true)"
              class="ri-fullscreen-line"
            ></i>
          </div>
        </div>
        <AccordionRecord title="Thông tin" class="card">
          <p>Đây là nội dung của tab</p>
        </AccordionRecord>
        <AccordionRecord title="Thiết lập" class="card">
          <p>Đây là nội dung của tab</p>
        </AccordionRecord>
        <AccordionRecord title="Cấu hình" class="card">
          <p>Đây là nội dung của tab</p>
        </AccordionRecord>
      </div>
      <div class="resizer" @mousedown="startResizing"></div>
    </div>
    <div
      class="toggle-button p-0 bg-white shadow border"
      @click="toggleContent"
    >
      <i
        :class="
          isContentVisible ? 'ri-arrow-right-s-fill' : 'ri-arrow-left-s-fill'
        "
        class="fs-16"
      ></i>
    </div>
  </div>
  <FullScreenSteps></FullScreenSteps>
</template>

<script setup>
import {
  isContentVisible,
  toggleContent,
  currentNode,
} from "../state/tab_right";
import AccordionRecord from "@/base/components/accordion/AccordionRecord.vue";
import { setShowModalFullScreenSteps } from "../state/modal_step";
import FullScreenSteps from "./modal/FullScreenSteps.vue";

import { onMounted, onBeforeUnmount } from "vue";

let isResizing = false;
let startX = 0;
let startWidth = 0;
const minWidth = 0;
const maxWidth = 600;

function onMouseMove(e) {
  e.preventDefault();
  if (!isResizing) return;
  let newWidth = startWidth - (e.clientX - startX); // đảo ngược
  newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
  document.getElementById("myTab").style.width = newWidth + "px";
}

function onMouseUp() {
  isResizing = false;
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
}

function startResizing(e) {
  isResizing = true;
  startX = e.clientX;
  startWidth = document.getElementById("myTab").offsetWidth;

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

onMounted(() => {
  document
    .querySelector("#myTab .resizer")
    .addEventListener("mousedown", startResizing);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
  document
    .querySelector("#myTab .resizer")
    .removeEventListener("mousedown", startResizing);
});
</script>

<style scoped>
.tab {
  transition: width 0.3s ease-out;
  width: 350px; /* Chiều rộng tối đa của tab */
}

.tab.collapsed {
  width: 3px !important; /* Chiều rộng khi tab bị ẩn */
  overflow: hidden;
}

.content {
  width: 350px; /* Chiều rộng của nội dung */
  overflow: hidden;
  transition: opacity 0.3s ease-out;
}

.content.show {
  opacity: 1;
  width: 100%;
}

.content:not(.show) {
  opacity: 0;
}

.toggle-button {
  cursor: pointer;
  position: absolute;
  left: 0;
  z-index: 1;
  top: 50%;
  transform: translate(-100%, -50%);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.resizer {
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  cursor: ew-resize;
  background: rgba(0, 0, 0, 0.1);
  z-index: 2;
}
</style>
