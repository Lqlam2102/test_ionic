<script setup>
import { ref, computed, defineProps, useAttrs } from "vue";
import getChartColorsArray from "../common/getChartColorsArray";
import {} from "vue";

// Props
const props = defineProps({
  reportData: {
    type: Object,
    default: () => ({}),
  },
});
const attrs = useAttrs();
// Chart state
const series = computed(() => {
  let widgets = props.reportData;
  const activeItem = widgets.find((w) => w.key === "active_workers");
  const inactiveItem = widgets.find((w) => w.key === "inactive_workers");

  return [Number(activeItem?.counter) || 0, Number(inactiveItem?.counter) || 0];
});
const chartOptions = ref({
  labels: ["Đang làm", "Đã nghỉ"],
  chart: {
    type: "pie",
  },
  dataLabels: {
    enabled: true,
  },
  plotOptions: {
    pie: {
      size: 100,
      donut: {
        size: "70%",
      },
      dataLabels: {
        offset: -10,
      },
    },
  },
  legend: {
    show: false,
  },
  colors: getChartColorsArray(
    '["--vz-success", "--vz-danger", "--vz-primary"]'
  ),
});
</script>

<template>
  <apexchart
    class="apex-charts"
    dir="ltr"
    v-bind="attrs"
    :series="series"
    :options="chartOptions"
  />
</template>
