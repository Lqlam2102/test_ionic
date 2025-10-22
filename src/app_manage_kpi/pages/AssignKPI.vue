<script setup>
import { provide } from "vue";
import { ID_ORGANIZATION, SERVER_URL } from "@/helpers/utils/config_system";
import Swal from "sweetalert2";
import FormManage from "@/base/components/form/builder/FormManage.vue";
import Modal from "@/base/components/dtwinUI/Modal.vue";
import FormLoading from "@/base/components/form/builder/components/FormLoading.vue";
import LayoutRecord from "@/app_manage_dynamic_api/layout/record/LayoutRecord.vue";
import CampaignPieChart from "../component/CampaignPieChart.vue";
import DepartmentPieChart from "../component/DepartmentPieChart.vue";
import TableKpi from "../component/TableKpi.vue";
import UserKpiTable from "../component/UserKpiTable.vue";
import TreeSelect from "@/base/components/tree-select/TreeSelect.vue";
import Select from "@/base/components/select/Select.vue";
import DateInput from "@/base/components/date/date.vue";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import "flatpickr/dist/plugins/monthSelect/style.css";
import { getOffcanvas } from "@/app_manage_dynamic_api/common/useBoostrap.js";
import MonthYearPicker from "../component/MonthYearPicker.vue";
import {
  showModal,
  isLoading,
  submitting,
  kpiData,
  form,
  formUser,
  loadData,
  removeKPI,
  postKPI,
  isManager,
  pickedYear,
  pickedMonth,
  typeTimeFilter,
} from "../state/campaign_kpi";
import { loadData as loadDataLIPMonth, isCanAddKpi } from "../state/month_kpi";

provide("handle-custom-event-table", [
  {
    type: "TABLEname",
    handle: (item) => {
      let offcanvas = getOffcanvas("offcanvasassign-kpi");
      offcanvas.show();
      loadData(item.id);
    },
  },
]);
// Giới hạn năm bắt đầu và kết thúc (tùy bạn điều chỉnh)
const startYear = 2024;
const endYear = new Date().getFullYear();

// Danh sách năm: [2024, 2025, …, endYear]
const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => startYear + i
).reverse();
const months = Array.from({ length: 12 }, (_, i) => i + 1);
// Hàm helper format 2 chữ số
function formatMonth(m) {
  return m < 10 ? "0" + m : String(m);
}
const tabs = [
  { label: "Tất cả", value: "all" },
  { label: "Năm", value: "year" },
  { label: "Tháng", value: "month" },
];
const handleClickKPI = ($e) => {
  const temp = $e?.target?.offsetParent?.getAttribute("item");
  if (!temp) return;
  const value = JSON.parse(temp);
  loadData(value.id);
};
const handleClickKPIMonth = ($e) => {
  const temp = $e?.target?.offsetParent?.getAttribute("item");
  if (!temp) return;
  const value = JSON.parse(temp);
  loadDataLIPMonth(value.id);
};
const handleClickTab = (tab) => {
  typeTimeFilter.value = tab;
  loadData();
};

function submitForm() {
  postKPI();
}

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

const handleClickOpenKPIMonths = () => {
  loadDataLIPMonth(kpiData.value.campaign_id);
  let offcanvas = getOffcanvas("offcanvasassign-kpi__month");
  offcanvas.show();
};
</script>

<template>
  <FormManage
    title="KPIs"
    sourceApi="campaign-kpi"
    no-delete
    no-edit
    no-add
    no-view
  >
    <li @click="handleClickKPI">
      <div
        class="dropdown-item"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasassign-kpi"
        aria-controls="offcanvasassign-kpi"
      >
        <i class="ri-eye-fill align-bottom me-2 text-muted"></i>
        Tổng quan
      </div>
    </li>
    <li @click="handleClickKPIMonth">
      <div
        class="dropdown-item"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasassign-kpi__month"
        aria-controls="offcanvasassign-kpi__month"
      >
        <i class="ri-line-chart-line align-bottom me-2 text-muted"></i>
        Phân công KPI
      </div>
    </li>
  </FormManage>

  <LayoutRecord title="Tổng quan" id="assign-kpi">
    <template #header>
      <!-- <button
        @click="showModal = true"
        type="button"
        class="btn btn-warning btn-icon waves-effect waves-light"
      >
        <i class="las la-edit"></i>
      </button> -->
      <button
        @click="handleClickOpenKPIMonths"
        type="button"
        class="btn btn-primary btn-icon waves-effect waves-light"
      >
        <i class="ri-line-chart-line"></i>
      </button>
    </template>
    <template #body>
      <ul
        class="nav nav-tabs nav-tabs-custom nav-success nav-justified mb-2"
        role="tablist"
      >
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          class="nav-item"
          role="presentation"
        >
          <a
            class="nav-link"
            data-bs-toggle="tab"
            :class="{ active: tab.value === typeTimeFilter }"
            :href="`#${tab.value}__filter`"
            role="tab"
            aria-selected="true"
            @click="handleClickTab(tab.value)"
          >
            {{ tab.label }}
          </a>
        </li>
      </ul>

      <div class="mb-3">
        <!-- Chọn năm -->
        <div class="tab-pane" v-show="typeTimeFilter == 'year'" role="tabpanel">
          <select
            v-model="pickedYear"
            class="form-select"
            @change="() => loadData()"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Chọn tháng–năm -->
        <div
          class="tab-pane"
          v-show="typeTimeFilter == 'month'"
          role="tabpanel"
        >
          <div class="row">
            <div class="col-6">
              <select
                v-model="pickedMonth"
                placeholder="Chọn tháng"
                class="form-select"
                @change="() => loadData()"
              >
                <option
                  v-for="month in months"
                  :key="month"
                  :value="formatMonth(month)"
                >
                  {{ formatMonth(month) }}
                </option>
              </select>
            </div>
            <div class="col-6">
              <select v-model="pickedYear" class="form-select">
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <FormLoading v-if="isLoading"></FormLoading>
      <template v-else>
        <template v-if="isManager">
          <DepartmentPieChart :departmentData="kpiData"></DepartmentPieChart>
          <UserKpiTable
            :departmentData="kpiData"
            @deleteUserKpi="deleteKpiDepartment"
            :noDelete="true"
          ></UserKpiTable>
        </template>
        <template v-else>
          <CampaignPieChart :campaignData="kpiData"></CampaignPieChart>
          <TableKpi
            :campaignData="kpiData"
            @deleteKpi="deleteKpiDepartment"
            :noDelete="true"
          ></TableKpi>
        </template>
      </template>
    </template>
  </LayoutRecord>
  <LayoutRecord title="Phân công KPI" id="assign-kpi__month">
    <template #header>
      <button
        type="button"
        class="btn btn-warning btn-icon waves-effect waves-light"
        v-b-modal.modal-add-kpi-month-for-department
        :disabled="!isCanAddKpi"
      >
        <i class="las la-edit"></i>
      </button>
    </template>
    <template #body>
      <FormLoading v-if="isLoading"></FormLoading>
      <template v-else>
        <MonthYearPicker></MonthYearPicker>
      </template>
    </template>
  </LayoutRecord>

  <Modal
    id="modal-add-kpi-for-department"
    v-model="showModal"
    title="Chia số liệu KPI"
    hideFooter
  >
    <form @submit.prevent="submitForm">
      <template v-if="isManager">
        <!-- Chiến dịch -->
        <div class="mb-3">
          <label for="campaign" class="form-label">Chiến dịch</label>
          <div class="form-control">{{ kpiData?.campaign_name }}</div>
        </div>

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
            @change-data="(data) => (formUser.user_id = data?.id)"
          ></Select>
        </div>
        <!-- Mục tiêu KPI -->
        <div class="mb-3">
          <label for="kpi" class="form-label">Mục tiêu (KPI)</label>
          <input
            type="number"
            min="0"
            v-model.number="formUser.kpi"
            class="form-control"
            required
            placeholder="Nhập giá trị KPI"
          />
        </div>
      </template>
      <template v-else>
        <!-- Chiến dịch -->
        <div class="mb-3">
          <label for="campaign" class="form-label">Chiến dịch</label>
          <div class="form-control">{{ kpiData?.campaign_name }}</div>
        </div>

        <div class="mb-3">
          <label for="campaign" class="form-label">Tháng</label>
          <DateInput
            :dateConfig="{
              altFormat: 'F Y',
              dateFormat: 'm.Y',
              plugins: [
                new monthSelectPlugin({
                  shorthand: true,
                  dateFormat: 'm.y',
                  altFormat: 'F Y',
                  theme: 'light',
                }),
              ],
            }"
          ></DateInput>
        </div>
        <!-- Phòng ban -->
        <div class="mb-3">
          <label for="department" class="form-label">Phòng ban</label>
          <TreeSelect
            class="position-relative"
            :api="`${SERVER_URL}/api/organization/${ID_ORGANIZATION}/department/?all`"
            :placeholder="'Chọn phòng ban...'"
            :convert="true"
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
            v-model.number="form.kpi"
            class="form-control"
            required
            placeholder="Nhập giá trị KPI"
          />
        </div>
      </template>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-light" type="button" @click="showModal = false">
          Huỷ
        </button>

        <!-- Nút submit -->
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          <span
            v-if="submitting"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Lưu
        </button>
      </div>
    </form>
  </Modal>
</template>
