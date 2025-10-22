<script setup>
import { computed, defineProps } from "vue";
import getChartColorsArray from "@/app_dashboard_reports/common/getChartColorsArray";

// 1. Define props for two independent datasets
const props = defineProps({
  compareData: {
    type: Array,
    default: () => [],
  },
  compareName: {
    type: String,
    default: "Dữ liệu so sánh",
  },
  compareType: {
    type: String,
    default: "area",
  },

  reportData: {
    type: Array,
    default: () => [],
  },
  reportName: {
    type: String,
    default: "Dữ liệu báo cáo",
  },
  reportType: {
    type: String,
    default: "bar",
  },
});

const maxLen = computed(() =>
  Math.max(props.compareData.length, props.reportData.length)
);

const compareTotals = computed(() =>
  Array.from(
    { length: maxLen.value },
    (_, i) => props.compareData[i] ?? { trunc: "", total: 0 }
  )
);

const reportTotals = computed(() =>
  Array.from(
    { length: maxLen.value },
    (_, i) => props.reportData[i] ?? { trunc: "", total: 0 }
  )
);

// 2. Build two series from the two props
const series = computed(() => [
  {
    name: props.compareName,
    type: props.compareType,
    data: compareTotals.value.map((item) => item.total ?? 0),
  },
  {
    name: props.reportName,
    type: props.reportType,
    data: reportTotals.value.map((item) => item.total ?? 0),
  },
]);

// 3. Chart options keyed off the two series
const chartOptions = computed(() => {
  // tooltip formatters for each series
  const tooltipY = series.value.map((_, i) => ({
    formatter: (y) => {
      if (typeof y !== "number") return y;
      // series 1: plain int; series 2: formatted as $xx.k
      return i === 1 ? `${y.toFixed(0)}` : y.toFixed(0);
    },
  }));
  const colors = getChartColorsArray('["--vz-primary","--vz-success"]');

  return {
    chart: { height: 370, toolbar: { show: true } },
    stroke: { curve: "straight", dashArray: [0, 0], width: [2, 0] },
    fill: { opacity: [0.1, 0.9] },
    markers: { size: [0, 0], strokeWidth: 2, hover: { size: 4 } },
    xaxis: {
      categories: reportTotals.value.map((i) => i.trunc),
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    grid: {
      show: true,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { top: 0, right: -2, bottom: 15, left: 10 },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: -5,
      markers: { width: 9, height: 9, radius: 6 },
      itemMargin: { horizontal: 10, vertical: 0 },
    },
    plotOptions: { bar: { columnWidth: "30%", barHeight: "70%" } },
    colors,
    tooltip: {
      shared: true,
      intersect: false,
      y: tooltipY,
    },
  };
});
</script>

<template>
  <BCard no-body>
    <BCardBody class="p-0 pb-2">
      <div class="w-100">
        <apexchart
          class="apex-charts"
          height="370"
          type="line"
          dir="ltr"
          :series="series"
          :options="chartOptions"
        />
      </div>
    </BCardBody>
  </BCard>
</template>
