<template>
  <div class="card">
    <div class="month__picker--container">
      <flat-pickr class="form-control" v-model="picked" :config="config" />
    </div>
    <div class="card-body pt-0">
      <h6 class="text-uppercase fw-semibold mt-4 mb-3 text-muted">
        Danh sách KPI {{ isManager ? "nhân viên" : "phòng ban" }} theo tháng:
      </h6>
      <div v-if="isLoading" class="d-flex justify-content-center my-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <template v-else>
        <template v-if="isManager">
          <DepartmentPieChart :departmentData="kpiData"></DepartmentPieChart>
          <UserKpiTable
            :departmentData="kpiData"
            @deleteUserKpi="deleteKpiDepartment"
          ></UserKpiTable>
        </template>
        <template v-else>
          <CampaignPieChart :campaignData="kpiData"></CampaignPieChart>
          <TableKpi
            :campaignData="kpiData"
            @deleteKpi="deleteKpiDepartment"
          ></TableKpi>
        </template>
      </template>
    </div>
  </div>

  <Modal
    id="modal-add-kpi-month-for-department"
    v-model="showModal"
    title="Chia số liệu KPI tháng"
    hideFooter
  >
    <form @submit.prevent="submitForm">
      <!-- Chiến dịch -->
      <div class="mb-3">
        <label for="campaign" class="form-label">Chiến dịch</label>
        <div class="form-control">{{ kpiData?.campaign_name }}</div>
      </div>
      <!-- Tháng -->
      <div class="mb-3">
        <label for="campaign" class="form-label">Tháng</label>
        <div class="form-control">
          {{ picked }}
        </div>
      </div>
      <template v-if="isManager">
        <!-- Phòng ban -->
        <div class="mb-3">
          <label for="campaign" class="form-label">Phòng ban</label>
          <div class="form-control">{{ kpiData?.department_name }}</div>
        </div>

        <div class="mb-3">
          <label for="department" class="form-label">Nhân viên</label>
          <Select
            defaultValueLabel="Chọn nhân viên"
            isCloseOnSelect="true"
            :api="`${SERVER_URL}/api/user/get-list-users-department-kpi/`"
            searchField="str"
            labelField="str"
            style="min-width: 300px"
            @change-data="(data) => (form.user_id = data?.id)"
          ></Select>
        </div>
      </template>
      <!-- Phòng ban -->
      <div v-else class="mb-3">
        <label for="department" class="form-label">Phòng ban</label>
        <TreeSelect
          class="position-relative"
          :api="`${SERVER_URL}/api/organization/${ID_ORGANIZATION}/department/?all`"
          :placeholder="'Chọn phòng ban...'"
          :convert="true"
          require
          @on-selected="(data) => (form.department_id = data?.id)"
        >
        </TreeSelect>
      </div>
      <!-- Mục tiêu KPI -->
      <div class="mb-3">
        <label for="kpi" class="form-label">Mục tiêu (KPI)</label>
        <input
          type="number"
          min="0"
          class="form-control"
          v-model="form.kpi"
          required
          placeholder="Nhập giá trị KPI"
        />
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-light" type="button" @click="showModal = false">
          Huỷ
        </button>

        <!-- Nút submit -->
        <button type="submit" class="btn btn-primary">
          <!-- <span class="spinner-border spinner-border-sm me-2"></span> -->
          Lưu
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import Swal from "sweetalert2";
import { ID_ORGANIZATION, SERVER_URL } from "@/helpers/utils/config_system";
import Modal from "@/base/components/dtwinUI/Modal.vue";
import FlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/plugins/monthSelect/style.css";
import Select from "@/base/components/select/Select.vue";
import TreeSelect from "@/base/components/tree-select/TreeSelect.vue";
import TableKpi from "./TableKpi.vue";
import UserKpiTable from "./UserKpiTable.vue";
import CampaignPieChart from "./CampaignPieChart.vue";
import DepartmentPieChart from "./DepartmentPieChart.vue";
import {
  isLoading,
  showModal,
  picked,
  kpiData,
  form,
  config,
  removeKPI,
  postKPI,
  isManager,
} from "../state/month_kpi";

const deleteKpiDepartment = async (department_id) => {
  const result = await Swal.fire({
    title: "Bạn có muốn xoá không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Không",
  });
  if (!result.isConfirmed) {
    return;
  }
  removeKPI(department_id);
};
const submitForm = async () => {
  postKPI();
};
</script>

<style>
.month__picker--container {
  text-align: center;
}
.month__picker--container input {
  display: none;
}
.month__picker--container .flatpickr-months {
  padding: 0.5rem;
}
.flatpickr-calendar.inline {
  box-shadow: none;
  border: 1px solid #ccc;
  background: #2b2b2b;
}
</style>
