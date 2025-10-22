<script setup>
import { ref, computed, onMounted } from "vue";
import API from "@/helpers/api/useAxios.js";
import TreeSelect from "@/base/components/tree-select/TreeSelect.vue";
import Select from "@/base/components/select/Select.vue";
// import Layout from "@/app_manage_dynamic_api/layout/main.vue";
import revenue from "../components/chartTeleSale.vue";
import FormDateTeleSale from "../components/FormDateTeleSale.vue";
import Modal from "@/base/components/dtwinUI/Modal.vue";
import PieChart from "../components/PieChart.vue";
import CallReport from "../components/ReportCandidateHelp.vue";
import RankingReport from "../components/RankingReport.vue";
import KPICampaign from "../components/KPICampaign.vue";
import { SERVER_URL } from "@/helpers/utils/config_system.js";
import { errorToast } from "@/helpers/api/toastStyle";
import ChartOverview from "../components/ChartOverview.vue";

const defaultReportData = {
  stats: {},
  charts: {
    current: {},
    compare: {},
  },
  candidates_status: [],
  candidate_helped: {
    total_candidate_helped: {
      current: 0,
      compare: 0,
      percent_change: 0,
    },
    top_users: [],
  },
  recruitment_rank: [],
  kpi_report: {
    data: {
      campaigns: [],
      completed: 0,
      completion_rate: 0.0,
      timestamp: "",
      total_kpi: 0,
    },
  },
};

const reportData = ref({ ...defaultReportData });

function resetReportData() {
  reportData.value = { ...defaultReportData };
}

const isShowModal = ref(false);
const isLoading = ref(true);
const isReseting = ref(false);

const defaultFilterInfo = {
  type: "",
  current: "",
  compare: "",
  department_id: "",
  user_id: "",
};

const filterInfo = ref({ ...defaultFilterInfo });

function resetFilterInfo() {
  filterInfo.value = { ...defaultFilterInfo };
}

const REPORTCARDS = [
  { title: "Tổng lao động đang quản lý", statKey: "total_quanly_workers" },
  { title: "Tổng lao động đã tuyển được", statKey: "total_workers" },
  { title: "Tình trạng phỏng vấn", statKey: "total_interview_candidates" },
];

const chartRevenueType = ref("total_quanly_workers");

const chartRevenueData = computed(() => {
  return (
    reportData.value.charts?.current?.[
      chartRevenueType.value.split("total_").pop()
    ] ?? []
  );
});
const chartRevenueDataCompare = computed(() => {
  return (
    reportData.value.charts?.compare?.[
      chartRevenueType.value.split("total_").pop()
    ] ?? []
  );
});
const reportValues = computed(() => {
  return REPORTCARDS.map((card) => {
    const stat = reportData.value?.stats?.[card.statKey] || {};
    return {
      title: card.title,
      current: stat.current || 0,
      change: stat.change || 0,
      compare: stat.compare || 0,
      key: card.statKey,
      active: card.statKey == chartRevenueType.value,
    };
  });
});
const checkInnit = ref({
  disabled_department: false,
  default_department: {
    id: "",
    name: "",
  },
  can_access: true,
  departments: [],
});
API()
  .get("quan-ly/overview")
  .then((res) => {
    checkInnit.value = {
      ...checkInnit.value,
      ...res,
    };
    if (res?.default_department?.id) {
      filterInfo.value.department_id = res.default_department?.id;
    }
  })
  .finally(() => {
    // isLoading.value = false;
  });

const fcSubmitFilters = ({ type, period1, period2 }) => {
  filterInfo.value = {
    ...filterInfo.value,
    type,
    current: periodToString(period1, type),
    compare: periodToString(period2, type),
  };
  handleCallAPIReportTelesale();
};

const handleCallAPIReportTelesale = (
  type = filterInfo.value.type,
  period1 = filterInfo.value.current,
  period2 = filterInfo.value.compare
) => {
  if (!type) {
    errorToast("Vui lòng chọn loại báo cáo");
    return;
  }
  isLoading.value = true;
  // 1. Tạo URLSearchParams
  const params = new URLSearchParams();
  params.append("current_period", period1); // Không xử lý lại nữa!
  params.append("compare_period", period2);
  params.append("compare_type", type);
  if (filterInfo.value.department_id) {
    params.append("department_id", filterInfo.value.department_id);
  }
  if (filterInfo.value.user_id) {
    params.append("user_id", filterInfo.value.user_id);
  }
  isShowModal.value = false;
  // 2. Call API
  API()
    .get(`/quan-ly/?${params.toString()}`)
    .then((response) => {
      if (!response || response.error) {
        throw new Error("No data received from API");
      }
      reportData.value = response;
    })
    .catch((error) => {
      console.error("Error fetching report data:", error);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

function periodToString(period, type) {
  // 1. Nếu là week và period là string (kiểu "YYYY-W##") → bỏ "W"
  if (type === "week" && typeof period === "string") {
    // ví dụ "2025-W32" → ["2025", "32"]
    const [year, week] = period.split("-W");
    return `${year}-${week}`;
  }

  // 2. Nếu period là string hoặc number (day, year, hoặc bạn dùng input type="month" thì cũng về string "YYYY-MM")
  if (typeof period === "string" || typeof period === "number") {
    return period;
  }

  // 3. Nếu là month (lấy object {year, month})
  if (type === "month") {
    // đảm bảo tháng luôn 2 chữ số
    const m = String(period.month).padStart(2, "0");
    return `${period.year}-${m}`;
  }

  // 4. Nếu là quarter
  if (type === "quarter") {
    return `${period.year}-${period.quarter}`;
  }

  // 5. Mặc định
  return "";
}

const handleClickTypeFilter = ($e) => {
  if (!filterInfo.value.type) return;
  $e.preventDefault();
  isShowModal.value = true;
};

function convertTypeToNameVi(type) {
  const mapping = {
    day: "Ngày",
    week: "Tuần",
    month: "Tháng",
    quarter: "Quý",
    year: "Năm",
    "": "Không so sánh",
  };
  return mapping[type] || "Không xác định";
}

function formatPeriod(period) {
  if (typeof period !== "string") return "";

  const parts = period.split("-");
  // Nếu có đúng 2 phần (Năm-Tháng), đảo ngược
  if (parts.length === 2 && parts[0].length === 4) {
    const [year, month] = parts;
    return `${month}-${year}`;
  }
  // Trường hợp chỉ có "YYYY"
  return period;
}
const handleClickResetReport = () => {
  isReseting.value = true;
  resetFilterInfo();
  resetReportData();
  setTimeout(() => {
    isReseting.value = false;
  }, 300);
};

onMounted(() => {
  function getCurrentAndPreviousMonth() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, "0"); // +1 vì 0-based
    const current = `${currentYear}-${currentMonth}`;

    // Tính tháng trước
    const previousDate = new Date(currentYear, today.getMonth() - 1);
    const prevYear = previousDate.getFullYear();
    const prevMonth = String(previousDate.getMonth() + 1).padStart(2, "0");
    const compare = `${prevYear}-${prevMonth}`;

    return {
      type: "month",
      current,
      compare,
    };
  }

  // Dùng:
  const filterInput = getCurrentAndPreviousMonth();
  filterInfo.value = { ...filterInfo.value, ...filterInput };
  handleCallAPIReportTelesale();
});
</script>

<template>
  <!-- <Layout
    :address="{
      title: 'Báo cáo thời gian thực',
    }"
    chooseMenu="ban-do"
  >
    <div class=""> -->
  <div
    class="position-fixed"
    style="inset: 0; z-index: -1; overflow-y: auto; overflow-x: hidden"
  >
    <div class="d-flex justify-content-center flex-column">
      <!-- filter -->
      <div class="row w-100 pb-1">
        <div class="col-12">
          <div class="d-flex align-items-lg-center flex-lg-row flex-column">
            <div class="flex-grow-1 ps-2 pt-1">
              <div class="d-flex">
                <router-link :to="{ name: 'ManageReport' }">
                  <button class="btn btn-icon btn-ghost-primary me-2">
                    <i class="ri-arrow-left-line fs-20 fw-bold"></i>
                  </button>
                </router-link>
                <div class="flex-grow-1">
                  <h4 class="fs-16 mb-1">BÁO CÁO QUẢN LÝ!</h4>
                  <p class="text-muted mb-0">
                    <span>
                      {{
                        `${convertTypeToNameVi(filterInfo.type)} ${formatPeriod(
                          filterInfo.current
                        )}`
                      }}
                    </span>
                    <template v-if="filterInfo.type">
                      <span>
                        (so sánh với
                        {{
                          `${convertTypeToNameVi(
                            filterInfo.type
                          )} ${formatPeriod(filterInfo.compare)}`
                        }}
                        )
                      </span>
                    </template>
                  </p>
                </div>
              </div>
            </div>
            <div
              :style="{ pointerEvents: isLoading ? 'none' : 'auto' }"
              class="mt-3 mt-lg-0"
            >
              <form action="javascript:void(0);">
                <div class="row g-3 mb-0 align-items-center">
                  <div class="col-sm-auto">
                    <div class="col-sm-auto">
                      <div
                        class="form-select"
                        v-if="checkInnit.disabled_department"
                      >
                        {{ checkInnit.default_department.name }}
                      </div>
                      <template v-else>
                        <input
                          v-if="isReseting"
                          type="text"
                          class="form-control"
                          placeholder="Phòng ban..."
                          disabled
                        />
                        <TreeSelect
                          v-else
                          class="position-relative"
                          :treeData="checkInnit?.departments ?? []"
                          :placeholder="'Chọn phòng ban...'"
                          :convert="true"
                          @on-selected="
                            (data) => (filterInfo.department_id = data?.id)
                          "
                        >
                        </TreeSelect>
                      </template>
                    </div>
                  </div>
                  <div class="col-sm-auto">
                    <Select
                      defaultValueLabel="Chọn nhân viên"
                      isCloseOnSelect="true"
                      :api="
                        filterInfo.department_id
                          ? `${SERVER_URL}/api/department/${filterInfo.department_id}/users/`
                          : `${SERVER_URL}/api/user/get-list-users-department/`
                      "
                      searchField="str"
                      labelField="str"
                      style="min-width: 300px"
                      @change-data="(data) => (filterInfo.user_id = data?.id)"
                      :defaultValue="{ id: filterInfo.user_id }"
                    ></Select>
                  </div>
                  <div class="col-auto">
                    <select
                      v-model="filterInfo.type"
                      class="from-control form-select"
                      @change="isShowModal = true"
                      @mousedown="handleClickTypeFilter"
                    >
                      <option value="" disabled selected>Loại so sánh</option>
                      <option value="year">Theo năm</option>
                      <option value="quarter">Theo quý</option>
                      <option value="month">Theo tháng</option>
                      <!-- <option value="week">Theo tuần</option> -->
                    </select>
                  </div>
                  <!--end col-->
                  <div class="col-auto">
                    <button
                      type="button"
                      @click="() => handleCallAPIReportTelesale()"
                      class="btn btn-soft-success d-flex align-items-center justify-content-center"
                      :disabled="isLoading"
                    >
                      <span
                        v-if="isLoading"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <i
                        v-else
                        class="ri-add-circle-line align-middle me-1"
                      ></i>
                      {{ isLoading ? "Đang tải..." : "Xem báo cáo" }}
                    </button>
                  </div>
                  <div class="col-auto">
                    <button
                      @click="handleClickResetReport"
                      type="button"
                      class="btn btn-soft-danger btn-icon waves-effect waves-light layout-rightside-btn"
                    >
                      <i class="las la-undo-alt"></i>
                    </button>
                  </div>
                  <!--end col-->
                </div>
                <!--end row-->
              </form>
            </div>
          </div>
          <!-- end card header -->
        </div>
        <!--end col-->
      </div>

      <div :class="{ blur__loading: isLoading }" class="row">
        <div
          class="col-4 pe-0 ps-1"
          v-for="(card, index) in reportValues"
          :key="index"
        >
          <div
            class="card card-animate mb-1 cursor-pointer"
            @click="chartRevenueType = card.key"
            :class="{ active__widget: card.active }"
          >
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="flex-grow-1 overflow-hidden">
                  <p
                    class="text-uppercase fw-medium text-truncate mb-0"
                    :class="{ 'text-muted': !card.active }"
                  >
                    {{ card.title }}
                  </p>
                </div>
                <div class="flex-shrink-0">
                  <h5
                    :class="{
                      'text-success': card.change >= 0,
                      'text-danger': card.change < 0,
                    }"
                    class="fs-14 mb-0"
                  >
                    <i
                      class="ri-arrow-right-up-line fs-13 align-middle"
                      v-if="card.change >= 0"
                    ></i>
                    <i
                      class="ri-arrow-right-down-line fs-13 align-middle"
                      v-else
                    ></i>
                    {{ card.change.toFixed(2) }}%
                  </h5>
                </div>
              </div>

              <div class="d-flex align-items-end justify-content-between mt-2">
                <h4 class="ff-secondary fs-22 fw-semibold">
                  <span class="counter-value">{{ card.current }}</span>
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="{ blur__loading: isLoading }">
      <template v-if="!isLoading">
        <ChartOverview
          v-if="chartRevenueType == 'total_interview_candidates'"
          :charts="reportData.charts"
          chartType="interview_candidates"
          :report-name="`${filterInfo.current}`"
          :compare-name="`${filterInfo.compare}`"
        />
        <ChartOverview
          v-else-if="chartRevenueType == 'total_quanly_workers'"
          :charts="reportData.charts"
          chartType="quanly_workers"
          :report-name="`${filterInfo.current}`"
          :compare-name="`${filterInfo.compare}`"
        />
        <revenue
          v-else
          class="mb-1"
          :compare-data="chartRevenueDataCompare"
          :compare-name="`${convertTypeToNameVi(filterInfo.type)}: ${
            filterInfo.compare
          }`"
          compare-type="area"
          :report-data="chartRevenueData"
          :report-name="`${convertTypeToNameVi(filterInfo.type)}: ${
            filterInfo.current
          }`"
          report-type="bar"
          :threshold-value="100"
          threshold-name="Ngưỡng mục tiêu"
          threshold-type="line"
        ></revenue>
      </template>

      <div class="card mb-1" style="max-height: 550px; height: 450px">
        <div class="row h-100 d-flex flex-column">
          <div class="col-12 col-md-4 h-100">
            <KPICampaign :report="reportData.kpi_report.data"></KPICampaign>
          </div>
          <div class="col-12 col-md-4">
            <PieChart
              name="TỔNG LAO ĐỘNG CỦA CÁC PHÒNG BAN"
              :chart-data="reportData.department_worker"
              valueField="total_workers"
              labelField="department_name"
            ></PieChart>
          </div>
          <div class="col-12 col-md-4 h-100">
            <CallReport
              :candidate_helped="reportData?.candidate_helped"
            ></CallReport>
          </div>
        </div>
      </div>
      <div class="card mb-1">
        <RankingReport
          :data="reportData.recruitment_rank"
          :visibleFields="[
            'Tên nhân viên',
            'Tổng lao động',
            'Tổng tuyển mới',
            'Tổng ứng viên',
            'Phỏng vấn đạt',
            'Tổng lao động hỗ trợ',
            'Xếp hạng',
          ]"
        ></RankingReport>
      </div>
    </div>
  </div>
  <!-- </div>
  </Layout> -->

  <Modal
    v-model="isShowModal"
    id="modal__filter--dashboard-tele-sale"
    title="So sánh theo"
    hideFooter
  >
    <FormDateTeleSale
      v-model="filterInfo.type"
      :filterInfo="filterInfo"
      @submitFilters="fcSubmitFilters"
      @cancel="isShowModal = false"
    ></FormDateTeleSale>
  </Modal>
</template>
<style scoped>
.active__widget {
  color: #0ab39c;
  border: 1px solid rgba(10, 179, 156, 0.6);
}
</style>
