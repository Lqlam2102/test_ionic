<template>
  <div class="department-chart">
    <h3 class="chart-title">{{ departmentData.department_name }}</h3>
    <p class="chart-subtitle">{{ departmentData.campaign_name }}</p>
    <p class="chart-total">
      Tổng KPI phòng ban: {{ departmentData.total_kpi_department }}
    </p>

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
import { computed, defineProps } from "vue";
import ApexChart from "vue3-apexcharts";

const props = defineProps({
  departmentData: {
    type: Object,
    required: true,
    default: () => ({
      department_name: "",
      campaign_name: "",
      total_kpi_department: 0,
      users: [],
    }),
  },
});

// Extract KPI values
const userSeries = computed(() =>
  props.departmentData?.users?.length
    ? props.departmentData.users.map((u) => u.kpi)
    : []
);
const userLabels = computed(() =>
  props.departmentData?.users?.length
    ? props.departmentData.users.map((u) => u.user_name)
    : []
);

// Calculate remaining KPI
const sumUserKPI = computed(() =>
  userSeries.value.reduce((sum, kpi) => sum + kpi, 0)
);
const remainingKPI = computed(() =>
  Math.max(props.departmentData.total_kpi_department - sumUserKPI.value, 0)
);

// Final series and labels including "Chưa phân bổ"
const series = computed(() =>
  remainingKPI.value > 0
    ? [...userSeries.value, remainingKPI.value]
    : userSeries.value
);
const labels = computed(() =>
  remainingKPI.value > 0
    ? [...userLabels.value, "Chưa phân bổ"]
    : userLabels.value
);

// Calculate percentages
const percentages = computed(() => {
  const total = props.departmentData.total_kpi_department || 1;
  return series.value.map((kpi) => ((kpi / total) * 100).toFixed(2));
});

// Slice colors
const colors = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#546E7A",
  "#26a69a",
  "#D10CE8",
  "#E0E0E0", // "Chưa phân bổ"
];

// Chart config
const chartOptions = computed(() => ({
  chart: { type: "pie", toolbar: { show: false } },
  labels: labels.value,
  colors: colors.slice(0, labels.value.length),
  legend: { show: false },
  dataLabels: {
    formatter: (val) => `${val.toFixed(2)}%`,
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
.department-chart {
  max-width: 450px;
  margin: auto;
  text-align: center;
}

.chart-title {
  margin-bottom: 4px;
}

.chart-subtitle {
  margin-bottom: 4px;
  font-style: italic;
  color: #555;
}

.chart-total {
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
