<template>
  <div class="mt-2 card flex-grow-1 bg-dots rounded">
    <div class="verti-sitemap p-3">
      <ul class="list-unstyled mb-0">
        <!-- Tiêu đề chính của workflow -->
        <li class="parent-title p-0">
          <a href="javascript:void(0)" class="fw-medium fs-14 mb-4">
            {{ props.name }}
          </a>
        </li>

        <!-- Các nhóm bước cấp 1 -->
        <li>
          <ul class="second-list list-unstyled mb-0">
            <li
              v-for="group in workflow.groups"
              :key="group.title"
              class="mb-3"
            >
              <WorkflowNode :node="group" />

              <button
                type="button"
                class="btn btn-sm m-3 ms-0 btn-outline-primary d-inline-flex align-items-center rounded-pill px-3 shadow-sm"
                @click="setShowModalAddStep(true, group.order + 1)"
              >
                <i class="ri-add-circle-line fs-18 me-2"></i>
                Thêm ứng dụng/Thêm điều kiện
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import WorkflowNode from "./WorkflowNode.vue";
import { setShowModalAddStep } from "../../state/modal_step";

const props = defineProps({
  steps: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    default: "Quy trình",
  },
});
const workflow = computed(() => buildView(props.steps));

function buildView(steps) {
  if (!steps || steps.length === 0) {
    return { groups: [] }; // Trả về mặc định nếu không có dữ liệu
  }

  const byNextStep = new Map();
  steps.forEach((step) => {
    const key = step.next_step || null; // Sử dụng `next_step` để xác định bước tiếp theo
    if (!byNextStep.has(key)) byNextStep.set(key, []);
    byNextStep.get(key).push(step);
  });

  const roots = byNextStep.get(null) || []; // Các bước không có `next_step` là gốc
  const groups = roots.map((root) => {
    const level2 = byNextStep.get(root.id) || [];
    const children = level2.map((l2) => {
      const level3 = byNextStep.get(l2.id) || [];
      return {
        ...l2, // Giữ lại toàn bộ thuộc tính của `l2`
        children: level3.length
          ? level3.map((l3) => ({
              ...l3, // Giữ lại toàn bộ thuộc tính của `l3`
            }))
          : undefined,
      };
    });

    return {
      ...root, // Giữ lại toàn bộ thuộc tính của `root`
      children,
    };
  });

  return { groups };
}
</script>

<style scoped>
.bg-dots {
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='5' cy='5' r='1' fill='%23ccc' /%3E%3C/svg%3E");
  background-repeat: repeat;
  z-index: 0;
}
</style>
