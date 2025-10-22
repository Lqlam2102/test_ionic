<script setup>
import {
  isContentVisible,
  toggleContent,
  NavItems,
  selectItem,
} from "../state/tab_left";

const handleClickToggle = () => {
  toggleContent();
};
</script>

<template>
  <div class="card mt-2 position-relative">
    <div class="tab" :class="{ collapsed: !isContentVisible }">
      <div class="content" :class="{ show: isContentVisible }">
        <div class="live-preview p-3">
          <div class="list-group">
            <button
              v-for="item in NavItems"
              :key="item.key"
              class="list-group-item list-group-item-action border-0 mb-2"
              :class="{ active: item.active }"
              :disabled="item.disabled"
              @click="selectItem(item)"
            >
              <i :class="`${item.icon} align-middle me-2`"></i>
              {{ item.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="toggle-button p-0 bg-white shadow border"
      @click="handleClickToggle"
    >
      <i
        :class="
          isContentVisible ? 'ri-arrow-left-s-fill' : 'ri-arrow-right-s-fill'
        "
        class="fs-16"
      ></i>
    </div>
  </div>
</template>

<style scoped>
.tab {
  transition: width 0.3s ease-out;
  width: 260px; /* Chiều rộng tối đa của tab */
}

.tab.collapsed {
  width: 3px; /* Chiều rộng khi tab bị ẩn */
  overflow: hidden;
}

.content {
  width: 260px; /* Chiều rộng của nội dung */
  overflow: hidden;
  transition: opacity 0.3s ease-out;
}

.content.show {
  opacity: 1;
}

.content:not(.show) {
  opacity: 0;
}

.toggle-button {
  cursor: pointer;
  position: absolute;
  right: 0;
  z-index: 1;
  top: 50%;
  transform: translate(100%, -50%);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
