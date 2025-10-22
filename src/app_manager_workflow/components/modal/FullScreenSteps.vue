<template>
  <Teleport to="body">
    <b-modal
      v-model="showModalFullScreenSteps"
      fullscreen
      title="Quản lý quy trình"
      hide-footer
    >
      <div>
        <h5 class="mb-3">Danh sách các bước quy trình</h5>
        <ul class="list-group mb-4">
          <li
            v-for="step in steps"
            :key="step.StepID"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>
              <strong>{{ step.StepName }}</strong> – {{ step.ActionName }}
              <span v-if="step.PreStepID" class="text-muted ms-2">
                (Cha: {{ getStepName(step.PreStepID) }})
              </span>
            </span>
            <span class="badge bg-primary">{{ step.AppCode }}</span>
          </li>
        </ul>
        <div class="text-end">
          <button class="btn btn-outline-secondary" @click="closeModal">
            Đóng
          </button>
        </div>
      </div>
    </b-modal>
  </Teleport>
</template>

<script setup>
import { computed, defineProps } from "vue";
import {
  showModalFullScreenSteps,
  setShowModalFullScreenSteps,
} from "../../state/modal_step";
const props = defineProps({
  steps: {
    type: Array,
    default: () => [],
  },
});

function closeModal() {
  setShowModalFullScreenSteps(false);
}

const steps = computed(() => props.steps);

function getStepName(id) {
  const step = steps.value.find((s) => s.StepID === id);
  return step ? step.StepName : "Không rõ";
}
</script>
