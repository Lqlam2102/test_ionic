<script setup>
import { computed, defineProps } from "vue";
import getChartColorsArray from "@/app_dashboard_reports/common/getChartColorsArray";

const props = defineProps({
  charts: {
    type: Object,
    required: true,
  },
  chartType: {
    type: String,
    default: "interview_candidates", // Loại biểu đồ mặc định
  },
  reportName: {
    type: String,
    default: "Dữ liệu báo cáo",
  },
  compareName: {
    type: String,
    default: "Dữ liệu so sánh",
  },
});

// 1. Lấy mảng raw từ current và compare
const rawCurrent = computed(() => {
  return props.chartType === "interview_candidates"
    ? props.charts.current?.interview_candidates || []
    : props.charts.current?.quanly_workers || [];
});

const rawCompare = computed(() => {
  return props.chartType === "interview_candidates"
    ? props.charts.compare?.interview_candidates || []
    : props.charts.compare?.quanly_workers || [];
});

// 2. Tính độ dài lớn nhất
const maxLen = computed(() =>
  Math.max(rawCurrent.value.length, rawCompare.value.length)
);

// 3. Pad cả 2 mảng về cùng độ dài maxLen
const padTemplate = computed(() => {
  // xác định template object chung cho mỗi chartType
  if (props.chartType === "interview_candidates") {
    return {
      trunc: "",
      total: 0,
      total_passed_interviews: 0,
      total_unpassed_interviews: 0,
    };
  }
  return {
    trunc: "",
    total_active_workers: 0,
    total_inactive_workers: 0,
  };
});

const paddedCurrent = computed(() =>
  Array.from(
    { length: maxLen.value },
    (_, i) => rawCurrent.value[i] ?? padTemplate.value
  )
);

const paddedCompare = computed(() =>
  Array.from(
    { length: maxLen.value },
    (_, i) => rawCompare.value[i] ?? padTemplate.value
  )
);

// 4. Tạo categories từ paddedCurrent (hoặc paddedCompare, đều có trùng trunc)
const categories = computed(() =>
  paddedCurrent.value.map((item) => item.trunc)
);

// 5. Build series: bar lấy từ paddedCurrent, line lấy từ paddedCompare
const series = computed(() => {
  if (props.chartType === "interview_candidates") {
    return [
      {
        name: `Tổng phỏng vấn(${props.reportName})`,
        type: "bar",
        data: paddedCurrent.value.map((i) => i.total || 0),
      },
      {
        name: `Phỏng vấn trượt(${props.reportName})`,
        type: "bar",
        data: paddedCurrent.value.map((i) => i.total_unpassed_interviews || 0),
      },
      {
        name: `Phỏng vấn đạt(${props.compareName})`,
        type: "area",
        data: paddedCompare.value.map((i) => i.total_passed_interviews || 0),
      },
    ];
  } else {
    return [
      {
        name: `Đang làm(${props.reportName})`,
        type: "bar",
        data: paddedCurrent.value.map((i) => i.total_active_workers || 0),
      },
      {
        name: `Đã nghỉ(${props.reportName})`,
        type: "bar",
        data: paddedCurrent.value.map((i) => i.total_inactive_workers || 0),
      },
      {
        name: `Đang làm(${props.compareName})`,
        type: "area",
        data: paddedCompare.value.map((i) => i.total_active_workers || 0),
      },
    ];
  }
});
const chartOptions = computed(() => {
  const colors = getChartColorsArray(
    '["--vz-primary","--vz-success"]'
  );

  const tooltipY = series.value.map((_, i) => ({
    formatter: (y) => {
      if (typeof y !== "number") return y;
      return i === 1 ? `${y.toFixed(0)}` : y.toFixed(0);
    },
  }));
  return {
    chart: {
      height: 370,
      stacked: props.chartType === "quanly_workers",
      toolbar: { show: true },
    },
    stroke: { curve: "smooth", dashArray: [0, 0, 0], width: [2, 0, 2] },
    plotOptions: { bar: { columnWidth: "30%", barHeight: "70%" } },
    xaxis: {
      tickAmount: 12,
      categories: categories.value,
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: {
        show: true,
        rotate: -45,
        style: { colors: getChartColorsArray('["--vz-body-color"]') },
      },
    },
    yaxis: {
      title: { text: "Số lượng" },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: -5,
      markers: { width: 9, height: 9, radius: 6 },
      itemMargin: { horizontal: 10, vertical: 0 },
    },
    grid: {
      show: true,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { top: 0, right: -2, bottom: 15, left: 10 },
    },
    colors,
    tooltip: {
      shared: true,
      intersect: false,
      y: tooltipY,
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        return opts.seriesType === "line" ? val : "";
      },
    },
    // bật fill với opacity riêng cho mỗi series
    fill: {
      type: ["solid", "solid", "solid"],
      opacity: [1, 1, 0.1], // area = 0.3
    },
    markers: { size: [0, 0], strokeWidth: 2, hover: { size: 4 } },
  };
});
</script>

<template>
  <BCard class="mb-1" no-body>
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
