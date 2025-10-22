<script setup>
import { ref, reactive, watch, onMounted, defineProps, computed } from "vue";
import getChartColorsArray from "../common/getChartColorsArray";
import { useFetch } from "@/helpers/api/api.js";
import { API_SERVER_URL } from "@/base/store/api/server_api";
import FilterDateTime from "./form_modal/FilterDateTime.vue";
import Modal from "@/base/components/dtwinUI/Modal.vue";

const props = defineProps({
  reportData: {
    type: Object,
    default: () => ({}),
  },
});

const series = ref([]);
const showFilterModal = ref(false);
const chartOptions = reactive({
  chart: {
    height: 341,
    type: "bar",
    dropShadow: { enabled: false },
    toolbar: { show: false },
  },
  legend: { show: true },
  markers: { size: 0 },
  colors: getChartColorsArray(
    '["--vz-warning", "--vz-danger", "--vz-success"]'
  ),
  xaxis: {
    categories: [
      "Chiến dịch 1",
      "Chiến dịch 2",
      "Chiến dịch 3",
      "Chiến dịch 4",
      "Chiến dịch 5",
    ],
  },
});
const filterType = ref({});
const isLoading = ref(true);
const tableData = ref([]);

async function loadCampaignStats(filter = filterType.value) {
  if (filter?.filter_type == "all") {
    filter = {};
  }
  const params = new URLSearchParams({});

  if (filter?.filter_type) {
    params.append("filter_type", filter.filter_type);
  }
  if (filter?.selected_date) {
    params.append("date", filter.selected_date);
  }
  try {
    const data = await useFetch(
      `${API_SERVER_URL}/v1/campaign-workers-stats/?${params.toString()}`
    );
    tableData.value = data;

    const categories = data.map((item) => item.campaign_name);
    const totalWorkers = data.map((item) => item.total_workers);
    const outWorkers = data.map((item) => item.total_out_workers);
    const workingWorkers = data.map(
      (item) => item.total_workers - item.total_out_workers
    );

    series.value = [
      {
        name: "Tổng LĐ",
        data: totalWorkers,
      },
      {
        name: "LĐ Đã nghỉ",
        data: outWorkers,
      },
      {
        name: "LĐ đang làm",
        data: workingWorkers,
      },
    ];

    chartOptions.xaxis = {
      ...chartOptions.xaxis,
      categories,
    };
  } catch (error) {
    console.error("Lỗi khi load campaign stats:", error);
  } finally {
    isLoading.value = false;
  }
}

async function setFilter(filter) {
  filterType.value = { ...filter };
  await loadCampaignStats(filter);
  showFilterModal.value = false;
}

const filterLabel = computed(() => {
  if (!filterType.value.filter_type || !filterType.value.selected_date)
    return "Tất cả";
  switch (filterType.value.filter_type) {
    case "date":
    case "day":
      return `Ngày: ${filterType.value.selected_date}`;
    case "month": {
      const [year, month] = filterType.value.selected_date.split("-");
      return `Tháng: ${month}/${year}`;
    }
    case "year":
      return `Năm: ${filterType.value.selected_date.split("-")[0]}`;
    case "week":
      if (filterType.value.selected_week) {
        const [year, week] = filterType.value.selected_week.split("-W");
        return `Tuần: ${week}/${year}`;
      }
      return "Tuần";
    default:
      return "Tất cả";
  }
});

watch(
  () => props.reportData,
  () => {
    if (props.reportData["campaign-stats"]) {
      loadCampaignStats();
    }
  },
  { deep: true }
);

onMounted(() => {
  loadCampaignStats();
});
</script>

<template>
  <BCard no-body class="border p-2 rounded h-100">
    <BCardHeader class="align-items-center d-flex">
      <BCardTitle class="mb-0 flex-grow-1">
        Biểu đồ số lượng lao động theo chiến dịch
      </BCardTitle>
      <div class="flex-shrink-0">
        <div class="dropdown card-header-dropdown">
          <a
            class="text-reset dropdown-btn"
            href="#"
            v-b-modal.modal__filter--bar-chart
          >
            <span class="fw-semibold text-uppercase fs-12">Lọc theo: </span>
            <span class="text-muted">
              {{ filterLabel }}
              <i class="mdi mdi-chevron-down ms-1"></i>
            </span>
          </a>
        </div>
      </div>
    </BCardHeader>
    <BCardBody class="pb-0">
      <template v-if="isLoading">
        <div colspan="5" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <div class="mt-2">Đang tải dữ liệu...</div>
        </div>
      </template>
      <template v-else-if="tableData?.length > 0">
        <apexchart
          class="apex-charts"
          height="341"
          dir="ltr"
          :series="series"
          :options="chartOptions"
        />
      </template>
      <template v-else>
        <div class="text-center text-muted py-5">
          <i class="ri-information-line fs-24 d-block mb-2"></i>
          Không có dữ liệu để hiển thị
        </div>
      </template>
    </BCardBody>
  </BCard>

  <Modal
    id="modal__filter--bar-chart"
    v-model="showFilterModal"
    title="Biểu đồ số lượng lao động theo chiến dịch"
    hideFooter
  >
    <FilterDateTime
      @cancel="showFilterModal = false"
      @filter-json="setFilter"
    ></FilterDateTime>
  </Modal>
</template>
