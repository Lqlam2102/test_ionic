<template>
  <b-modal
    size="lg"
    v-model="showModalAddStep"
    title="Thêm bước mới"
    hide-footer
  >
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">Workflow ID</label>
        <input
          type="text"
          class="form-control"
          v-model="form.workflow"
          readonly
          :disabled="isLoading"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Thứ tự bước</label>
        <input
          type="number"
          class="form-control"
          v-model="form.order"
          :disabled="isLoading"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Tên bước</label>
        <input
          type="text"
          class="form-control"
          v-model="form.name"
          :disabled="isLoading"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Mô tả</label>
        <textarea
          class="form-control"
          v-model="form.description"
          :disabled="isLoading"
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Loại phê duyệt</label>
        <select
          class="form-select"
          v-model="form.approve_type"
          :disabled="isLoading"
          required
        >
          <option value="user">User</option>
          <option value="group">Group</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Assignee ID</label>
        <Select
          :api="`${BASE_URL}/api/user`"
          :isCloseOnSelect="true"
          defaultValueLabel="Chưa chọn tài khoản duyệt"
          labelField="username"
          searchField="username"
          @change-data="(data) => (form.assignee_id = data.id)"
          :disabled="isLoading"
        ></Select>
      </div>

      <div class="mb-3">
        <label class="form-label">Thêm hành động</label>
        <input
          type="text"
          class="form-control"
          v-model="form.added_actions"
          :disabled="isLoading"
        />
      </div>

      <div class="form-check mb-3">
        <input
          class="form-check-input"
          type="checkbox"
          v-model="form.is_disabled"
          :disabled="isLoading"
        />
        <label class="form-check-label">Vô hiệu hóa bước này</label>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm me-2"
        ></span>
        Lưu
      </button>
    </form>
  </b-modal>
</template>

<script setup>
import {
  showModalAddStep,
  setShowModalAddStep,
  formAddStep as form,
  addStepWorkflow,
} from "../../state/modal_step";
import { BASE_URL } from "@/helpers/api/axiosHttp";
import Select from "@/base/components/select/Select.vue";
import { inject, ref } from "vue";

const reloadWorkflow = inject("reload-workflow");
const isLoading = ref(false); // Trạng thái loading

async function handleSubmit() {
  try {
    isLoading.value = true; // Bắt đầu trạng thái loading
    addStepWorkflow(
      form,
      () => {
        setShowModalAddStep(false);
        reloadWorkflow();
      },
      () => {
      },
      () => {
        isLoading.value = false;
      }
    );
  } catch (error) {
    console.error("Lỗi khi gửi dữ liệu:", error);
  }
}
</script>
