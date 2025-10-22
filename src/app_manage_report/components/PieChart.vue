<script setup>
import { computed, defineProps } from "vue";
import getChartColorsArray from "@/app_dashboard_reports/common/getChartColorsArray";
const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
  name: {
    type: String,
    default: 'SỐ LƯỢNG ỨNG VIÊN THEO TRẠNG THÁI',
  },
  labelField: {
    type: String,
    default: 'status_name', // Trường mặc định để lấy nhãn
  },
  valueField: {
    type: String,
    default: 'count', // Trường mặc định để lấy giá trị
  },
});

const totalCount = computed(() =>
  props.chartData.reduce((sum, item) => sum + (item[props.valueField] || 0), 0)
);

const percentSeries = computed(() => {
  if (totalCount.value === 0) {
    return props.chartData.map(() => 0);
  }
  return props.chartData.map((item) => {
    const cnt = item[props.valueField] ?? 0;
    const pct = (cnt / totalCount.value) * 100;
    return +pct.toFixed(2);
  });
});

const chartOptions = computed(() => {
  const labels = props.chartData.map((item) => item[props.labelField]);
  const defaultColors = [
    "--vz-danger",
    "--vz-dark",
    "--vz-secondary",
    "--vz-success",
    "--vz-info",
    "--vz-warning",
  ];

  return {
    chart: { toolbar: { show: false } },
    labels,
    colors: getChartColorsArray(
      JSON.stringify(defaultColors.slice(0, labels.length))
    ),
    legend: {
      position: "bottom",
      fontSize: "14px",
      markers: { radius: 6 },
      itemMargin: { horizontal: 8, vertical: 6 },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
      style: { fontSize: "13px" },
    },
    tooltip: {
      y: {
        formatter(value, opts) {
          const idx = opts.seriesIndex;
          const count = props.chartData[idx]?.[props.valueField] || 0;
          return `${count} ứng viên (${value.toFixed(2)}%)`;
        },
      },
    },
  };
});
</script>
<template>
  <div class="card-header border-0 align-items-center d-flex">
    <h4
      class="card-title mb-0 flex-grow-1 text-center text-center fw-bold fs-17"
    >
      {{ props.name }}
    </h4>
  </div>
  <apexchart
    v-if="percentSeries.length > 0 && chartOptions?.colors?.length > 0"
    type="pie"
    height="350"
    :series="percentSeries"
    :options="chartOptions"
  />
</template>
