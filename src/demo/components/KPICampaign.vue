<template>
  <div class="h-100 d-flex flex-column">
    <div class="card-header border-0 align-items-center d-flex">
      <h4 class="card-title mb-0 flex-grow-1 text-center fw-bold fs-17">
        TỈ LỆ HOÀN THÀNH KPI/CHIẾN DỊCH
      </h4>
    </div>

    <BCardHeader class="p-0 border-0 bg-light-subtle">
      <BRow class="g-0 text-center">
        <BCol cols="4">
          <div class="p-3 border border-dashed border-start-0">
            <h5 class="mb-1">{{ formatNumber(props.report?.total_kpi) }}</h5>
            <p class="text-muted mb-0">Tổng KPI được giao</p>
          </div>
        </BCol>
        <BCol cols="4">
          <div class="p-3 border border-dashed border-start-0">
            <h5 class="mb-1">{{ formatNumber(props.report?.completed) }}</h5>
            <p class="text-muted mb-0">Số hoàn thành</p>
          </div>
        </BCol>
        <BCol cols="4">
          <div class="p-3 border border-dashed border-start-0 border-end-0">
            <h5
              class="mb-1"
              :class="[getClassesColor(props.report?.completion_rate)]"
            >
              {{ formatPercent(props.report?.completion_rate) }}
            </h5>
            <p class="text-muted mb-0">Tỷ lệ hoàn thành</p>
          </div>
        </BCol>
      </BRow>
    </BCardHeader>

    <BCardBody class="p-0 pb-2 flex-1 overflow-auto">
      <template v-for="campaign in campaigns" :key="campaign.id">
        <div v-if="campaign.total_kpi" class="px-2 py-2 mt-1">
          <p class="mb-1">
            {{ campaign.name }} ({{ campaign.worker_count }}/{{
              campaign.total_kpi
            }})
            <span
              class="float-end"
              :class="[getClassesColor(getDeltaPercent(campaign))]"
            >
              {{ getDeltaPercent(campaign) }}% Hoàn thành
            </span>
          </p>
          <div class="progress mt-2" style="height: 6px">
            <div
              class="progress-bar progress-bar-striped bg-primary"
              role="progressbar"
              :style="{ width: getWidth(campaign) }"
              :aria-valuenow="getAriaValue(campaign)"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </template>
    </BCardBody>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  report: {
    type: Object,
    required: true,
  },
});

const campaigns = computed(() => {
  const campains = props.report.campaigns;
  console.log(campains);
  if (!campains) return [];
  return campains.filter((campaign) => campaign.total_kpi);
});

const getClassesColor = (p) => {
  if (p >= 75) return "text-success";
  else if (p >= 50) return "text-warning";
  else return "text-danger";
};

// Format số có phân ngàn
function formatNumber(n) {
  return n.toLocaleString();
}
function formatPercent(p) {
  // nếu p không phải số hoặc vô hạn (division by zero) → 0%
  if (typeof p !== "number" || !isFinite(p)) {
    return "0%";
  }
  return `${p}%`;
}

// Trả về chuỗi CSS width (0–100%)
function getWidth(campaign) {
  if (!campaign.total_kpi || campaign.total_kpi === 0) {
    return "100%";
  }

  // ratio giới hạn tối đa 1
  const ratio = Math.min(campaign.worker_count / campaign.total_kpi, 1);
  return formatPercent(ratio);
}

// Trả về giá trị aria-valuenow (0–100)
function getAriaValue(campaign) {
  if (!campaign.total_kpi || campaign.total_kpi === 0) {
    return 100;
  }

  // tính và ép vào [0, 100]
  const percent = Math.round(
    Math.min(campaign.worker_count / campaign.total_kpi, 1) * 100
  );
  return percent;
}
// Tính phần trăm chênh lệch: (đã tuyển – tổng KPI) / tổng KPI * 100
const getDeltaPercent = (campaign) => {
  const { worker_count, total_kpi } = campaign;
  if (!total_kpi) {
    // Nếu tổng KPI = 0, coi như đạt 100% (hoặc tuỳ bạn xử lý)
    return 100;
  }

  // Math.round trả về số nguyên và có thể âm
  return Math.round((worker_count / total_kpi) * 100);
};
</script>
