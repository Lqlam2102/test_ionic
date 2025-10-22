<script setup>
import { ref, defineProps, watch, reactive, onMounted, onUnmounted } from "vue";
import { CountTo } from "vue3-count-to";
import API from "@/helpers/api/useAxios.js";
import PieChart from "./PieChart.vue";
import Modal from "@/base/components/dtwinUI/Modal.vue";
import TotalWidget from "./form_modal/TotalWidget.vue";

const props = defineProps({
  reportData: {
    type: Object,
    default: () => ({}),
  },
});

const crmWidgets = ref([
  buildWidgetItem({
    key: "total_workers",
    label: "Tổng số lao động",
    counter: 0,
    icon: "ri-group-line",
    chart: true,
  }),
  buildWidgetItem({
    key: "active_workers",
    label: "Tổng lao động đang làm",
    counter: 0,
    icon: "ri-user-follow-line text-success",
  }),
  buildWidgetItem({
    key: "inactive_workers",
    label: "Tổng lao động đã nghỉ",
    counter: 0,
    icon: "ri-user-unfollow-line text-danger",
  }),
  buildWidgetItem({
    key: "interviews_today",
    label: "Ứng viên phỏng vấn hôm nay",
    counter: 0,
    icon: "mdi mdi-video-marker text-primary",
  }),
  buildWidgetItem({
    key: "appointments_today",
    label: "Ứng viên có lịch hẹn hôm nay",
    counter: 0,
    icon: "ri-calendar-check-line text-info",
  }),
]);

const isLoading = ref(true);
const dataGrowthPercentage = reactive({
  isShowModal: false,
  title: "",
  type: "",
});
const loadCrmWidgets = async () => {
  const data = await API().get("v1/recruitment-stats/");
  crmWidgets.value.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(data, item.key)) {
      item.counter = data?.[item.key] ?? 0;
    }

    // Nếu có paramsCompare thì tính growth
    if (item.paramsCompare) {
      calculateGrowthForKey(item.key);
    }
  });
  isLoading.value = false;
};
loadCrmWidgets();

const handleClickGrowthPercentage = (growthPercentage) => {
  dataGrowthPercentage.title = growthPercentage.label;
  dataGrowthPercentage.type = growthPercentage.key;
};

function buildQueryFromFilter(filter, key) {
  const params = new URLSearchParams();

  const isLaborGroup = [
    "total_workers",
    "active_workers",
    "inactive_workers",
  ].includes(key);

  const isCandidateGroup = ["interviews_today", "appointments_today"].includes(
    key
  );

  // Chỉ xử lý nếu nhóm hợp lệ
  if (isLaborGroup) {
    const { filter_type, selected_year, selected_month } = filter;

    if (filter_type === "year" || filter_type === "month") {
      params.append("filter_type", filter_type);
      if (selected_year) params.append("selected_year", selected_year);
      if (filter_type === "month" && selected_month) {
        params.append("selected_month", selected_month);
      }
    } else {
      params.append("filter_type", "year"); // mặc định nếu là "all"
      if (selected_year) params.append("selected_year", selected_year);
    }
  }

  if (isCandidateGroup) {
    // Truyền compare_with và selected_date
    if (filter.compare_with) {
      params.append("filter_type", filter.compare_with);
    }
    if (filter.selected_date) {
      // Đảm bảo định dạng yyyy-mm-dd
      const dateStr =
        typeof filter.selected_date === "string"
          ? filter.selected_date
          : filter.selected_date.toISOString().slice(0, 10);
      params.append("selected_date", dateStr);
    }
  }

  return "?" + params.toString();
}
function buildCompareParam(type) {
  const params = new URLSearchParams();
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JavaScript months: 0-11
  const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

  switch (type) {
    case "year":
      params.append("filter_type", "year");
      params.append("selected_year", year);
      break;

    case "month":
      params.append("filter_type", "month");
      params.append("selected_year", year);
      params.append("selected_month", month);
      break;

    case "date":
    case "exact-date":
      params.append("filter_type", "exact-date");
      params.append("selected_date", dateStr);
      break;

    default:
      // Nếu không hợp lệ, có thể dùng filter_type mặc định
      break;
  }
  return "?" + params.toString();
}

const fcEmitTotalWork = async (data) => {
  const item = crmWidgets.value.find(
    (i) => i.key === dataGrowthPercentage.type
  );
  if (!item) {
    dataGrowthPercentage.isShowModal = false;
    return;
  }
  item.paramsCompare = { ...data };
  calculateGrowthForKey();
  dataGrowthPercentage.isShowModal = false;
};

async function calculateGrowthForKey(key = dataGrowthPercentage.type) {
  const item = crmWidgets.value.find((i) => i.key === key);
  if (!item || !item.paramsCompare) return;

  const prevParams = buildQueryFromFilter(item.paramsCompare, key);
  const currParams = buildCompareParam(
    item.paramsCompare?.filter_type ?? item.paramsCompare?.compare_with
  );

  const [prevRes, currRes] = await Promise.all([
    API().get("v1/recruitment-stats/" + prevParams),
    API().get("v1/recruitment-stats/" + currParams),
  ]);

  const prevValue = prevRes[key];
  const currValue = currRes[key];

  if (prevValue === null || prevValue === undefined) {
    item.growthPercentage = null;
  } else if (prevValue === 0) {
    item.growthPercentage = currValue > 0 ? "100%" : "0%";
  } else {
    const growth = ((currValue - prevValue) / prevValue) * 100;
    item.growthPercentage = growth.toFixed(2) + "%";
  }
}

watch(
  () => props.reportData,
  () => {
    if (props.reportData["recruitment-stats"]) {
      loadCrmWidgets();
    }
  },
  { deep: true, immediate: true }
);

function buildWidgetItem({ key, label, counter, icon, chart = false }) {
  const isCandidateGroup = ["interviews_today", "appointments_today"].includes(
    key
  );

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const formattedDate = yesterdayDate.toISOString().slice(0, 10);

  const paramsCompare = isCandidateGroup
    ? {
        compare_with: "exact-date",
        selected_date: formattedDate,
      }
    : null;

  return {
    key,
    label,
    counter,
    icon,
    chart,
    growthPercentage: "0.00%",
    paramsCompare,
  };
}

const COMPARE_LABELS = {
  yesterday: "vs. hôm qua",
  "day-of-last-week": "vs. cùng ngày tuần trước",
  "day-of-last-month": "vs. cùng ngày tháng trước",
  // những giá trị 'year', 'month', 'exact-date' ta sẽ tự build
};

function getCompareLabel(item) {
  const p = item.paramsCompare;
  if (!p) return "vs. no";

  // Ưu tiên filter_type (dành cho lao động), nếu không thì dùng compare_with (ứng viên)
  const type = p.filter_type || p.compare_with;

  switch (type) {
    case "exact-date":
      // p.selected_date đã là "YYYY-MM-DD"
      return `vs. ngày ${p.selected_date}`;

    case "month":
      // p.selected_month = 1-12, p.selected_year = Năm
      return `vs. tháng ${p.selected_month} năm ${p.selected_year}`;

    case "year":
      return `vs. năm ${p.selected_year}`;
    default:
      // những trường hợp: yesterday, day-of-last-week, day-of-last-month
      return COMPARE_LABELS[type] || "vs. no";
  }
}
function useDailyTrigger(callback = () => {}, intervalMs = 60000) {
  let lastDate = new Date().toDateString();
  let timer;
  onMounted(() => {
    timer = setInterval(() => {
      const currentDate = new Date().toDateString();
      if (currentDate !== lastDate) {
        lastDate = currentDate;
        callback();
      }
    }, intervalMs);
  });

  onUnmounted(() => {
    clearInterval(timer);
  });
}
useDailyTrigger(loadCrmWidgets);
</script>

<template>
  <BRow class="m-0 p-0">
    <template v-if="isLoading">
      <BCol v-for="n in 5" :key="'skeleton-' + n">
        <div class="py-2 px-2">
          <h5 class="text-uppercase fs-13 fw-normal placeholder-glow">
            <span class="placeholder col-6"></span>
          </h5>
          <div class="d-flex align-items-center">
            <div class="flex-shrink-0">
              <div
                class="placeholder rounded-circle"
                style="width: 48px; height: 48px"
              ></div>
            </div>
            <div class="flex-grow-1 ms-3">
              <h2 class="mb-0 fw-semibold placeholder-glow">
                <span class="placeholder col-7"></span>
              </h2>
            </div>
          </div>
        </div>
      </BCol>
    </template>
    <template v-else>
      <template v-for="(item, index) of crmWidgets" :key="index">
        <div class="col-1-5 px-1">
          <div class="card card-animate position-relative mb-2">
            <div class="card-body">
              <!-- Tiêu đề & phần trăm tăng -->
              <div class="d-flex align-items-center">
                <div class="flex-grow-1 overflow-hidden">
                  <p
                    class="text-uppercase fw-medium text-primary text-truncate mb-0"
                  >
                    {{ item.label }}
                  </p>
                </div>
                <div
                  v-b-modal.modal__filter--dashboard-form
                  class="flex-shrink-0 cursor-pointer hover-bg-light"
                  @click="handleClickGrowthPercentage(item)"
                >
                  <h5
                    :class="[
                      'fs-14 mb-0',
                      parseFloat(item.growthPercentage) < 0
                        ? 'text-danger'
                        : 'text-success',
                    ]"
                  >
                    <i
                      :class="[
                        parseFloat(item.growthPercentage) < 0
                          ? 'ri-arrow-right-down-line'
                          : 'ri-arrow-right-up-line',
                        'fs-13 align-middle',
                      ]"
                    ></i>
                    {{ parseFloat(item.growthPercentage) > 0 ? "+" : "" }}
                    {{ item.growthPercentage || "0.00%" }}
                  </h5>
                </div>
              </div>
              <p class="mb-0 text-muted">
                {{ getCompareLabel(item) }}
              </p>
              <!-- Giá trị chính và icon -->
              <div
                style="height: 100px"
                class="row align-items-end justify-content-between"
              >
                <div class="col-6">
                  <h4 class="d-flex gap-2 fs-22 fw-semibold ff-secondary mb-4">
                    <i :class="`${item.icon} text-success fs-1`"></i>
                    <count-to
                      class="text-center align-content-center"
                      :startVal="0"
                      :endVal="item.counter"
                      :duration="
                        Object.keys(reportData).length === 0 ? 5000 : 1
                      "
                    />
                  </h4>
                  <!-- <a href="#" class="text-decoration-underline text-nowrap">
                    Xem chi tiết
                  </a> -->
                </div>
                <div v-if="item.chart" class="col-6">
                  <PieChart width="100" height="100" :reportData="crmWidgets" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </BRow>

  <Modal
    v-model="dataGrowthPercentage.isShowModal"
    id="modal__filter--dashboard-form"
    :title="dataGrowthPercentage.title"
    hideFooter
  >
    <TotalWidget
      @filter-json="fcEmitTotalWork"
      :type="dataGrowthPercentage.type"
    ></TotalWidget>
  </Modal>
</template>

<style scoped>
.col-1-5 {
  flex: 0 0 20%;
  max-width: 20%;
}
</style>
