<script>
import getChartColorsArray from "@/app_dashboard_reports/common/getChartColorsArray";

import Revenue from "./revenue";

export default {
  components: {
    Revenue
  },
  data() {
    return {
      date: "2022-01-01 to 2022-01-31",
      config: {
        mode: "range",
      },
      series: [44, 55, 41, 17, 15],
      chartOptions: {
        labels: ["Direct", "Social", "Email", "Other", "Referrals"],
        chart: {
          height: 333,
          type: "donut",
        },
        legend: {
          position: "bottom",
        },
        stroke: {
          show: false,
        },
        dataLabels: {
          dropShadow: {
            enabled: false,
          },
        },
        colors: getChartColorsArray(
          '["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]'
        ),
      },
    };
  },
  methods: {
    rightcolumn() {
      if (
        document
          .querySelector(".layout-rightside-col")
          .classList.contains("d-block")
      ) {
        document
          .querySelector(".layout-rightside-col")
          .classList.remove("d-block");
        document.querySelector(".layout-rightside-col").classList.add("d-none");
      } else {
        document
          .querySelector(".layout-rightside-col")
          .classList.remove("d-none");
        document
          .querySelector(".layout-rightside-col")
          .classList.add("d-block");
      }
    },

    resizerightcolumn() {
      const element = document.querySelector(".layout-rightside-col");

      if (element) {
        if (window.outerWidth < 1699) {
          element.classList.remove("d-block");
          element.classList.add("d-none");
        } else {
          element.classList.add("d-block");
          element.classList.remove("d-none");
        }
      }

      if (document.documentElement.getAttribute("data-layout") === "semibox") {
        element.classList.remove("d-block");
        element.classList.add("d-none");
      }
    },

    hiderightcolumn() {
      const element = document.querySelector(".layout-rightside-col");
      if (element.classList.contains("d-block")) {
        element.classList.remove("d-block");
        element.classList.add("d-none");
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.resizerightcolumn);
  },
};
</script>

<template>
  <Revenue />
  <Revenue />
</template>
