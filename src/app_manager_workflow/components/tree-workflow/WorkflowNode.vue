<template>
  <div class="workflow-item-container">
    <div class="workflow-item position-relative">
      <div :class="{ 'list-wrap': !isLastNode }">
        <!-- Block chính -->
        <div
          class="d-flex align-items-center bg-white rounded-3 shadow-sm"
          style="width: 372px; height: 75px; cursor: pointer"
          @click="handleClickNode(node)"
        >
          <div
            class="position-relative d-flex align-items-center justify-content-center"
            style="width: 85px; height: 100%"
          >
            <span
              class="badge bg-warning text-white position-absolute"
              style="top: -14px; left: 12px; font-size: 0.75rem"
            >
              Khi
            </span>
            <i class="bi bi-plus-lg fs-4 text-success"></i>
          </div>

          <div class="d-flex flex-column bg-white rounded-3 flex-grow-1 p-3">
            <div class="d-flex align-items-center w-100">
              <div class="flex-grow-1">
                <h6 class="fw-bold text-truncate mb-1" style="max-width: 212px">
                  {{ node.name || "Không tên" }}
                </h6>
                <small
                  v-if="node.description"
                  class="text-secondary text-truncate"
                >
                  {{ node.description }}
                </small>
              </div>
              <div class="position-absolute" style="top: 14px; right: 36px">
                <!-- Icon trạng thái nếu có -->
              </div>
            </div>
          </div>
        </div>
        <button
          v-if="!isLastNode"
          type="button"
          class="btn btn-sm m-3 btn-outline-success d-inline-flex align-items-center rounded-pill px-3 shadow-sm"
          @click="setShowModalAddStep(true)"
        >
          <i class="ri-add-circle-line fs-18 me-2"></i>
          Thêm ứng dụng/Thêm điều kiện
        </button>
        <ul v-else class="list-unstyled ms-5">
          <li>
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-shrink-0 me-2">
                  <i
                    class="ri-checkbox-circle-fill fs-20 align-middle text-success"
                  ></i>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mb-0">Yey! Được đến bước bao nhiêu!</h6>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Đệ quy cho children -->
      <ul
        v-if="!isLastNode"
        class="list-unstyled ms-5"
        :style="{ 'margin-left': `${42 * (node.level || 1)}px` }"
      >
        <li v-for="child in node.children" :key="child.id">
          <!-- Tái sử dụng chính component này để render layer tiếp theo -->
          <WorkflowNode :node="child" />
          <button
            type="button"
            class="btn btn-sm mt-3 btn-outline-success d-inline-flex align-items-center rounded-pill px-3 shadow-sm"
            @click="setShowModalAddStep(true)"
          >
            <i class="ri-add-circle-line fs-18 me-2"></i>
            Thêm ứng dụng/Thêm điều kiện
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from "vue";
import WorkflowNode from "./WorkflowNode.vue";
import { setShowModalAddStep } from "../../state/modal_step";
import {
  isContentVisible as isShowTabRight,
  setCurrentNode,
} from "../../state/tab_right";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});

const node = computed(() => props.node);

const isLastNode = computed(() => {
  return !node.value.children?.length;
});

const handleClickNode = (node) => {
  // Handle click event for the node
  console.log("Node clicked:", node);

  isShowTabRight.value = true;
  setCurrentNode(node);
};
</script>

<style scoped>
ul::before {
  content: "";
  position: absolute;
  left: -25px;
  width: 25px;
  border: 1px dashed #918e9f;
  top: 35px;
  bottom: -35px;
  border-right: 0;
  border-radius: 15px 0 0 15px;
}

.list-wrap {
  position: relative;
}

.list-wrap::before {
  border-style: dashed;
  border-left-width: 1px;
  border-color: #0ab39c;
  content: "";
  height: calc(100% - 65px);
  position: absolute;
  top: calc(100% - 65px);
  left: 360px;
  z-index: -1;
}
</style>
