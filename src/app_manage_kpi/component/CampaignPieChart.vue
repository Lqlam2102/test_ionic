<template>
  <div class="campaign-chart">
    <h3 class="campaign-title">{{ campaignData.campaign_name }}</h3>
    <p class="campaign-total">Tổng KPI: {{ campaignData.total_kpi }}</p>

    <ApexChart
      type="pie"
      :series="series"
      :options="chartOptions"
      height="350"
    />

    <ul class="custom-legend">
      <li v-for="(lbl, i) in labels" :key="i">
        <span
          class="legend-marker"
          :style="{ backgroundColor: colors[i] }"
        ></span>
        {{ lbl }} — {{ series[i] }} KPI ({{ percentages[i] }}%)
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import ApexChart from "vue3-apexcharts";

const props = defineProps({
  campaignData: {
    type: Object,
    required: true,
    default: () => ({
      campaign_name: "",
      total_kpi: 0,
      departments: [],
    }),
  },
});

// 1. KPI của từng phòng
const deptSeries = computed(() =>
  props.campaignData?.departments?.length
    ? props.campaignData.departments.map((d) => d.kpi)
    : []
);
const deptLabels = computed(() =>
  props.campaignData?.departments?.length
    ? props.campaignData.departments.map((d) => d.department_name)
    : []
);

// 2. Tính phần còn lại
const sumAllocated = computed(() =>
  deptSeries.value.reduce((sum, v) => sum + v, 0)
);
const remaining = computed(() =>
  Math.max(props.campaignData.total_kpi - sumAllocated.value, 0)
);

// 3. Series + labels với slice “Chưa phân bổ”
const series = computed(() =>
  remaining.value > 0
    ? [...deptSeries.value, remaining.value]
    : deptSeries.value
);
const labels = computed(() =>
  remaining.value > 0 ? [...deptLabels.value, "Chưa phân bổ"] : deptLabels.value
);

// 4. Tính % cho mỗi slice dựa trên total_kpi
const percentages = computed(() => {
  const total = props.campaignData.total_kpi || 1;
  return series.value.map((v) => ((v / total) * 100).toFixed(2));
});

// 5. Màu cho từng slice
const colors = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#546E7A",
  "#26a69a",
  "#D10CE8",
  "#E0E0E0", // màu cho phần 'Chưa phân bổ'
];

// 6. Cấu hình ApexCharts: dataLabels hiển thị cả giá trị và %
const chartOptions = computed(() => ({
  chart: {
    type: "pie",
    toolbar: { show: false },
  },
  labels: labels.value,
  colors: colors.slice(0, labels.value.length),
  legend: { show: false },
  dataLabels: {
    formatter: (val) => {
      //   const idx = opts.seriesIndex;
      //   const raw = opts.w.config.series[idx];
      // val là % theo mặc định, raw là KPI
      return `${val.toFixed(2)}%`;
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `${val}`,
    },
  },
  noData: {
    text: "Không có dữ liệu",
    align: "center",
    verticalAlign: "middle",
    style: { color: "#888", fontSize: "14px" },
  },
}));
</script>

<style scoped>
.campaign-chart {
  max-width: 450px;
  margin: auto;
  text-align: center;
}

.campaign-title {
  margin-bottom: 4px;
}

.campaign-total {
  margin-bottom: 12px;
  font-weight: bold;
}

.custom-legend {
  list-style: none;
  padding: 0;
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.custom-legend li {
  display: flex;
  align-items: center;
  margin: 4px 8px;
  font-size: 14px;
}

.legend-marker {
  width: 12px;
  height: 12px;
  display: inline-block;
  margin-right: 6px;
  border-radius: 2px;
}
</style>
